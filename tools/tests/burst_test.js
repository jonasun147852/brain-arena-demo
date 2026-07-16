const fs=require('fs'); require('./_stub.js');
const src=fs.readFileSync('engine.js','utf8');
const driver=`
const byId=id=>HEXES.find(h=>h.id===id);
let pass=0, fail=0;
function check(l,c){ if(c)pass++; else{fail++; console.log('  FAIL:',l);} }
function setup(ids){ global.timers=[]; buildTuner(); freshRun(); K={...DEFAULTS}; rerollLeft=1; R.section=1;
  ids.slice(0,-1).forEach(id=>P.hexes.push(byId(id)));
  pickHex(byId(ids[ids.length-1])); R.draftAt=[9e9,9e9,9e9,9e9,9e9]; __flushShort(); P.energy=150; }

// 虚拟时钟
const _now=Date.now; let NOW=1000000; Date.now=()=>NOW;

// 卡存在性
check('h22 组合拳 银·手', byId('h22').rar==='silver' && byId('h22').school==='手');
check('h23 趁热打铁 银·脑', byId('h23').rar==='silver' && byId('h23').school==='脑');
check('h24 引而不发 彩', byId('h24').rar==='prism');

// castMult:窗口互斥
setup(['h22','h24','h01']);
P.lastCastMs=0;
check('从未施放无倍率', castMult()===1);
P.lastCastMs=NOW-2000;
check('4s 内连放 ×1.4', Math.abs(castMult()-1.4)<1e-9);
P.lastCastMs=NOW-9000;
check('8s 蓄势 ×2', castMult()===2);
P.lastCastMs=NOW-6000;
check('5-8s 之间无加成', castMult()===1);

// 无卡无倍率
setup(['h01','h02']);
P.lastCastMs=NOW-2000; check('无组合拳不加成', castMult()===1);
P.lastCastMs=NOW-9000; check('无引而不发不加成', castMult()===1);

// 趁热打铁:返能+内冷
setup(['h23','h01']);
P.lastCastMs=NOW-2000; P._forgeAt=0; P.energy=100;
castPulse();
check('窗口内施放返 20', P.energy===120 && P.lastCastMs===NOW);
NOW+=3000; P.energy=100;
castPulse();
check('8s 内冷不重复返', P.energy===100);
NOW+=9000; P.lastCastMs=NOW-3000; P.energy=100;
castPulse();
check('内冷过后再返', P.energy===120);

// 集成:连放两次轻技,第二次吃返能
setup(['h23','h01']);
NOW+=30000; P.energy=150; P.lastCastMs=0; P._forgeAt=0;
releaseSmall(); const e1=P.energy;   // 第一发:-50
NOW+=2000; releaseSmall();           // 第二发:-50+20
check('连放净费 30', P.energy===e1-30);

// 集成:引而不发对重技终伤 ×2(经 E.hp 差验证)
setup(['h24','h01']);
NOW+=30000; P.energy=150; P.combo=0;
P.lastCastMs=NOW-1000; const hp0=E.hp; releaseBig();   // 无加成一发
const d1=hp0-E.hp;
P.energy=150; NOW+=9000; const hp1=E.hp; releaseBig(); // 蓄势一发
const d2=hp1-E.hp;
check('蓄势重技 ≈×2 ('+d1+'→'+d2+')', d2>=d1*1.8 && d2<=d1*2.4);

Date.now=_now;
console.log(pass+' pass, '+fail+' fail');
`;
eval(src+driver);
