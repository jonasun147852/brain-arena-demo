const fs=require('fs'); require('./_stub.js');
const src=fs.readFileSync('engine.js','utf8');
const driver=`
let pass=0, fail=0;
function check(l,c){ if(c)pass++; else{fail++; console.log('  FAIL:',l);} }
buildTuner(); freshRun(); K={...DEFAULTS}; R.section=1;

// 简单档:只出 easy;数学只有加减/表内乘/数列,无方程无百分比
MODE='easy';
let diffs=new Set(), types=new Set(), maxBench=0;
for(let i=0;i<300;i++){ R.usedQ.clear(); const g=genQuestion(1);
  diffs.add(g.difficulty); types.add(g.type); }
check('easy 档只出 easy', diffs.size===1 && diffs.has('easy'));
check('easy 档无方程/百分比', !types.has('eq') && !types.has('pct'));
// 数学题数值抽查:答案都是非负整数且不超过 400
let mathOK=true;
for(let i=0;i<200;i++){ const g=genMath('easy'); if(!(Number.isInteger(g.answer)&&g.answer>=0&&g.answer<=400)) mathOK=false; }
check('easy 数学答案健康', mathOK);
// 强制难度封顶:hard→medium
check('easy 档审判题封顶中等', modeCapDiff('hard')==='medium');
// 计时放宽:同题型 easy 档基准 = 挑战档 ×1.6
MODE='hard'; const bHard=benchmark('mc','easy');
MODE='easy'; const bEasy=benchmark('mc','easy');
check('easy 档计时 ×1.6', Math.abs(bEasy/bHard-1.6)<0.01);

// 中等档:三档都可能出,medium 为主
MODE='mid';
let cnt={easy:0,medium:0,hard:0};
for(let i=0;i<600;i++){ R.usedQ.clear(); const g=genQuestion(1); cnt[g.difficulty]++; }
check('mid 档 medium 为主', cnt.medium>cnt.easy && cnt.medium>cnt.hard && cnt.medium>250);
check('mid 档仍有 easy', cnt.easy>50);

// 挑战档:hard 出现且 easy 少
MODE='hard'; cnt={easy:0,medium:0,hard:0};
for(let i=0;i<600;i++){ R.usedQ.clear(); const g=genQuestion(3); cnt[g.difficulty]++; }
check('hard 档第三关 hard 为主', cnt.hard>cnt.easy && cnt.hard>200);

// 充能放宽:easy 档敌人充能 ×1.45
MODE='hard'; freshRun(); K={...DEFAULTS}; R.section=1; spawnFoe(); const cHard=E.chargeNeed;
MODE='easy'; freshRun(); K={...DEFAULTS}; R.section=1; spawnFoe(); const cEasy=E.chargeNeed;
check('easy 档充能 ×1.45', Math.abs(cEasy/cHard-1.45)<0.01);
MODE='hard';
console.log(pass+' pass, '+fail+' fail');
`;
eval(src+driver);
