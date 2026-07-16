const fs=require('fs'); require('./_stub.js');
const src=fs.readFileSync('engine.js','utf8');
const driver=`
const byId=id=>HEXES.find(h=>h.id===id);
let pass=0, fail=0;
function check(l,c){ if(c)pass++; else{fail++; console.log('  FAIL:',l);} }
function setup(ids){ global.timers=[]; buildTuner(); freshRun(); K={...DEFAULTS}; rerollLeft=1; R.section=1;
  ids.slice(0,-1).forEach(id=>P.hexes.push(byId(id)));
  pickHex(byId(ids[ids.length-1])); R.draftAt=[9e9,9e9,9e9,9e9,9e9]; __flushShort(); P.energy=150; }

const _now=Date.now; let NOW=9000000; Date.now=()=>NOW;

// ── 1v1:VERSUS 建态 + 镜像塔 ──
startRun('vs1');
check('vs1:VERSUS 建态', VERSUS && VERSUS.mode==='1v1' && VERSUS.foes.length===1 && VERSUS.mates.length===0);
check('vs1:三班牌短局', R.draftAt.length===3);
check('vs1:镜像塔 820', E && E.total===820 && phaseEndThreshold()===0);
check('vs1:不存档', (saveRun(), !localStorage.getItem('ba_save')));

// ── bot 走表:进度增长 ──
VERSUS.foes[0].nextAt = NOW+100;
let grew=false;
for(let i=0;i<200 && !grew;i++){ NOW+=1200; vsBotTick(NOW); grew = VERSUS.foeProgress>0; }
check('bot 答题推进对面塔脉', grew);

// ── 控制冻结对面 ──
const f0=VERSUS.foes[0]; const before=f0.frozenUntil;
vsDelayFoes(5000,'test');
check('冻结盖到对面表上', f0.frozenUntil>=NOW+5000 && f0.frozenUntil>before);
const p0=VERSUS.foeProgress;
const savedNext=f0.nextAt;
vsBotTick(NOW+1000);
check('冻结期不推进', VERSUS.foeProgress===p0);

// ── 对面先破塔 → 竞速失利 ──
VERSUS.foeProgress = E.total - 1;
f0.frozenUntil=0; f0.nextAt=NOW+1;
for(let i=0;i<50 && !VERSUS.over;i++){ NOW+=1500; vsBotTick(NOW); }
check('对面破塔触发终局', VERSUS.over===true);
__flushShort();
check('失利进战报', CUR_SCREEN==='final');

// ── 3v3:队友与对队编制 ──
startRun('vs3');
check('vs3:2 队友 3 对手', VERSUS.mode==='3v3' && VERSUS.mates.length===2 && VERSUS.foes.length===3);
check('vs3:团队塔 2100', E.total===2100);
// 队友伤害砍进我方塔
VERSUS.mates.forEach(b=>{ b.nextAt=NOW+1; b.frozenUntil=0; });
VERSUS.foes.forEach(b=>{ b.frozenUntil=NOW+9e9; });   // 冻死对面只看队友
const hp0=E.hp;
for(let i=0;i<80 && E.hp===hp0;i++){ NOW+=1200; vsBotTick(NOW); }
check('队友输出砍进我方塔', E.hp<hp0);

// ── 我方破塔 → 竞速胜利 ──
E.hp=1; NOW+=2000;
dealDamage(10,'测试','#fff',false,true);
check('我方破塔 versus 终局', VERSUS.over===true);

// ── 回归:普通/无尽不受影响 ──
startRun();
check('普通局 VERSUS 清空', VERSUS===null && E.total===K.ENEMY_HP[0]+K.ENEMY_HP[1]+K.ENEMY_HP[2]);
startRun(true);
check('无尽局 VERSUS 清空', VERSUS===null && ENDLESS===true);
ENDLESS=false;

Date.now=_now;
console.log(pass+' pass, '+fail+' fail');
`;
eval(src+driver);
