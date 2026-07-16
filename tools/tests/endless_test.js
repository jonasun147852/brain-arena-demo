const fs=require('fs'); require('./_stub.js');
const src=fs.readFileSync('engine.js','utf8');
const driver=`
const byId=id=>HEXES.find(h=>h.id===id);
let pass=0, fail=0;
function check(l,c){ if(c)pass++; else{fail++; console.log('  FAIL:',l);} }
function setup(ids){ global.timers=[]; buildTuner(); freshRun(); K={...DEFAULTS}; rerollLeft=1; R.section=1;
  ids.slice(0,-1).forEach(id=>P.hexes.push(byId(id)));
  pickHex(byId(ids[ids.length-1])); R.draftAt=[9e9,9e9,9e9,9e9,9e9]; __flushShort(); P.energy=150; }

// ── 普通模式回归 ──
ENDLESS=false;
setup(['h01','h02']);
check('普通:section1 塔脉总池', E.total===K.ENEMY_HP[0]+K.ENEMY_HP[1]+K.ENEMY_HP[2]);

// ── 无尽:第 4 关起独立血池+几何成长 ──
ENDLESS=true;
setup(['h01','h02']);
R.section=4; spawnFoe();
const hp4=E.hp, atk4=E.atk;
check('无尽4:独立血池 ≈1580×1.38', Math.abs(hp4-Math.round(1580*1.38))<2);
check('无尽4:名字带无尽代号', E.name.includes('无尽1'));
R.section=7; spawnFoe();
check('无尽7:血量几何增长', E.hp>hp4*2);
check('无尽7:攻击成长', E.atk>atk4);

// ── 无尽:每关打完必发一班(欠班合并),非 5 倍数关无奖励 ──
setup(['h01','h02']);
R.section=1; spawnFoe(); E.lastHitKind='普攻';
R.draftAt=[0,30000]; R.draftIdx=2; R.fightMs=50000;
sectionWin();
check('过关必发:_secDraft 挂上', R._secDraft===2);
check('过关必发:班表加了到点班', R.draftAt.length===3 && R.draftAt[2]===50000);
check('非5倍数关:无奖励强化', R.destinyDrawn.length===0);

// ── 5 倍数关:发奖励强化 ──
setup(['h01','h02']);
R.section=5; spawnFoe(); E.lastHitKind='普攻';
R.draftAt=[0,30000]; R.draftIdx=2; R.fightMs=300000;
const hexesBefore=P.hexes.length;
sectionWin();
check('第5关:奖励强化翻牌', R.destinyDrawn.length===1 && P.hexes.length===hexesBefore+1);

// ── grantBonusHex:天命池限定 + 干池返 null ──
setup(['h01','h02']);
const g1=grantBonusHex();
check('赠卡入手且非技能/升级', g1 && g1.cat!=='技能' && g1.cat!=='升级' && has(g1.id));
HEXES.forEach(h=>{ if(!has(h.id)) P.hexes.push(h); });
check('干池赠卡返 null', grantBonusHex()===null);

// ── 池"干"后复读卡接管:无尽永远有班可发 ──
R.section=2; spawnFoe(); E.lastHitKind='普攻'; R._poolDry=false;
R.draftAt=[0,30000]; R.draftIdx=2; R.fightMs=80000; R._secDraft=null;
sectionWin();
check('全持有后仍发班(复读卡)', R._secDraft!==null && R._poolDry===false);
check('此班全是复读卡', rollOffer(R.draftIdx).every(h=>h.voucher));

// ── 第 2 班选完赠卡(战斗内路径) ──
ENDLESS=true;
setup(['h01','h02']);
global.timers=[];
DRAFT_OPEN=true; DRAFT_PAUSE={at:Date.now()}; R.draftPending=1; R.draftIdx=1;
const before2=P.hexes.length;
pickHex(byId('h03'));
__flushShort();   // 冲掉 900ms 赠卡定时器
check('第2班选完赠一张', P.hexes.length>=before2+2);   // h03 + 赠卡

// ── 普通模式收官回归 ──
ENDLESS=false;
setup(['h01','h02']);
R.section=3; spawnFoe(); E.hp=0; R._secDraft=null;
nextSection();
check('普通:三关打完收官进战报', CUR_SCREEN==='final');

ENDLESS=false;
console.log(pass+' pass, '+fail+' fail');
`;
eval(src+driver);
