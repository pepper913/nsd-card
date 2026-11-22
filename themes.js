const recordFont='Pretendard,"Malgun Gothic","Apple SD Gothic Neo",sans-serif';
const themes = {
  standard: {name:'기본 흑백', paper:'#ffffff', ink:'#202426', rule:'#41474a', label:'#eff0ef', accent:'#41474a'},
  orbit: {name:'블루 오비트', paper:'#111626', ink:'#f1effb', rule:'#52617e', label:'#202d49', accent:'#91b9ff'},
};
let selectedStyle='standard';
function line(c,x,y,xx,yy,color,width=1){
  c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();
}
function ellipse(c,x,y,rx,ry,angle,color){
  c.beginPath();c.ellipse(x,y,rx,ry,angle,0,2*Math.PI);c.strokeStyle=color;c.lineWidth=.8;c.stroke();
}
function star(c,x,y,r,color){
  c.save();c.translate(x,y);c.beginPath();c.moveTo(0,-r);
  for(let i=0;i<4;i++){c.quadraticCurveTo(0,0,r,0);c.rotate(Math.PI/2)}
  c.closePath();c.fillStyle=color;c.fill();c.restore();
}
function headerArt(c,id){
  const t=palette(id);
  if(id==='orbit'){
    c.fillStyle=(changed(id)?t.accent:'#245df5');c.fillRect(0,0,210,68);c.fillStyle=(changed(id)?t.paper:'#10182f');c.fillRect(0,0,137,68);
    for(let i=0;i<22;i++)line(c,139+i*4,0,139+i*4,68,(changed(id)?t.paper+'55':'#15285355'),1.6);
    for(let i=0;i<9;i++)ellipse(c,86,37,63-i*6,45,0,(changed(id)?t.accent:'#76a4ff'));
    ellipse(c,86,37,63,16,-.42,(changed(id)?t.ink:'#e9daff'));line(c,8,37,159,37,(changed(id)?t.ink:'#e9daff'),.65);star(c,133,16,7,(changed(id)?t.ink:'#f3e3ff'));
  }else{
    c.fillStyle=(changed(id)?t.label:'#303830');c.fillRect(0,0,210,68);
    for(let x=0;x<210;x+=5)for(let y=0;y<68;y+=4){c.fillStyle='rgba(213,221,208,'+(.11+.18*Math.cos(x*.035+y*.023))+')';c.fillRect(x,y,1.5,1.5)}
    for(let i=0;i<12;i++){
      c.beginPath();for(let x=0;x<=210;x+=2){
        let y=35+Math.sin(x*.052+i*.24)*Math.cos(x*.017)*22+i*.65;
        if(x===0)c.moveTo(x,y);else c.lineTo(x,y)
      }c.strokeStyle=i===5?(changed(id)?t.accent:'#ccff7e'):(changed(id)?t.accent+'6b':'#aadd686b');c.lineWidth=i===5?2:.7;c.stroke()
    }
    line(c,151,0,151,68,(changed(id)?t.accent:'#c1ff4c'),.6);line(c,0,25,210,25,(changed(id)?t.accent:'#c1ff4c'),.6);star(c,151,25,17,(changed(id)?t.accent:'#baff49'));star(c,181,46,7,(changed(id)?t.accent:'#baff49'));
  }
}
function paintMasthead(c,id){
  const t=palette(id);c.save();c.fillStyle=t.ink;c.textAlign='left';
  c.font='bold '+(id==='orbit'?54:49)+'px '+recordFont;
  c.fillText('NSD',47,103);
  if(showGraphics){c.save();c.translate(443,44);c.beginPath();c.rect(0,0,210,68);c.clip();headerArt(c,id);c.restore()}
  line(c,47,119,653,119,t.accent,id==='pulse'?2:.85);
  if(id==='orbit'){
    for(let i=0;i<12;i++){c.fillStyle=i%2?(changed(id)?t.ink:'#a1bcff'):(changed(id)?t.accent:'#4874f7');c.fillRect(47+i*5,116+(i%2)*2,5,3)}
  }else{star(c,180,82,10,t.accent)}
  c.restore();
}
function styleControls(){
  const group=document.getElementById('styles');
  for(const [id,t] of Object.entries(themes)){
    const b=document.createElement('button');b.type='button';b.setAttribute('aria-pressed',String(id===selectedStyle));
    const sample=document.createElement('canvas');sample.width=210;sample.height=68;sample.setAttribute('aria-hidden','true');
    const c=sample.getContext('2d');
    if(id==='standard'){
      c.fillStyle='#fff';c.fillRect(0,0,210,68);for(let i=0;i<3;i++) {c.fillStyle='#e1e2e0';c.fillRect(15,12+i*14,36,12);line(c,15,24+i*14,194,24+i*14,'#7c7e7d')}
    }else if(Object.hasOwn(editorialLayouts,id))layoutSample(c,id);else headerArt(c,id);
    b.append(sample,document.createTextNode(t.name));b.onclick=()=>{selectedStyle=id;saveDraft();for(const btn of group.children)btn.setAttribute('aria-pressed',String(btn===b));syncColors();render()};group.append(b)
  }
}

const overrides={};
try{Object.assign(overrides,JSON.parse(localStorage.getItem('nsd.palettes.v1'))||{})}catch{}
function mix(a,b,f){return '#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-f)+parseInt(b.slice(i,i+2),16)*f).toString(16).padStart(2,'0')).join('')}
function changed(id){return Object.keys(overrides[id]||{}).length>0}
function palette(id){
 const t={...themes[id]};
 for(const k of ['paper','ink','accent'])if(/^#[a-f0-9]{6}$/i.test(overrides[id]?.[k]))t[k]=overrides[id][k];
 if(changed(id)){t.label=mix(t.paper,t.accent,.14);t.rule=mix(t.paper,t.ink,.40);t.muted=mix(t.paper,t.ink,.73)}
 return t
}
function syncColors(){syncGraphics();const t=palette(selectedStyle);for(const el of document.querySelectorAll('[data-color]'))el.value=t[el.dataset.color]}
function applyColors(){try{localStorage.setItem('nsd.palettes.v1',JSON.stringify(overrides))}catch{}syncColors();render()}
function colorControls(){
 for(const el of document.querySelectorAll('[data-color]'))el.oninput=()=>{overrides[selectedStyle]={...overrides[selectedStyle],[el.dataset.color]:el.value};applyColors()};
 document.getElementById('resetColors').onclick=()=>{delete overrides[selectedStyle];applyColors()};syncColors()
}
