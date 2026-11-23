const editorialLayouts={gate:'이클립스',arcade:'아케이드',redshift:'레드시프트',flux:'플럭스'};
function layoutSample(c,id){
 if(['arcade','redshift','flux'].includes(id)){
   const t=palette(id);c.fillStyle=t.paper;c.fillRect(0,0,210,68);c.save();c.scale(.32,.32);motif(c,id,656,212,t);c.restore();return
 }
 c.fillStyle='#191323';c.fillRect(0,0,210,68);
 for(let i=0;i<6;i++)ellipse(c,104,32,28+i*9,28+i*3,-.2,'#b0ffb0');c.fillStyle='#dde8ff';c.fillRect(45,48,120,4)
}
function renderLayout(id){
 const {paper,ink,accent,muted,rule:ruleColor}=palette(id);
 const ops=[];
 function box(x,y,w,h,color){ops.push(()=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h)})}
 function rule(x,y,xx,yy,color){ops.push(()=>line(ctx,x,y,xx,yy,color))}
 function words(value,x,y,w,size,{weight='',color=ink,center=false,leading=size*1.55}={}){
   const face=weight+' '+size+'px '+recordFont;ctx.font=face;const ls=lines(value,w);
   ops.push(()=>{ctx.font=face;ctx.textAlign=center?'center':'left';ctx.textBaseline='top';ctx.fillStyle=color;ls.forEach((l,i)=>ctx.fillText(l,x+(center?w/2:0),y+i*leading))});
   return y+ls.length*leading;
 }
 function field(key,label,x,y,w){words(label,x,y,w,11,{color:muted});return words(data[key],x,y+19,w,16,{weight:'bold'})+13}
 function fieldRow(items,x,y,w,draw=field){
   
   const col=(w+20)/items.length;return Math.max(...items.map(([k,l],i)=>draw(k,l,x+i*col,y,col-20)))
 }
 function passage(key,label,x,y,w){rule(x,y,x+w,y,ruleColor);const labelEnd=words(label,x,y+14,w,15,{color:accent,weight:'bold'});return words(data[key],x,labelEnd+7,w,15,{leading:25})+24}
 function art(x,y,w,h,round){const img=portrait;ops.push(()=>{ctx.save();ctx.translate(x,y);ctx.beginPath();if(round)ctx.arc(w/2,h/2,w/2,0,2*Math.PI);else ctx.rect(0,0,w,h);if(!img){ctx.fillStyle=paper;ctx.fill();ctx.strokeStyle=ruleColor;ctx.lineWidth=1;ctx.stroke();ctx.restore();return}ctx.clip();const k=Math.max(w/img.naturalWidth,h/img.naturalHeight),sw=w/k,sh=h/k;ctx.drawImage(img,(img.naturalWidth-sw)/2,(img.naturalHeight-sh)/2,sw,sh,0,0,w,h);ctx.restore()})}
 function abilityRows(x,y,w){for(let i=0;i<sections.ability.length;i+=2)y=fieldRow(sections.ability.slice(i,i+2),x,y,w,passage);return y}
 function settingRows(x,y,w,start=0){for(const [k,l] of sections.setting.slice(start))y=passage(k,l,x,y,w);return y}
 let bottom;
 if(id==='arcade'||id==='redshift'||id==='flux'){
   const t=palette(id);
   const details=[['age','나이'],['gender','성별'],['origin','출신지'],['grade','활동 등급'],['role','구분'],['branch','소속 지부'],['job','담당 업무'],['appointed','임용일']];
   function nameAt(x,y,w,size,center=false){
     y=words(data.name,x,y,w,size,{weight:'bold',center,leading:size*1.25});
     y=words(data.native,x,y+4,w,18,{color:muted,center});
     return y
   }
   function graphic(x,y,w,h){if(!showGraphics)return;ops.push(()=>{ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.rect(0,0,w,h);ctx.clip();motif(ctx,id,w,h,t);ctx.restore()})}

   if(id==='arcade'){
     words('NSD   /   남해권 지부',38,24,500,11,{color:muted});
     const h=330;graphic(35,62,630,h);
     const frame=arcadeFrame(630,h),inset=12;
     art(35+315-frame.x+inset,62+h/2-frame.y+inset,2*(frame.x-inset),2*(frame.y-inset),false);
     let y=nameAt(45,72+h,610,42,true)+18;
     const items=details;for(let i=0;i<items.length;i+=4)y=fieldRow(items.slice(i,i+4),39,y,622);
     y=abilityRows(39,y+8,622);bottom=settingRows(39,y,622);
   }else if(id==='redshift'){
     words('NSD',32,27,420,73,{weight:'bold',leading:80});graphic(484,25,182,88);
     let y=nameAt(34,125,632,40)+15;rule(34,y,666,y,accent);y+=15;
     const top=y,photoSize=246,infoX=34+photoSize+32,infoWidth=666-infoX;
     let infoY=fieldRow(details.slice(0,2),infoX,top,infoWidth);
     infoY=fieldRow(details.slice(2,4),infoX,infoY,infoWidth);
     infoY=fieldRow(details.slice(4,6),infoX,infoY,infoWidth);
     for(const [key,label] of details.slice(6))infoY=field(key,label,infoX,infoY,infoWidth);
     y=Math.max(infoY,top+photoSize);rule(infoX-16,top,infoX-16,y,ruleColor);
     art(34,Math.round((top+y-photoSize)*scale/2)/scale,photoSize,photoSize,false);
     y+=24;if(sections.setting.length)y=passage(...sections.setting[0],34,y,632);
     y=abilityRows(34,y,632);
     bottom=settingRows(34,y,632,1);
   }else{
     words('NSD   /   남해권 지부',36,32,610,13,{color:muted});let y=nameAt(fluxCentered?35:34,78,630,58,fluxCentered)+10;
     graphic(0,y,700,276);art(fluxCentered?(700-183)/2:42,y+12,183,245,false);y+=300;
     const items=details;for(let i=0;i<items.length;i+=3)y=fieldRow(items.slice(i,i+3),40,y,620);
     for(const [k,l] of [...sections.setting.slice(0,1),...sections.ability,...sections.setting.slice(1)]){rule(40,y,660,y,ruleColor);const end=words(l,40,y+15,145,14,{color:accent,weight:'bold'});y=Math.max(end,words(data[k],202,y+15,458,15,{leading:25}))+24}
     bottom=y
   }
 }else{
   const hero=324;
   box(0,0,700,hero+32,mix(paper,accent,.055));if(showGraphics){ops.push(()=>{ctx.save();for(let i=0;i<10;i++)ellipse(ctx,350,173,120+i*24,49+i*9,-.27,mix(paper,accent,.24));ctx.restore()})}
   words('NSD  /  남해권 지부',32,24,300,13,{weight:'bold'});words('GATE OBSERVATION',438,24,230,13,{color:accent});
   art(245,85,210,210,true);
   for(const [key,label,x] of [['grade','활동 등급',0],['role','구분',455]]){
     words(label,x,163,245,12,{color:muted,center:true});
     words(data[key],x,187,245,24,{color:accent,weight:'bold',center:true});
   }
   let y=hero+12;y=words(data.name,38,y,624,54,{center:true,weight:'bold',leading:68});
   y=words(data.native,38,y,624,17,{color:accent,center:true});
   y+=20;y=fieldRow([['age','나이'],['gender','성별'],['origin','출신지']],35,y,630);
   y=fieldRow([['branch','소속 지부'],['appointed','임용일'],['job','담당 업무']],35,y,630);
   y=abilityRows(35,y,630);
   if(sections.setting.length)box(0,y,12,40,accent);bottom=settingRows(35,y,630);
 }
 if(data.credit?.trim())bottom=words('이미지 출처 · '+data.credit.trim(),38,bottom+12,624,11,{color:muted});
 const height=Math.max(990,Math.ceil(bottom+70));rule(36,height-48,664,height-48,muted);words('NSD 남해권 지부 인사운영팀',38,height-36,310,11,{color:muted});
 canvas.width=W*scale;canvas.height=height*scale;ctx.scale(scale,scale);ctx.fillStyle=paper;ctx.fillRect(0,0,W,height);ops.forEach(draw=>draw());$('size').textContent=canvas.width+' × '+canvas.height;
}
themes.gate={name:editorialLayouts.gate,paper:'#171422',ink:'#f4efff',muted:'#c4b9d4',accent:'#c3ff96',rule:'#584e65'};

