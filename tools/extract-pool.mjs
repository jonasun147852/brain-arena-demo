// 强化生成系统 · 数据提取:从 index.html 生成 design/pool-data.json
// 用法: node tools/extract-pool.mjs   (每次改卡后重跑,面板与代码永不漂移)
import fs from 'fs';
const src = fs.readFileSync(new URL('../prototypes/single-engine/index.html', import.meta.url), 'utf8');
const js = [...src.matchAll(new RegExp('<script>([\\s\\S]*?)</script>','g'))].map(m=>m[1]).sort((a,b)=>b.length-a.length)[0];
const between = (start) => {
  const i = js.indexOf(start);
  if(i<0) throw new Error('anchor miss: '+start);
  const open = js[i+start.length-1];
  const close = open==='[' ? ']' : '}';
  let d=1, j=i+start.length;
  while(d>0 && j<js.length){ const ch=js[j]; if(ch===open)d++; else if(ch===close)d--; j++; }
  return js.slice(i+start.length-1, j);
};
const HEXES = eval(between('const HEXES = ['));
const BONDS = eval(between('const BONDS = ['));
const K = eval('('+between('const DEFAULTS = {')+')');
const GAMBLE = eval(between('const GAMBLE_IDS = ['));
const gambleGene = ['h12','h16','h17','h18','h19','h20','g04'];   // 赌感北极星族
const cards = HEXES.map(h=>({ ...h,
  pool: h.cat==='升级' ? '觉醒roll(R4/R5)' : h.grow ? '立派+前两抽' : h.cat==='技能' ? '立派+各轮' : '各轮按色',
  lock: GAMBLE.includes(h.id) ? 'RUNS≥2' : '',
  gene: gambleGene.includes(h.id) ? '赌感' : '',
}));
const count = (f) => cards.reduce((a,c)=>{ const k=f(c)||'—'; a[k]=(a[k]||0)+1; return a; },{});
const data = {
  version: (src.match(new RegExp('>v(5[.][\\d.]+)</div>'))||[])[1] || '?',
  generatedAt: new Date().toISOString().slice(0,10),
  total: cards.length,
  bySchool: count(c=>c.school), byCat: count(c=>c.cat), byRar: count(c=>c.rar),
  slots: { light: cards.filter(c=>c.skillSlot==='light').length, heavy: cards.filter(c=>c.skillSlot==='heavy').length,
           upgrades: cards.filter(c=>c.cat==='升级').length, gamble: cards.filter(c=>c.gene).length, grow: cards.filter(c=>c.grow).length },
  K: { ENEMY_HP:K.ENEMY_HP, ENEMY_ATK:K.ENEMY_ATK, ENEMY_CHARGE:K.ENEMY_CHARGE, DRAFT_AT:K.DRAFT_AT,
       PLAYER_HP:K.PLAYER_HP, HEAL:K.HEAL_PER_SECTION, ENRAGE:[K.ENRAGE_AFTER, K.ENRAGE_TIME], LUCKY_P:K.LUCKY_P },
  bonds: BONDS, cards,
};
fs.writeFileSync(new URL('../design/pool-data.json', import.meta.url), JSON.stringify(data, null, 1));
console.log('pool-data.json:', cards.length, '张卡 · v'+data.version);
console.log('school:', JSON.stringify(data.bySchool), '| cat:', JSON.stringify(data.byCat), '| rar:', JSON.stringify(data.byRar));
console.log('slots:', JSON.stringify(data.slots));
