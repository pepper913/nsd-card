const draftKey='nsd.personnel.draft.v1';
function readDraft(){try{return JSON.parse(localStorage.getItem(draftKey))||{}}catch{return {}}}
function saveDraft(){
 try{localStorage.setItem(draftKey,JSON.stringify({data,sections,showGraphics,fluxCentered,style:selectedStyle}))}
 catch{$('status').textContent='브라우저에 기록을 저장할 수 없어요. PNG로 보관해 주세요.'}
}
let photoDatabase;
function openPhotoDatabase(){
 if(!photoDatabase)photoDatabase=new Promise((resolve,reject)=>{
   const request=indexedDB.open('nsd.personnel',1);
   request.onupgradeneeded=()=>request.result.createObjectStore('files');
   request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)
 });
 return photoDatabase
}
async function photoRecord(action,file){
 const db=await openPhotoDatabase();
 return new Promise((resolve,reject)=>{
   const tx=db.transaction('files',action==='get'?'readonly':'readwrite'),store=tx.objectStore('files');
   const request=action==='put'?store.put(file,'portrait'):store[action]('portrait');
   tx.oncomplete=()=>resolve(request.result);tx.onabort=()=>reject(tx.error);tx.onerror=()=>reject(tx.error)
 })
}
async function loadPortrait(file,version){
 const img=new Image(),url=URL.createObjectURL(file);
 try{img.src=url;await img.decode();if(version!==photoVersion)return false;photo(img);return true}
 finally{URL.revokeObjectURL(url)}
}
function chapterEditor(box,group){
 function addRow(entry){
   const [key,title]=entry,wrap=document.createElement('div');wrap.className='wide chapter';
   const name=document.createElement('input');name.value=title;name.setAttribute('aria-label','항목 이름');name.placeholder='항목 이름';
   const body=document.createElement('textarea');body.value=data[key]||'';body.setAttribute('aria-label',(title||'새 항목')+' 내용');
   name.oninput=()=>{entry[1]=name.value;body.setAttribute('aria-label',(name.value||'새 항목')+' 내용');saveDraft();render()};
   body.oninput=()=>{data[key]=body.value;saveDraft();render()};
   const remove=document.createElement('button');remove.type='button';remove.className='removeChapter';remove.textContent='삭제';remove.setAttribute('aria-label','항목 삭제');
   remove.onclick=()=>{sections[group]=sections[group].filter(([id])=>id!==key);delete data[key];wrap.remove();saveDraft();render();add.focus()};
   wrap.append(name,remove,body);box.insertBefore(wrap,add);return name
 }
 const add=document.createElement('button');add.type='button';add.className='wide addChapter';add.textContent='+ 항목 추가';box.append(add);
 for(const entry of sections[group])addRow(entry);
 add.onclick=()=>{const entry=['custom-'+crypto.randomUUID(),'새 항목'];sections[group].push(entry);const input=addRow(entry);saveDraft();render();input.focus();input.select()}
}