themes.arcade={name:editorialLayouts.arcade,paper:'#efefec',ink:'#24282a',muted:'#51585a',accent:'#39494b',rule:'#a7afad'};
themes.redshift={name:editorialLayouts.redshift,paper:'#211e20',ink:'#f3eded',muted:'#c7bcba',accent:'#fa625c',rule:'#815955'};
themes.flux={name:editorialLayouts.flux,paper:'#101010',ink:'#f4f3f0',muted:'#c8c6c2',accent:'#ecece6',rule:'#5c5c58'};
function arcadeFrame(w,h){return {x:h*.43*.82+4,y:h*.43*.83}}
function motif(c,id,w,h,t){
 if(id==='arcade'){
   const x=w/2,y=h/2,r=h*.43,frame=arcadeFrame(w,h);
   for(let i=0;i<3;i++)ellipse(c,x,y,r*(1+i*.16),r*(1+i*.16),0,mix(t.paper,t.accent,.35));
   for(let i=0;i<32;i++){const a=i*Math.PI/16;line(c,x+Math.cos(a)*r,y+Math.sin(a)*r,x+Math.cos(a)*(r+5),y+Math.sin(a)*(r+5),t.accent)}
   for(const dx of [-1,1])for(const dy of [-1,1]){const xx=x+dx*frame.x,yy=y+dy*frame.y;line(c,xx,yy,xx-dx*17,yy,t.ink,3);line(c,xx,yy,xx,yy-dy*17,t.ink,3)}
   for(const xx of [w*.09,w*.91])for(let i=0;i<7;i++){c.beginPath();c.arc(xx,h*(.2+i*.1),3.3,0,Math.PI*2);c.fillStyle=mix(t.paper,t.accent,(i+1)/8);c.fill()}
 }else if(id==='redshift'){
   for(let i=0;i<11;i++)ellipse(c,w*.67,h*.46,w*.16*(i+1)/11,h*.37,-.35,t.accent);
   for(let i=0;i<4;i++)line(c,0,h*(.55+i*.09),w*.4,h*(.55+i*.09),mix(t.paper,t.accent,.5+i*.13));
 }else{
   for(let i=0;i<100;i++){const u=i/99;c.beginPath();for(let xx=0;xx<=w+2;xx+=3){const a=xx/w;const yy=h*(.55+.20*Math.sin(a*6+u*3)+.15*Math.sin(a*12-u*3)+.27*(u-.5)+.11*Math.sin(u*9+a*8));if(!xx)c.moveTo(xx,yy);else c.lineTo(xx,yy)}c.strokeStyle=mix(t.paper,t.accent,.075+.35*(.5+.5*Math.sin(i*.32)));c.lineWidth=.45+1.5*(.5+.5*Math.cos(i*.29));c.stroke()}
 }
}
