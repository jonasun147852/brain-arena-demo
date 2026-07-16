const fs=require('fs'); require('./_stub.js');
const src=fs.readFileSync('engine.js','utf8');
const driver=`
const byId=id=>HEXES.find(h=>h.id===id);
let pass=0, fail=0;
function check(l,c){ if(c)pass++; else{fail++; console.log('  FAIL:',l);} }
function answer(frac){ global.CLOCK+=Math.max(1,Math.round(q.benchmark*(frac||0.5)*1000));
  const inp=document.getElementById('qInput'); inp.disabled=false; P._betweenQ=false;
  inp.value=String(q.answer); submitAnswer(); __flushShort(); }
function boot(){ global.timers=[]; DRAFT_OPEN=false; DRAFT_PAUSE=null; buildTuner(); K={...DEFAULTS}; startRun(); __flushShort(); }

// ---- 1) 开局立派:VS 演出后第一题之前发牌 ----
boot();
check('开局立派直接开屏', DRAFT_OPEN===true && CUR_SCREEN==='battle');
check('构筑为空', P.hexes.length===0);
check('第一抽 4 选 1', R._offer.length===4);
check('2 技能(1轻1重)', R._offer.filter(h=>h.cat==='技能').length===2
  && R._offer.some(h=>h.skillSlot==='light') && R._offer.some(h=>h.skillSlot==='heavy'));
check('2 成长', R._offer.filter(h=>h.grow).length===2);
check('发牌中技能锁死', (P.energy=150, releaseBig(), P.energy===150));

// ---- 2) 点击护盾 + 双击守卫 + 选牌关屏开题 ----
const sk1 = R._offer.find(h=>h.cat==='技能');
const nHex = P.hexes.length;
pickHexFromDraft(sk1);
check('开屏 400ms 内点击被护盾吞掉', P.hexes.length===nHex && DRAFT_OPEN===true);
global.CLOCK += 500;   // 护盾过期
pickHexFromDraft(sk1);
pickHexFromDraft(sk1);   // 双击第二下必须被吞掉
__flushShort();
check('双击不重复入包', P.hexes.length===nHex+1);
check('关屏开题', !DRAFT_OPEN && CUR_SCREEN==='battle' && !!q && !document.getElementById('qInput').disabled);
check('draftIdx=1', R.draftIdx===1);
check('技能已改写', ownedSkill(sk1.skillSlot).id===sk1.id);
check('重入缓冲', E.graceUntil > Date.now());

// ---- 3) 30s 刻度:题内只挂 pending,结算拍开屏 ----
R.fightMs = 30001; checkDraftClock();
check('到点挂起 pending', R.draftPending===1);
check('题目未被打断', !DRAFT_OPEN && !!q);
E.charge = 0;
answer(0.5);
check('结算拍开屏', DRAFT_OPEN===true);
check('二抽 4 选 1', R._offer.length===4);
check('二抽一手同色', new Set(R._offer.map(h=>h.rar)).size===1 && R._offer[0].rar===R._offerRar);
pickHex(R._offer[0]); __flushShort();

// ---- 4) 充能门:敌人出手在即不开屏 ----
R.fightMs = 75001; checkDraftClock();
check('三抽挂起', R.draftPending===2);
E.charge = E.chargeNeed*1000*0.75; E.stunnedUntil=0; E.frozenUntil=0;   // 门上但离满远:结算耗时不至于顶满触发出手清零
R._draftPendingSince = R.fightMs;
answer(0.5);
check('充能≥70% 不开屏', !DRAFT_OPEN);
E.charge = 0;
answer(0.5);
check('充能落地后下个结算拍开屏', DRAFT_OPEN===true);
check('末班车 4 选 1', R._offer.length===4);
check('末班车一手同色', new Set(R._offer.map(h=>h.rar)).size===1);
pickHex(R._offer[0]); __flushShort();

// ---- 5) 饿死保险:pending 超 8s 豁免充能门 ----
R.fightMs = 150001; checkDraftClock();
E.charge = E.chargeNeed*1000*0.9;
R._draftPendingSince = R.fightMs - 9000;
answer(0.5);
check('8s 饿死保险开屏', DRAFT_OPEN===true);
check('四抽 3 选 1', R._offer.length===3);
check('四抽无成长卡', !R._offer.some(h=>h.grow));
check('四抽一手同色(觉醒槽除外)', new Set(R._offer.filter(h=>h.cat!=='升级').map(h=>h.rar)).size<=1);
pickHex(R._offer[0]); __flushShort();
// 五抽棱彩轮
R.fightMs = 210001; checkDraftClock();
R._draftPendingSince = R.fightMs - 9000;
answer(0.5);
check('五抽开屏', DRAFT_OPEN===true);
check('五抽一手同色且非白银', new Set(R._offer.filter(h=>h.cat!=='升级').map(h=>h.rar)).size<=1 && R._offerRar!=='silver');
pickHex(R._offer[0]); __flushShort();

// ---- 6) 觉醒:资格 + pity 保底 ----
boot();
pickHex(R._offer[0]); __flushShort();
R.draftAt=[0,9e9,9e9,9e9,9e9];
P.hexes.push(byId('s01'));
P.castCounts.swap = 3;
PITY = 3;
const off3 = rollOffer(3);
check('pity≥3 D3 保底出升级卡', off3.some(h=>h.id==='u01'));
check('出现即清 pity', PITY===0);
check('_upSeen 立起', R._upSeen===true);
// 无资格不出
R._upSeen=false; R._upRolled=false; R._upPick={}; R._tierByRound={};
P.castCounts.swap = 0;
const off3b = rollOffer(3);
check('无资格绝不出升级卡', !off3b.some(h=>h.cat==='升级'));
check('无资格不算 roll', R._upRolled===false);

// ---- 7) 槽位锁定:升级后同槽技能卡退池 ----
P.hexes.push(byId('u01'));
check('轻槽已觉醒', slotUpgraded('light'));
check('技能池无轻卡', !skillCardPool().some(h=>h.skillSlot==='light'));
check('普通池无轻技能卡', !normalPool().some(h=>h.cat==='技能' && h.skillSlot==='light'));

// ---- 8) 过关时钟保底 + 欠牌并入结算屏 ----
boot();
pickHex(R._offer[0]); __flushShort();   // 先领开局立派
R.fightMs = 5000;
E.hp = phaseEndThreshold()+1; E.phaseClear=false;
dealDamage(2,'测试','#fff');
__flushShort();
check('结算屏', CUR_SCREEN==='secres');
check('时钟保底 80s', R.fightMs>=80000);
check('欠牌并入结算屏', R._secDraft===1 && R._offer.length===4);
const btnHidden = document.getElementById('secresBtn').style.display==='none';
check('未选不能走', btnHidden);
pickHex(R._offer[0]);
check('补给已领', R._secDraft===null && R.draftIdx===2);
nextSection(); __flushShort();
check('进第二关', CUR_SCREEN==='battle' && R.section===2);

// ---- 9) 终局追赶:进第 3 关,未发刻度全部拉进 12s 间隔 ----
boot();
pickHex(R._offer[0]); __flushShort();
R.draftAt=[0,100,200,150000,180000]; R.draftIdx=3; R.fightMs=100000; R.draftPending=null;
R.section=3; beginSection(); __flushShort();
check('终局追赶 D3', R.draftAt[3]===112000);
check('终局追赶 D4', R.draftAt[4]===124000);

// ---- 10) 充能护栏:同周期第二次清零只清一半 ----
boot();
pickHex(R._offer[0]); __flushShort();
E.charge = 5000; applyStun();
check('第一次清零', E.charge===0);
E.charge = 4000; applyStun();
check('第二次只清一半', E.charge===2000);
E.stunCycleGuard=false;   // 模拟 enemyAttack 重置
E.charge = 4000; applyStun();
check('新周期恢复全清', E.charge===0);

// ---- 11) 费用地板 ----
boot();
pickHex(R._offer[0]); __flushShort();
P.hexes.push(byId('h12')); P.skillDisc=18;
check('轻技全局地板 25', skillCost('light','small')===25);
check('重技 100-18-20=62', skillCost('heavy','big')===62);
P.hexes.push(byId('u01'));
check('借题发挥恒价 40', skillCost('light','swap')===40);

// ---- 12) 空手局 pity 累进 ----
boot();
pickHex(R._offer[0]); __flushShort();
PITY=0; R._upRolled=true; R._upSeen=false;
P.castCounts.big=3;
finishRun(true);
check('空手局 pity+1', PITY===1);

// 轮色分布抽样(色随机,一手同色)
{
  boot(); pickHex(R._offer[0]); __flushShort();
  const dist={};
  for(let i=0;i<500;i++){ R._tierByRound={}; const off=rollOffer(1); dist[R._offerRar]=(dist[R._offerRar]||0)+1;
    if(new Set(off.map(h=>h.rar)).size!==1){ check('R1 同色破例', false); break; } }
  check('R1 轮色随机(银金都出现)', dist.silver>0 && dist.gold>0);
  check('R1 银显著多于彩(抽样容差)', dist.silver > (dist.prism||0)+100);
  const d4={};
  for(let i=0;i<200;i++){ R._tierByRound={}; rollOffer(4); d4[R._offerRar]=(d4[R._offerRar]||0)+1; }
  check('R4 不出白银', !d4.silver);
  check('R4 棱彩显著存在(抽样容差)', (d4.prism||0) > 200*0.42);
}
console.log(\`draft tests: \${pass} pass, \${fail} fail\`);
`;
try{ eval(src+"\n"+driver); }catch(e){ console.log('THREW:', e.message, e.stack.split('\n')[2]||e.stack.split('\n')[1]); }
