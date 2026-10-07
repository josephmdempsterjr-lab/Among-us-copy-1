const $=i=>document.getElementById(i),rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.random()*a.length|0],dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),cap=s=>s[0].toUpperCase()+s.slice(1);
const sh=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const COLORS={red:'#c51111',blue:'#132ed1',green:'#117f2d',lime:'#50ef39',pink:'#ed54ba',rose:'#ecc0d3',purple:'#6b2fbc',brown:'#71491e',tan:'#92877d',grey:'#758593',white:'#d6e0f0',banana:'#fffebe',orange:'#ef7d0e',yellow:'#f5f557',cyan:'#38fedc'};
const RM=[['Cafeteria',500,30,400,220],['Weapons',1000,60,220,170],['O2',1000,270,120,100],['Navigation',1260,330,140,160],['Shields',1050,600,220,180],['Comms',720,680,160,120],['Storage',470,520,230,250],['Admin',760,380,200,140],['Electrical',310,560,140,140],['Lower Engine',60,600,220,200],['Security',300,350,120,160],['Reactor',40,330,180,200],['Upper Engine',60,60,220,200],['Medbay',330,90,150,150]];
const CO=[[470,140,40,50],[280,160,50,40],[140,260,50,70],[140,530,50,70],[220,400,80,50],[340,510,50,50],[280,640,40,50],[450,620,30,50],[540,250,50,270],[700,250,70,200],[900,100,100,50],[1050,230,50,40],[960,420,100,40],[1020,370,40,60],[1120,330,140,50],[1220,130,180,50],[1350,180,50,150],[1330,490,50,210],[1270,650,110,50],[900,520,50,120],[900,600,150,50],[700,700,30,40],[880,700,170,40]];
const DO=[['Medbay',470,140,40,50],['Electrical',340,510,50,50],['Security',220,400,80,50],['Storage',540,250,50,30],['Weapons',900,100,100,50],['Admin',700,400,70,50],['Shields',900,600,150,50]];
const ND={C:[700,150],K1:[565,200],K2:[565,380],ST:[585,645],MB:[400,160],M1:[490,165],M2:[300,180],UE:[170,160],U1:[165,295],RE:[165,430],R1:[165,565],LE:[170,700],S1:[260,425],SE:[360,430],S2:[365,535],EL:[380,630],E1:[300,665],E2:[465,645],HA:[735,330],HB:[735,430],AD:[900,460],W1:[950,125],WE:[1110,140],W2:[1075,250],O2:[1060,320],O3:[1190,355],NV:[1330,410],W3:[1290,155],W4:[1375,255],N1:[1355,600],N2:[1330,675],SH:[1160,690],A1:[925,580],A2:[1000,625],A3:[980,440],A4:[1040,400],CM:[800,740],T1:[715,720],T2:[965,720]};
const ADJ={};'C-K1,K1-K2,K2-ST,C-M1,M1-MB,MB-M2,M2-UE,UE-U1,U1-RE,RE-R1,R1-LE,RE-S1,S1-SE,SE-S2,S2-EL,LE-E1,E1-EL,EL-E2,E2-ST,C-HA,HA-HB,HB-AD,C-W1,W1-WE,WE-W2,W2-O2,O2-O3,O3-NV,WE-W3,W3-W4,W4-NV,NV-N1,N1-N2,N2-SH,AD-A1,A1-A2,A2-SH,AD-A3,A3-A4,A4-O2,ST-T1,T1-CM,CM-T2,T2-SH'.split(',').forEach(e=>{const[a,b]=e.split('-');(ADJ[a]=ADJ[a]||[]).push(b);(ADJ[b]=ADJ[b]||[]).push(a)});
const TK=[['Swipe Card',920,410,0],['Scan',400,210,1],['Asteroids',1150,100,1],['Fix Wiring',350,600,0],['Download Data',570,70,0],['Prime Shields',1220,740,0],['Align Engine',110,120,0],['Align Engine ',110,760,0],['Empty Garbage',650,570,1],['Calibrate Distributor',420,660,0],['Chart Course',1360,380,0],['Fuel Engines',520,730,0],['Unlock Manifolds',80,400,0],['Clean O2 Filter',1090,350,0],['Inspect Sample',360,130,0],['Upload Data',860,440,0]];
const VT=[['Upper Engine',100,230,0],['Medbay',440,110,0],['Reactor',70,500,1],['Security',330,380,1],['Lower Engine',250,780,2],['Electrical',420,690,2],['Weapons',1180,200,3],['Navigation',1380,470,3],['O2',1030,340,4],['Admin',780,500,4],['Shields',1240,610,4]];
const BTN={x:700,y:105},CAM={x:380,y:470},LP={x:430,y:580};
const CR=['Engineer','Noisemaker','Tracker','Detective','Scientist','Judge'],IR=['Viper','Shapeshifter','Phantom'];
const DESC={Crewmate:'Finish tasks or vote out every Impostor.',Engineer:'Use vents (V) with a cooldown.',Noisemaker:'When you die, an alert pings your body.',Tracker:'F: place a tracker on a nearby player.',Detective:'You get told where a watched player was during a death.',Scientist:'F: open the vitals device (limited battery).',Judge:'In a meeting you may eject someone yourself – if wrong, you go too.',Impostor:'Kill (Q), sabotage (1-5) and vent (V). Fake tasks!',Viper:'Impostor – your victims dissolve after a while.',Shapeshifter:'Impostor – F: become another player.',Phantom:'Impostor – F: turn invisible for a few seconds.'};
const SET=[['n','Players',4,15,10,1],['imp','Impostors',1,3,2,1],['vision','Player vision',.5,2,1,.25],['speed','Walk speed',.5,2,1,.25],['tasks','Tasks each',1,8,4,1],['kcd','Kill cooldown (s)',10,60,25,5],['engCd','Engineer vent cooldown',5,30,15,5],['bat','Scientist vitals battery (s)',5,60,30,5],['dis','Viper dissolve time (s)',3,30,10,1]];
const HATS=[['None',0],['Leaf',5],['Cap',10],['Crown',20],['Halo',30]];
let SV={beans:0,own:['None'],hat:'None'};try{Object.assign(SV,JSON.parse(localStorage.getItem('au')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('au',JSON.stringify(SV))}catch(e){}};
let S={},G=null,myCol='red';
$('set').innerHTML=SET.map(s=>`<label>${s[1]} <b>${s[4]}</b><input type=range id=s_${s[0]} min=${s[2]} max=${s[3]} step=${s[5]} value=${s[4]} oninput="this.previousElementSibling.textContent=this.value"></label>`).join('')+'<label><input type=checkbox id=s_vis checked> Visual tasks</label>';
$('roles').innerHTML='<b>Roles:</b> '+[...CR,...IR].map(r=>`<label class=rl style="display:inline-block;margin-right:8px"><input type=checkbox class=rl value=${r} checked> ${r}</label>`).join('');
function shop(){$('beans').textContent=SV.beans;$('sws').innerHTML=Object.keys(COLORS).map(c=>`<button class="sw ${c==myCol?'on':''}" style="background:${COLORS[c]}" onclick="myCol='${c}';shop()"></button>`).join('');
$('hats').innerHTML='Hats: '+HATS.map(h=>{const o=SV.own.includes(h[0]);return `<button onclick="buy('${h[0]}')">${h[0]} ${o?(SV.hat==h[0]?'✔':'equip'):h[1]+'🫘'}</button>`}).join('')}
function buy(n){const h=HATS.find(h=>h[0]==n);if(!SV.own.includes(n)){if(SV.beans<h[1])return;SV.beans-=h[1];SV.own.push(n)}SV.hat=n;save();shop()}shop();
const RECTS=[...RM.map(r=>r.slice(1)),...CO],inR=(x,y,r)=>x>=r[0]&&x<=r[0]+r[2]&&y>=r[1]&&y<=r[1]+r[3];
const rawW=(x,y)=>RECTS.some(r=>inR(x,y,r)),walk=(x,y)=>rawW(x,y)&&!(G&&G.doorT>0&&DO.some(d=>d[0]==G.doorRoom&&inR(x,y,d.slice(1))));
const canW=(x,y)=>{const e=10;return walk(x-e,y-e)&&walk(x+e,y-e)&&walk(x-e,y+e)&&walk(x+e,y+e)};
function roomOf(p){const r=RM.find(r=>inR(p.x,p.y,r.slice(1)));if(r)return r[0];return RM.reduce((a,r)=>Math.hypot(r[1]+r[3]/2-p.x,r[2]+r[4]/2-p.y)<Math.hypot(a[1]+a[3]/2-p.x,a[2]+a[4]/2-p.y)?r:a)[0]}
function mv(p,dx,dy,sp,dt){if(!p.alive){p.x=Math.max(0,Math.min(1450,p.x+dx*sp*dt));p.y=Math.max(0,Math.min(850,p.y+dy*sp*dt));return 1}
let nx=p.x+dx*sp*dt,ny=p.y+dy*sp*dt,ok=0;const free=!canW(p.x,p.y);if(free||canW(nx,p.y)){p.x=nx;ok=1}if(free||canW(p.x,ny)){p.y=ny;ok=1}return ok}
const clear=(a,b,c,d)=>{const n=Math.ceil(Math.hypot(c-a,d-b)/14);for(let i=0;i<=n;i++)if(!rawW(a+(c-a)*i/n,b+(d-b)*i/n))return 0;return 1};
function nnode(x,y){let b=null,bd=1e9;for(const k in ND){const d=Math.hypot(ND[k][0]-x,ND[k][1]-y);if(d<bd&&clear(x,y,ND[k][0],ND[k][1])){bd=d;b=k}}return b||Object.keys(ND).sort((a,c)=>Math.hypot(ND[a][0]-x,ND[a][1]-y)-Math.hypot(ND[c][0]-x,ND[c][1]-y))[0]}
function route(x,y,tx,ty){const a=nnode(x,y),b=nnode(tx,ty),prev={[a]:null},q=[a];while(q.length){const k=q.shift();if(k==b)break;for(const n of ADJ[k])if(!(n in prev)){prev[n]=k;q.push(n)}}const path=[];for(let k=b;k;k=prev[k])path.unshift(ND[k]);path.push([tx,ty]);return path}
// ---------- game setup
$('go').addEventListener('click',()=>{try{startGame()}catch(e){alert('Start error: '+e.message)}});
function startGame(){S={};SET.forEach(s=>S[s[0]]=+$('s_'+s[0]).value);S.vis=$('s_vis').checked;
const en=[...document.querySelectorAll('input.rl:checked')].map(x=>x.value),cols=sh(Object.keys(COLORS).filter(c=>c!=myCol)).slice(0,S.n-1);cols.unshift(myCol);
const ni=Math.max(1,Math.min(S.imp,Math.floor((S.n-1)/2))),idx=sh([...Array(S.n).keys()]);let cp=sh(en.filter(r=>CR.includes(r))),ip=sh(en.filter(r=>IR.includes(r)));
G={pl:[],bodies:[],t:0,sab:null,sabCd:15,doorT:0,doorRoom:'',msgs:[],fx:[],sym:[],cleared:{},total:0,done:0,phase:'intro',ping:null,vitB:S.bat,cams:0,lui:0,map:0,tt:0};
for(let i=0;i<S.n;i++){const imp=idx.indexOf(i)<ni,a=i/S.n*6.28;
const p={id:i,col:cols[i],name:cap(cols[i]),x:700+Math.cos(a)*120,y:150+Math.sin(a)*55,alive:1,imp,face:1,cd:10,meet:1,vent:-1,shield:0,prog:0,path:[],goal:null,wait:0,stuck:0,saw:null,ventT:0,invis:0,shift:null,shT:0,vcd:0,uses:3,gcd:0,tr:null,hat:i?pick(['None','None','Cap','Leaf','Crown']):SV.hat,dt:0,rp:0,vtime:0};
p.role=imp?(ip.pop()||'Impostor'):(cp.length&&Math.random()<.75?cp.pop():'Crewmate');
p.tasks=sh([...TK]).slice(0,S.tasks).map(d=>({d,done:0}));if(!imp)G.total+=S.tasks;G.pl.push(p)}
const det=G.pl.find(p=>p.role=='Detective');if(det)det.watch=pick(G.pl.filter(p=>p!=det)).id;
const me=G.pl[0];$('menu').classList.add('hide');$('end').classList.add('hide');
$('intro').innerHTML=`<div class=pn style="text-align:center"><h1 style="font-size:40px;color:${me.imp?'#f44':'#4cf'}">${me.imp?'IMPOSTOR':'CREWMATE'}</h1><h2>Role: ${me.role}</h2><p>${DESC[me.role]}</p>${me.imp?'<p>Fellow impostors: '+G.pl.filter(p=>p.imp&&p!=me).map(p=>cap(p.col)).join(', ')+'</p>':''}<p>${G.pl.length} players · ${ni} impostor(s)</p></div>`;
$('intro').classList.remove('hide');setTimeout(()=>{$('intro').classList.add('hide');$('hud').classList.remove('hide');G.phase='play';msg('Game started!')},2200);
$('sabp').innerHTML=me.imp?['💡 Lights','📡 Comms','🫁 O2','☢ Reactor','🚪 Doors'].map((n,i)=>`<button onclick="numKey(${i+1})">${i+1} ${n}</button>`).join(''):'';$('sabp').classList.toggle('hide',!me.imp);mkBtns()}
function mkBtns(){const me=G.pl[0];$('btns').innerHTML=[['USE (E)','pressE()'],['REPORT (R)','doReport()'],['KILL (Q)','doKill()'],['VENT (V)','doVent()'],['ABILITY (F)','doAbil()'],['MAP (M)','G.map=!G.map']].map(b=>`<button onclick="${b[1]}">${b[0]}</button>`).join('')}
const msg=(t,d=5)=>G.msgs.push({t,e:G.t+d});
const nm=p=>cap(p.col);
// ---------- actions
function kill(k,v){if(v.shield>0){v.shield=0;G.fx.push({x:v.x,y:v.y,r:0,t:.6,c:'#6cf'});k.cd=4;return}
v.alive=0;v.vent=-1;G.bodies.push({id:v.id,x:v.x,y:v.y,col:v.col,killer:k.id,dis:k.role=='Viper'?G.t+S.dis:0});k.x=v.x;k.y=v.y;k.cd=S.kcd;G.fx.push({x:v.x,y:v.y,r:0,t:.5,c:'#f22'});
G.pl.forEach(o=>{if(o.alive&&o!=k&&o!=v&&!o.imp&&dist(o,k)<260)o.saw=k.id;});
if(v.role=='Noisemaker')G.ping={x:v.x,y:v.y,t:6};
const me=G.pl[0];if(me.alive&&me.role=='Detective'){const w=G.pl[me.watch];if(w&&w.alive)msg(`🕵 Detective: ${nm(w)} was in ${roomOf(w)} when someone died.`,8)}
if(me.alive&&me.role=='Scientist'&&G.vit)msg(`Vitals: ${nm(v)} flatlined`);
v.ghost=v.imp?'':pick(['Influencer','Guardian Angel']);if(v==me){msg('You died. You are now a ghost: '+(v.ghost||'')+(v.ghost?'':' (finish nothing)'),9)}
if(!k.id&&true){}if(k.id){const vt=VT.filter(t=>Math.hypot(t[1]-k.x,t[2]-k.y)<150)[0];if(vt&&Math.random()<.6){const o=pick(VT.filter(t=>t[3]==vt[3]&&t!=vt)||[vt]);if(o){k.x=o[1];k.y=o[2];k.vent=VT.indexOf(o);k.ventT=1.5}}}
win()}
function doKill(){const me=G.pl[0];if(G.phase!='play'||!me.alive||!me.imp||me.cd>0||me.vent>=0)return;const v=G.pl.filter(o=>o.alive&&!o.imp&&o.vent<0&&dist(o,me)<80).sort((a,b)=>dist(a,me)-dist(b,me))[0];if(v){me.invis=0;kill(me,v)}}
function doReport(){const me=G.pl[0];if(G.phase!='play'||!me.alive||me.vent>=0)return;const b=G.bodies.find(b=>dist(b,me)<120);if(b)meeting(me,b)}
function doVent(){const me=G.pl[0];if(G.phase!='play'||!me.alive||!(me.imp||me.role=='Engineer'))return;
if(me.vent>=0){me.vent=-1;me.vcd=S.engCd;G.pl.forEach(o=>{if(o.alive&&o!=me&&dist(o,me)<220)o.saw=me.id});return}
if(me.role=='Engineer'&&me.vcd>0)return msg('Engineer vent on cooldown');const v=VT.findIndex(t=>Math.hypot(t[1]-me.x,t[2]-me.y)<70);if(v<0)return;
G.pl.forEach(o=>{if(o.alive&&o!=me&&!o.imp&&dist(o,me)<220)o.saw=me.id});me.vent=v;me.x=VT[v][1];me.y=VT[v][2];me.ventT=me.role=='Engineer'?12:99}
function doAbil(){const me=G.pl[0];if(G.phase!='play')return;
if(!me.alive&&me.ghost=='Guardian Angel'&&me.gcd<=0){const t=G.pl.filter(o=>o.alive&&!o.imp&&dist(o,me)<260).sort((a,b)=>dist(a,me)-dist(b,me))[0];if(t){t.shield=15;me.gcd=20;msg('Shield given to '+nm(t))}return}
if(!me.alive)return;
if(me.role=='Shapeshifter'){if(me.shift!=null)me.shift=null;else{me.shift=pick(G.pl.filter(o=>o!=me)).id;me.shT=20}}
else if(me.role=='Phantom'){me.invis=me.invis?0:8;G.fx.push({x:me.x,y:me.y,r:0,t:.6,c:'#fff'})}
else if(me.role=='Scientist'){G.vit=!G.vit}
else if(me.role=='Tracker'){const t=G.pl.filter(o=>o.alive&&o!=me&&dist(o,me)<150)[0];if(t&&me.uses>0){me.tr=t.id;me.uses--;msg('Tracking '+nm(t))}}}
function numKey(n){const me=G.pl[0];if(G.phase!='play')return;if(me.alive&&me.imp)sab(['lights','comms','o2','reactor','doors'][n-1],me);else if(!me.alive&&me.ghost=='Influencer'&&n<5)G.sym.push({x:me.x,y:me.y-45,s:['➡️','🧠','👁️','❗'][n-1],t:4})}
function sab(type,by){if(G.sabCd>0||G.phase!='play')return;
if(type=='doors'){const r=DO.reduce((a,d)=>Math.hypot(d[1]-by.x,d[2]-by.y)<Math.hypot(a[1]-by.x,a[2]-by.y)?d:a);G.doorRoom=r[0];G.doorT=10;msg('🚪 '+r[0]+' doors closed!');G.sabCd=15;return}
if(G.sab)return;const sp={lights:[LP],comms:[{x:800,y:765}],o2:[{x:1100,y:290},{x:930,y:500}],reactor:[{x:70,y:350},{x:190,y:510}]}[type];
G.sab={type,t:30,crit:type=='o2'||type=='reactor',age:0,spots:sp.map(s=>({x:s.x,y:s.y,done:0,by:null}))};G.sabCd=25;msg('⚠ SABOTAGE: '+type.toUpperCase(),6)}
function pressE(){const me=G.pl[0];if(G.phase!='play')return;if(G.cams){G.cams=0;return}const u=findUse(me);if(!u)return;
if(u.k=='btn'){me.meet=0;meeting(me,null)}else if(u.k=='cam'){G.cams=1}else if(u.k=='fix'&&G.sab.type=='lights'){G.lui=1;const sw=[0,1,0,0,1].map(()=>Math.random()<.5);if(sw.every(x=>x))sw[0]=false;G.sw=sw;drawSw();$('lights').classList.remove('hide')}}
function drawSw(){$('sw5').innerHTML=G.sw.map((o,i)=>`<button style="background:${o?'#2c4':'#a22'}" onclick="G.sw[${i}]=!G.sw[${i}];drawSw()">${o?'ON':'OFF'}</button>`).join('');if(G.sw.every(x=>x)){G.sab=null;G.lui=0;$('lights').classList.add('hide');msg('Lights restored')}}
function findUse(p){let b=null;const c=(d,o)=>{if(d<60&&(!b||d<b.d)){o.d=d;b=o}};
if(p.alive||!p.imp)p.tasks.forEach(t=>{if(!t.done)c(dist(p,{x:t.d[1],y:t.d[2]}),{k:'task',t,l:t.d[0]})});
if(p.alive&&G.sab)G.sab.spots.forEach(s=>{if(!s.done)c(dist(p,s),{k:'fix',s,l:'Fix '+G.sab.type})});
if(p.alive&&p.meet>0&&!(G.sab&&G.sab.crit))c(dist(p,BTN),{k:'btn',l:'Emergency meeting'});if(p.alive)c(dist(p,CAM),{k:'cam',l:'Security cameras'});return b}
function finTask(p,t){if(t.done)return;t.done=1;if(!p.imp){G.done++;if(t.d[3]&&S.vis&&p.alive&&G.pl.some(o=>o.alive&&o!=p&&dist(o,p)<280))G.cleared[p.id]=1}win()}
function finFix(p,s){s.done=1;if(G.sab&&G.sab.spots.every(x=>x.done)){G.sab=null;msg('Sabotage fixed!')}}
// ---------- win / end
function win(){if(G.phase=='end')return;const I=G.pl.filter(p=>p.alive&&p.imp).length,C=G.pl.filter(p=>p.alive&&!p.imp).length;let r=null;
if(!I)r=[1,'All impostors were eliminated'];else if(I>=C)r=[0,'The impostors outnumber the crew'];else if(G.done>=G.total)r=[1,'All tasks completed'];if(r)end(r)}
function end(r){G.phase='end';const me=G.pl[0],w=me.imp?!r[0]:!!r[0];SV.beans+=w?15:5;save();$('hud').classList.add('hide');$('meet').classList.add('hide');$('lights').classList.add('hide');
$('end').innerHTML=`<div class=pn style="text-align:center"><h1 style="font-size:46px;color:${w?'#4f6':'#f44'}">${w?'VICTORY':'DEFEAT'}</h1><h3>${r[0]?'CREWMATES WIN':'IMPOSTORS WIN'}</h3><p>${r[1]}</p><p>Impostors: ${G.pl.filter(p=>p.imp).map(p=>cap(p.col)+' ('+p.role+')').join(', ')}</p><p>+${w?15:5} 🫘 (total ${SV.beans})</p><button onclick="shop();$('end').classList.add('hide');$('menu').classList.remove('hide');G=null">Back to lobby</button> <button onclick="startGame()">Play again</button></div>`;$('end').classList.remove('hide')}
// ---------- meetings
function meeting(caller,body){if(G.phase!='play')return;G.phase='meet';G.cams=0;G.lui=0;$('lights').classList.add('hide');const m=G.mt={t:30,v:{},body,caller,lines:[],sus:[],res:null,sh:0};
if(body){G.pl.forEach(p=>{if(p.alive&&dist(p,body)<260&&p.id!=caller.id)m.sus.push(p.id)});const k=G.pl[body.killer];if(k.alive&&!m.sus.includes(k.id)&&Math.random()<.55)m.sus.push(k.id)}
G.pl.forEach(b=>{if(!b.alive||!b.id)return;const rm=roomOf(body||b),al=G.pl.filter(o=>o.alive&&!o.imp&&o!=b&&!G.cleared[o.id]);let txt;
if(b.imp){const t=pick(al.length?al:[b]);b.say=t.id;txt=body?`${nm(t)} was acting strange near ${rm}.`:`I think ${nm(t)} is sus.`}
else{const c=(b.saw!=null&&G.pl[b.saw].alive&&b.saw!=b.id&&(body||Math.random()<.5))?[b.saw]:(body?m.sus.filter(i=>i!=b.id&&G.pl[i].alive&&!G.cleared[i]):[]);b.say=c.length?pick(c):null;
txt=b.say!=null?`I saw ${nm(G.pl[b.say])} near ${rm}!`:(body?`Nothing seen. I was in ${roomOf(b)}.`:`Who called this? I was doing tasks in ${roomOf(b)}.`)}
m.lines.push({t:rnd(2,16),who:b,txt,shown:0});b.vtime=rnd(5,24)});
$('mh').textContent=body?`Body reported by ${nm(caller)} – ${nm(G.pl[body.id])} is dead!`:`Emergency meeting called by ${nm(caller)}`;$('chat').innerHTML='';$('meet').classList.remove('hide');meetRows()}
function meetRows(){const m=G.mt,me=G.pl[0];$('rows').innerHTML=G.pl.map(p=>{const vc=Object.values(m.v).filter(v=>v==p.id).length;return `<div class=row style="opacity:${p.alive?1:.4}"><span class=dot style="background:${COLORS[p.col]}"></span><b style="width:70px">${nm(p)}${p==me?' (you)':''}</b><span style="flex:1">${G.cleared[p.id]?'✔ cleared (visual task) ':''}${m.v[p.id]!=null?'🗳 voted ':''}${vc&&m.sh?'· '+vc+' votes':''}</span>${p.alive&&me.alive&&m.v[0]==null?`<button onclick="vote(${p.id})">Vote</button>`:''}${me.alive&&me.role=='Judge'&&!me.used&&p.alive&&p!=me?`<button style="background:#a62" onclick="judge(${p.id})">⚖ Judge</button>`:''}</div>`}).join('')}
function vote(t){const m=G.mt;if(!m||!G.pl[0].alive||m.v[0]!=null)return;m.v[0]=t;meetRows()}
function judge(id){const m=G.mt;if(!m||m.res)return;const me=G.pl[0];me.used=1;const p=G.pl[id];kill2(p);let t=`⚖ The Judge ejected ${nm(p)}. They were ${p.imp?'':'NOT '}an Impostor!`;if(!p.imp){kill2(me);t+=` The Judge was ejected too.`}fin(t)}
function kill2(p){p.alive=0;p.vent=-1;p.ghost=p.imp?'':pick(['Influencer','Guardian Angel'])}
function meetUpdate(dt){const m=G.mt;if(m.res)return;m.t-=dt;const el=30-m.t;$('mt').textContent=Math.ceil(m.t)+'s';
m.lines.forEach(l=>{if(!l.shown&&el>l.t&&l.who.alive){l.shown=1;$('chat').innerHTML+=`<div><b style="color:${COLORS[l.who.col]}">${nm(l.who)}:</b> ${l.txt}</div>`;$('chat').scrollTop=1e5}});
G.pl.forEach(b=>{if(!b.alive||!b.id||m.v[b.id]!=null||el<b.vtime)return;let t='skip';const al=G.pl.filter(o=>o.alive&&o!=b);
if(b.imp)t=Math.random()<.8?(b.say!=null&&G.pl[b.say].alive?b.say:pick(al.filter(o=>!o.imp)).id):'skip';else if(b.say!=null&&G.pl[b.say].alive&&Math.random()<.85)t=b.say;else if(Math.random()<.2)t=pick(al.filter(o=>!G.cleared[o.id])).id;m.v[b.id]=t;meetRows()});
const al=G.pl.filter(p=>p.alive);if(m.t<=0||al.every(p=>m.v[p.id]!=null)){m.sh=1;const c={};Object.values(m.v).forEach(t=>c[t]=(c[t]||0)+1);let best=null,top=0,tie=0;for(const k in c){if(c[k]>top){top=c[k];best=k;tie=0}else if(c[k]==top)tie=1}
let t='No one was ejected (skipped or tied).';if(top&&!tie&&best!='skip'){const p=G.pl[+best];kill2(p);const r=G.pl.filter(o=>o.alive&&o.imp).length;t=`${nm(p)} was ${p.imp?'':'not '}An Impostor. ${r} Impostor${r==1?'':'s'} remain.`}fin(t)}}
function fin(t){const m=G.mt;m.res=1;m.sh=1;meetRows();$('chat').innerHTML+=`<div style="font-size:18px;color:#fc4;margin-top:6px">${t}</div>`;$('chat').scrollTop=1e5;setTimeout(()=>{$('meet').classList.add('hide');G.phase='play';G.mt=null;G.bodies=[];G.doorT=0;G.pl.forEach((p,i)=>{p.vent=-1;p.invis=0;p.saw=null;p.path=[];p.goal=null;p.wait=0;p.cd=Math.max(p.cd,10);if(p.alive){const a=i/G.pl.length*6.28;p.x=700+Math.cos(a)*120;p.y=150+Math.sin(a)*55}});win()},4500)}
// ---------- bots
function go(b,x,y,goal){b.path=route(b.x,b.y,x,y);b.goal=goal}
function pickGoal(b){if(b.imp&&!G.sab&&G.sabCd<=0&&Math.random()<.2){sab(pick(['lights','comms','o2','reactor','doors']),b)}
if(G.sab&&!b.imp){const s=G.sab.spots.find(s=>!s.done&&(s.by==null||!G.pl[s.by].alive||s.by==b.id));if(s&&(G.sab.crit||G.sab.age>12)){s.by=b.id;return go(b,s.x,s.y,{k:'fix',s})}}
if(b.imp){if(Math.random()<.55){const v=G.pl.filter(o=>o.alive&&!o.imp&&o.vent<0).sort((a,c)=>dist(a,b)-dist(c,b))[0];if(v)return go(b,v.x,v.y,{k:'hunt',v:v.id})}const t=pick(TK);return go(b,t[1],t[2],{k:'task',t:{d:t,done:0},fake:1})}
const t=b.tasks.find(t=>!t.done);if(t)go(b,t.d[1],t.d[2],{k:'task',t});else{const w=pick(TK);go(b,w[1],w[2],{k:'wander'})}}
function hunt(b){const v=G.pl[b.goal.v];if(!v.alive||v.vent>=0){b.goal=null;b.path=[];return}
if(dist(v,b)<62&&b.cd<=0&&!G.pl.some(o=>o.alive&&o!=b&&o!=v&&!o.imp&&dist(o,b)<300)){kill(b,v);b.goal=null;b.path=[];b.wait=.6}}
function bot(b,dt){b.cd-=dt;b.doing=null;b.moving=0;
if(b.ventT>0){b.ventT-=dt;if(b.ventT<=0)b.vent=-1;return}
if(!b.imp||Math.random()<dt*.5){const bd=G.bodies.find(o=>dist(o,b)<150&&o.killer!=b.id);if(bd){meeting(b,bd);return}}
if(b.wait>0){b.wait-=dt;if(b.goal&&b.goal.k=='task'&&!b.imp&&S.vis&&b.goal.t.d[3])b.doing=b.goal.t.d;if(b.wait<=0&&b.goal){if(b.goal.k=='task'){finTask(b,b.goal.t)}if(b.goal.k=='fix')finFix(b,b.goal.s);b.goal=null}return}
if(!b.path.length){const g=b.goal;if(!g)return pickGoal(b);if(g.k=='task'||g.k=='fix'){b.wait=2.5;return}if(g.k=='hunt')hunt(b);b.goal=null;return}
const p=b.path[0],d=Math.hypot(p[0]-b.x,p[1]-b.y);if(d<8){b.path.shift();return}const ox=b.x,oy=b.y;mv(b,(p[0]-b.x)/d,(p[1]-b.y)/d,115*S.speed,dt);b.face=p[0]>b.x?1:-1;b.moving=1;
b.stuck=Math.hypot(b.x-ox,b.y-oy)<.2?b.stuck+dt:0;if(b.stuck>1.2){b.path=[];b.goal=null;b.stuck=0;b.wait=.8}
if(b.goal&&b.goal.k=='hunt'){hunt(b);b.rp-=dt;if(b.goal&&b.rp<=0){b.rp=.8;const v=G.pl[b.goal.v];go(b,v.x,v.y,b.goal)}}}
// ---------- update
const K={};onkeydown=e=>{const k=e.key.toLowerCase();K[k]=1;if(!G||G.phase!='play')return;if(['w','a','s','d'].includes(k)&&G.cams)G.cams=0;const me=G.pl[0];
if(me.vent>=0&&(k=='a'||k=='d')){const g=VT.map((t,i)=>i).filter(i=>VT[i][3]==VT[me.vent][3]);const j=(g.indexOf(me.vent)+(k=='d'?1:g.length-1))%g.length;me.vent=g[j];me.x=VT[me.vent][1];me.y=VT[me.vent][2]}
if(k=='q')doKill();if(k=='r')doReport();if(k=='v')doVent();if(k=='f')doAbil();if(k=='m')G.map=!G.map;if(k=='e'&&!e.repeat)pressE();if(k=='escape')G.cams=0;if(/^[1-5]$/.test(k))numKey(+k)};onkeyup=e=>K[e.key.toLowerCase()]=0;
function update(dt){G.t+=dt;const me=G.pl[0];G.sabCd=Math.max(0,G.sabCd-dt);if(G.doorT>0)G.doorT-=dt;
if(G.sab){G.sab.age+=dt;if(G.sab.crit){G.sab.t-=dt;if(G.sab.t<=0)return end([0,'The '+G.sab.type.toUpperCase()+' sabotage was not fixed in time'])}}
if(G.ping){G.ping.t-=dt;if(G.ping.t<=0)G.ping=null}G.bodies=G.bodies.filter(b=>!b.dis||G.t<b.dis);G.fx.forEach(f=>{f.t-=dt;f.r+=dt*120});G.fx=G.fx.filter(f=>f.t>0);G.sym.forEach(s=>s.t-=dt);G.sym=G.sym.filter(s=>s.t>0);
G.pl.forEach(p=>{p.cd-=dt;p.gcd-=dt;if(p.shT>0){p.shT-=dt;if(p.shT<=0)p.shift=null}if(p.invis>0){p.invis-=dt;}if(p.shield>0)p.shield-=dt;if(p.vcd>0)p.vcd-=dt});
me.cd+=dt;me.cd-=dt;
if(!me.alive||true){}
// human
let dx=(K.d?1:0)-(K.a?1:0),dy=(K.s?1:0)-(K.w?1:0);if(G.cams||G.lui||me.vent>=0)dx=dy=0;me.moving=0;
if(dx||dy){const l=Math.hypot(dx,dy);dx/=l;dy/=l;me.face=dx?Math.sign(dx):me.face;me.moving=1;mv(me,dx,dy,150*S.speed*(me.alive?1:1.15),dt)}
if(me.vent>=0){me.ventT-=dt;if(me.role=='Engineer'&&me.ventT<=0){me.vent=-1;me.vcd=S.engCd}}
const u=findUse(me);G.use=u;me.doing=null;
if(K.e&&u&&(u.k=='task'||(u.k=='fix'&&G.sab.type!='lights'))&&!G.lui&&!G.cams){me.prog+=dt;if(u.k=='task'&&u.t.d[3]&&S.vis&&!me.imp)me.doing=u.t.d;if(me.prog>=2.5){me.prog=0;if(u.k=='task')finTask(me,u.t);else finFix(me,u.s)}}else me.prog=0;
if(G.vit){G.vitB-=dt;if(G.vitB<=0)G.vit=0}else G.vitB=Math.min(S.bat,G.vitB+dt*.5);
G.pl.forEach(b=>{if(!b.id){if(b.alive&&b.imp&&b.cd>0){}return}if(b.alive)bot(b,dt);else if(!b.imp){b.dt+=dt;if(b.dt>12){b.dt=0;const t=b.tasks.find(t=>!t.done);if(t)finTask(b,t)}}});
if(me.alive&&me.imp&&me.cd<0)me.cd=0}
// ---------- render
const cv=$('c'),ctx=cv.getContext('2d'),dk=document.createElement('canvas'),dc=dk.getContext('2d');let W,H;
function rs(){W=cv.width=dk.width=innerWidth;H=cv.height=dk.height=innerHeight}onresize=rs;rs();
const darker=(h,a)=>{const n=parseInt(h.slice(1),16);return `rgb(${(n>>16)*a|0},${(n>>8&255)*a|0},${(n&255)*a|0})`};
function rr(c,x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r);c.fill()}
function bean(c,p,x,y,al,name,ghost){const d=p.shift!=null?G.pl[p.shift]:p,col=COLORS[d.col],f=p.face||1,bob=p.moving?Math.sin(G.t*14)*3:0;c.save();c.globalAlpha=al;c.translate(x,y);
c.fillStyle=darker(col,.6);rr(c,-f*14-(f>0?0:0)-4,-24,8,16,3);c.fillStyle=col;rr(c,-12,-34,24,ghost?34:30,11);if(!ghost){c.fillStyle=darker(col,.8);rr(c,-12,-6+bob/2,10,9,3);rr(c,2,-6-bob/2,10,9,3)}
c.fillStyle='#a8e8f8';c.beginPath();c.ellipse(f*5,-23,9,6,0,0,7);c.fill();c.fillStyle='#fff8';c.fillRect(f*5-5,-26,5,2);
const h=p.hat;if(h=='Crown'){c.fillStyle='#fc2';c.beginPath();c.moveTo(-9,-34);c.lineTo(-9,-45);c.lineTo(-4,-39);c.lineTo(0,-47);c.lineTo(4,-39);c.lineTo(9,-45);c.lineTo(9,-34);c.fill()}
else if(h=='Cap'){c.fillStyle='#e33';rr(c,-11,-41,22,9,5);c.fillRect(f*2,-34,f*13,3)}else if(h=='Leaf'){c.fillStyle='#4c4';c.beginPath();c.ellipse(0,-39,5,9,.5,0,7);c.fill()}else if(h=='Halo'){c.strokeStyle='#ff6';c.lineWidth=3;c.beginPath();c.ellipse(0,-42,10,3,0,0,7);c.stroke()}
if(p.shield>0){c.strokeStyle='#5cf';c.lineWidth=3;c.beginPath();c.arc(0,-17,26,0,7);c.stroke()}c.restore();
if(name){c.fillStyle=(G.pl[0].imp&&p.imp)?'#f44':'#fff';c.font='12px system-ui';c.textAlign='center';c.fillText(d.name,x,y-50)}}
function drawWorld(c,me){RECTS.forEach(r=>{c.fillStyle='#8fa0d8';c.fillRect(r[0]-4,r[1]-4,r[2]+8,r[3]+8)});RECTS.forEach((r,i)=>{c.fillStyle=i<RM.length?'#33406b':'#283254';c.fillRect(r[0],r[1],r[2],r[3])});
c.fillStyle='#8fa0d8';c.font='14px system-ui';c.textAlign='left';RM.forEach(r=>c.fillText(r[0],r[1]+8,r[2]+18));
c.fillStyle='#4a5a90';c.beginPath();c.ellipse(700,150,90,40,0,0,7);c.fill();c.fillStyle='#e22';c.beginPath();c.arc(BTN.x,BTN.y,13,0,7);c.fill();c.fillStyle='#fff';c.fillText('!',BTN.x-3,BTN.y+5);
c.fillStyle='#38c';c.fillRect(CAM.x-14,CAM.y-10,28,20);c.fillStyle='#fd3';c.fillRect(LP.x-10,LP.y-10,20,20);
VT.forEach(v=>{c.fillStyle='#111';c.fillRect(v[1]-18,v[2]-10,36,20);c.strokeStyle='#555';for(let i=-12;i<14;i+=6){c.beginPath();c.moveTo(v[1]+i,v[2]-10);c.lineTo(v[1]+i,v[2]+10);c.stroke()}});
if(G.doorT>0){c.fillStyle='#d33';DO.forEach(d=>{if(d[0]==G.doorRoom)c.fillRect(d[1],d[2],d[3],d[4])})}
if(G.sab)G.sab.spots.forEach(s=>{if(!s.done){c.fillStyle=Math.sin(G.t*8)>0?'#f22':'#fa0';c.beginPath();c.arc(s.x,s.y,14,0,7);c.fill()}});
if(me){c.font='bold 22px system-ui';c.fillStyle='#fe3';c.textAlign='center';if(!(G.sab&&G.sab.type=='comms'&&!me.imp))me.tasks.forEach(t=>{if(!t.done)c.fillText('!',t.d[1],t.d[2]+6)})}
G.bodies.forEach(b=>{c.fillStyle=COLORS[b.col];c.beginPath();c.ellipse(b.x,b.y-6,16,10,0,0,7);c.fill();c.fillStyle='#a8e8f8';c.beginPath();c.ellipse(b.x+6,b.y-8,6,4,0,0,7);c.fill();c.fillStyle='#fff';c.fillRect(b.x-4,b.y-18,3,10)});
const vis=[...G.pl].sort((a,b)=>a.y-b.y);vis.forEach(p=>{const mine=p==G.pl[0],gh=!p.alive;if(gh&&!(G.pl[0].alive==0))return;if(!mine&&(p.vent>=0||p.invis>0))return;
if(p.vent>=0)return;bean(c,p,p.x,p.y,gh?.5:(mine&&p.invis>0?.35:1),!gh,gh);if(p.doing){c.fillStyle='#6f6';c.font='11px system-ui';c.fillText('● '+p.doing[0],p.x,p.y-64);c.strokeStyle='#6f6';c.lineWidth=2;c.beginPath();c.arc(p.x,p.y-17,26+Math.sin(G.t*8)*4,0,7);c.stroke()}});
G.fx.forEach(f=>{c.strokeStyle=f.c;c.lineWidth=4;c.globalAlpha=Math.max(0,f.t);c.beginPath();c.arc(f.x,f.y-15,f.r,0,7);c.stroke();c.globalAlpha=1});
c.font='28px system-ui';G.sym.forEach(s=>{if(G.pl[0].alive||!G.pl[0].alive)c.fillText(s.s,s.x,s.y)})}
function render(){ctx.fillStyle='#05060d';ctx.fillRect(0,0,W,H);if(!G)return;const me=G.pl[0],z=Math.max(.6,Math.min(1.5,H/650));
ctx.save();ctx.translate(W/2-me.x*z,H/2-me.y*z);ctx.scale(z,z);drawWorld(ctx,me);ctx.restore();
if(me.alive){let r=230*S.vision*(me.imp?1.45:1)*(G.sab&&G.sab.type=='lights'&&!me.imp?.3:1)*z;dc.globalCompositeOperation='source-over';dc.fillStyle='#000';dc.fillRect(0,0,W,H);dc.globalCompositeOperation='destination-out';
const g=dc.createRadialGradient(W/2,H/2,r*.2,W/2,H/2,r);g.addColorStop(0,'#000');g.addColorStop(.8,'rgba(0,0,0,.9)');g.addColorStop(1,'rgba(0,0,0,0)');dc.fillStyle=g;dc.fillRect(0,0,W,H);ctx.drawImage(dk,0,0)}
if(me.alive&&me.vent>=0){ctx.fillStyle='#000c';ctx.fillRect(0,0,W,H);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='20px system-ui';ctx.fillText('IN VENT – A/D switch vent · V exit',W/2,H/2+120)}
const sx=x=>W/2+(x-me.x)*z,sy=y=>H/2+(y-me.y)*z;
if(G.ping){ctx.strokeStyle='#fc4';ctx.lineWidth=4;ctx.beginPath();ctx.arc(sx(G.ping.x),sy(G.ping.y),20+(G.t*80%80),0,7);ctx.stroke();ctx.fillStyle='#fc4';ctx.font='14px system-ui';ctx.textAlign='center';ctx.fillText('NOISEMAKER ALERT',sx(G.ping.x),sy(G.ping.y)-30)}
if(me.tr!=null){const t=G.pl[me.tr],a=Math.atan2(t.y-me.y,t.x-me.x);ctx.fillStyle=COLORS[t.col];ctx.beginPath();ctx.moveTo(W/2+Math.cos(a)*90,H/2+Math.sin(a)*90);ctx.lineTo(W/2+Math.cos(a+2.6)*70,H/2+Math.sin(a+2.6)*70);ctx.lineTo(W/2+Math.cos(a-2.6)*70,H/2+Math.sin(a-2.6)*70);ctx.fill()}
if(G.cams)cams(z);if(G.map)minimap(me);
if(G.sab&&G.sab.type=='lights'&&!me.imp&&false){}hud(me)}
function cams(z){ctx.fillStyle='#000e';ctx.fillRect(0,0,W,H);const pw=W/2-30,ph=H/2-50,pts=[[700,140],[130,430],[585,640],[860,450]];ctx.fillStyle='#fff';ctx.font='16px system-ui';ctx.textAlign='center';ctx.fillText('SECURITY CAMERAS – press E / Esc to exit',W/2,22);
pts.forEach((p,i)=>{const x=20+(i%2)*(pw+20),y=34+(i>>1)*(ph+10);ctx.save();ctx.beginPath();ctx.rect(x,y,pw,ph);ctx.clip();if(G.sab&&G.sab.type=='comms'){ctx.fillStyle='#222';ctx.fillRect(x,y,pw,ph);ctx.fillStyle='#f55';ctx.fillText('CAMERAS OFFLINE',x+pw/2,y+ph/2)}else{ctx.translate(x+pw/2-p[0]*.55,y+ph/2-p[1]*.55);ctx.scale(.55,.55);drawWorld(ctx,null)}ctx.restore();ctx.strokeStyle='#4cf';ctx.strokeRect(x,y,pw,ph)})}
function minimap(me){const s=.42,ox=W/2-725*s,oy=H/2-425*s;ctx.fillStyle='#000d';ctx.fillRect(ox-20,oy-20,1450*s+40,850*s+40);RECTS.forEach(r=>{ctx.fillStyle='#4a5a90';ctx.fillRect(ox+r[0]*s,oy+r[1]*s,r[2]*s,r[3]*s)});
ctx.fillStyle='#fff';ctx.font='11px system-ui';ctx.textAlign='left';RM.forEach(r=>ctx.fillText(r[0],ox+r[1]*s+3,oy+r[2]*s+12));
if(!(G.sab&&G.sab.type=='comms'&&!me.imp))me.tasks.forEach(t=>{if(!t.done){ctx.fillStyle='#fe3';ctx.fillRect(ox+t.d[1]*s-3,oy+t.d[2]*s-3,7,7)}});
if(G.sab)G.sab.spots.forEach(p=>{if(!p.done){ctx.fillStyle='#f22';ctx.fillRect(ox+p.x*s-4,oy+p.y*s-4,9,9)}});ctx.fillStyle=COLORS[me.col];ctx.beginPath();ctx.arc(ox+me.x*s,oy+me.y*s,6,0,7);ctx.fill();
if(me.tr!=null){const t=G.pl[me.tr];ctx.strokeStyle='#fff';ctx.beginPath();ctx.arc(ox+t.x*s,oy+t.y*s,7,0,7);ctx.stroke();ctx.fillStyle=COLORS[t.col];ctx.fill()}}
let hT=0;function hud(me){if(G.t-hT<.15)return;hT=G.t;
const ro=me.alive?me.role:(me.ghost||'Ghost')+' (ghost)';let ex='';if(me.imp&&me.alive)ex=`<br>Kill: ${me.cd>0?Math.ceil(me.cd)+'s':'READY'}`+(G.sabCd>0?` · Sab: ${Math.ceil(G.sabCd)}s`:'');if(me.role=='Engineer'&&me.alive)ex=`<br>Vent: ${me.vcd>0?Math.ceil(me.vcd)+'s':'ready'}`;if(me.role=='Tracker')ex=`<br>Trackers: ${me.uses}`;if(me.role=='Scientist')ex=`<br>Vitals battery: ${Math.ceil(G.vitB)}s`;if(me.role=='Shapeshifter'&&me.shift!=null)ex='<br>Disguised';if(me.role=='Phantom'&&me.invis>0)ex='<br>Invisible '+Math.ceil(me.invis)+'s';if(!me.alive&&me.ghost=='Influencer')ex='<br>1-4 send symbols';if(!me.alive&&me.ghost=='Guardian Angel')ex='<br>F shield nearby crew '+(me.gcd>0?Math.ceil(me.gcd)+'s':'ready');
$('role').innerHTML=`<b style="color:${me.imp?'#f55':'#6cf'}">${ro}</b>${ex}`;
const cm=G.sab&&G.sab.type=='comms'&&!me.imp;$('tasks').innerHTML=`<b>${me.imp?'FAKE TASKS':'TASKS'}</b><br>`+(cm?'📡 <span style="color:#f66">Communications sabotaged</span>':me.tasks.map(t=>`<div style="opacity:${t.done?.4:1}">${t.done?'✔':'•'} ${t.d[0]} <small>(${roomOf({x:t.d[1],y:t.d[2]})})</small></div>`).join(''))+`<div id=bar><i id=barf style="width:${G.done/G.total*100}%"></i></div>`;
$('alert').textContent=G.sab?(G.sab.crit?`${G.sab.type=='o2'?'O2 DEPLETED':'REACTOR MELTDOWN'}: ${Math.ceil(G.sab.t)}s`:G.sab.type=='lights'?'LIGHTS SABOTAGED':'COMMS SABOTAGED'):'';
G.msgs=G.msgs.filter(m=>m.e>G.t);$('msgs').innerHTML=G.msgs.slice(-3).map(m=>`<div>${m.t}</div>`).join('');
$('hint').textContent=G.use?`E: ${G.use.l}${G.use.k=='task'||G.use.k=='fix'?' (hold)':''}`+(me.prog>0?` ${(me.prog/2.5*100)|0}%`:''):(me.alive&&G.bodies.some(b=>dist(b,me)<120)?'R: Report body':'');
const b=$('btns').children;b[1].style.display=me.alive?'':'none';b[2].style.display=me.imp&&me.alive?'':'none';b[3].style.display=me.alive&&(me.imp||me.role=='Engineer')?'':'none';b[4].style.display=(me.alive&&['Shapeshifter','Phantom','Scientist','Tracker'].includes(me.role))||(!me.alive&&me.ghost=='Guardian Angel')?'':'none';
$('vit').classList.toggle('hide',!G.vit||!me.alive);if(G.vit)$('vit').innerHTML='<b>VITALS</b>'+G.pl.map(p=>`<div style="color:${COLORS[p.col]}">${nm(p)}: ${p.alive?'<span style=color:#6f6>ALIVE</span>':'<span style=color:#f55>DEAD</span>'}</div>`).join('')}
let last=0;function loop(ts){requestAnimationFrame(loop);const dt=Math.min(.05,(ts-last)/1000||0);last=ts;if(G){if(G.phase=='play')update(dt);else if(G.phase=='meet'&&G.mt)meetUpdate(dt);render()}else{ctx.fillStyle='#05060d';ctx.fillRect(0,0,W,H)}}
requestAnimationFrame(loop);
