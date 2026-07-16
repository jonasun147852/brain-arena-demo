const fs=require('fs'); require('./_stub.js');
const src=fs.readFileSync('engine.js','utf8');
const driver=`
const byId=id=>HEXES.find(h=>h.id===id);
let pass=0, fail=0;
function check(l,c){ if(c)pass++; else{fail++; console.log('  FAIL:',l);} }
function setup(ids){ global.timers=[]; buildTuner(); freshRun(); K={...DEFAULTS}; rerollLeft=1; R.section=1;
  ids.slice(0,-1).forEach(id=>P.hexes.push(byId(id)));
  pickHex(byId(ids[ids.length-1])); R.draftAt=[9e9,9e9,9e9,9e9,9e9]; __flushShort(); P.energy=150; }

// 收卷:出刀提前 20%(充能阈值 ×0.8)+ 伤害缩水 40%
ENDLESS=false;
setup(['h01','h02']);
const cn0=E.chargeNeed;
applyHexPick(byId('h25'));
check('收卷:入手即提前', Math.abs(E.chargeNeed-cn0*0.8)<1e-9);
const hpA=P.hp; E.charge=0; E.parryWindow=false; enemyAttack();
const dmgA=hpA-P.hp;
check('收卷:伤害缩水(≈0.6×7=4)', dmgA<=5 && dmgA>=3);

// 铁布衫:可叠减伤
setup(['h01','h02']);
P.hexes.push(byId('v02')); P.hexes.push(byId('v02')); P.hexes.push(byId('v02'));
check('vcount 计数', vcount('v02')===3);
const hpB=P.hp; enemyAttack(); const dmgB=hpB-P.hp;
check('铁布衫×3:7→约6', dmgB<=6.5 && dmgB>=5);

// 磨刀石:输出加成
setup(['h01','h02']);
const raw0=(()=>{ const h0=E.hp; dealDamage(100,'测试','#fff',false,true); return h0-E.hp; })();
P.hexes.push(byId('v01')); P.hexes.push(byId('v01'));
const raw1=(()=>{ const h0=E.hp; dealDamage(100,'测试','#fff',false,true); return h0-E.hp; })();
check('磨刀石×2:100→116', raw1===116 && raw0===100);

// 没收:控制回能
setup(['h26','h01']);
P.energy=50; applyStun();
check('没收:定身回 15', P.energy===65);

// 擦掉:每关首错豁免(直接查字段路径)
setup(['h27','h01']);
check('擦掉:开局未用', P._eraserUsed===false);

// 左右开弓:同态对照(基线重技 vs 交替重技 = 1.3×)
const _now2=Date.now; let NOW2=5000000; Date.now=()=>NOW2;
setup(['h29','h01']);
P.energy=150; P.combo=0; P.lastSlot=null;
const hpA0=E.hp; releaseBig(); const dH0=hpA0-E.hp;   // 基线:首发重技无交替
setup(['h29','h01']);
P.energy=150; P.combo=0; NOW2+=9000;
releaseSmall();                                        // 轻技定槽位
NOW2+=1000; P.energy=150;
const hpA1=E.hp; releaseBig(); const dH1=hpA1-E.hp;   // 交替重技
check('左右开弓:交替=1.3×基线 ('+dH0+'→'+dH1+')', Math.abs(dH1-Math.round(dH0*1.3))<=2);
// 一唱一和:节拍层数
setup(['h30','h01']);
P.energy=150; NOW2+=9000;
releaseSmall(); check('首发无节拍', P.beatStacks===0);
NOW2+=1000; P.energy=150; releaseBig();
check('轻→重 +1 层', P.beatStacks===1);
NOW2+=1000; P.energy=150; releaseBig();
check('连点同槽清零', P.beatStacks===0);
// 趁胜追击:窗口折扣+失效
setup(['h31','h01']);
P.energy=150; NOW2+=9000;
releaseBig();
check('重技命中开窗', P._pursuitUntil>NOW2);
const e0=P.energy; releaseSmall();
check('窗内轻技 50→30', e0-P.energy===30);
NOW2+=5000; P.energy=150; const e1=P.energy; releaseSmall();
check('窗外原价', e1-P.energy===50);
Date.now=_now2;

// 复读卡池规则
ENDLESS=false;
setup(['h01','h02']);
check('普通模式:复读卡不入池', normalPool().every(h=>!h.voucher));
ENDLESS=true;
P.hexes.push(byId('v01'));
check('无尽:已持复读卡仍入池', normalPool().some(h=>h.id==='v01'));
check('奖励池排除复读卡', (()=>{ for(let i=0;i<30;i++){ const g=grantBonusHex(); if(g&&g.voucher) return false; } return true; })());
ENDLESS=false;
console.log(pass+' pass, '+fail+' fail');
`;
eval(src+driver);
