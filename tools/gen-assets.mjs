// 符文机枢 UI 材质包 · OpenAI 图像管线(圣经 §7.5 三分法)
// 用法: node tools/gen-assets.mjs [--only 名称片段] [--force]
import fs from 'fs'; import path from 'path';
const ROOT = new URL('..', import.meta.url).pathname;
const KEY = fs.readFileSync(path.join(ROOT,'.env'),'utf8').match(/OPENAI_API_KEY=(\S+)/)[1];
const OUT = path.join(ROOT,'prototypes/single-engine/art');
fs.mkdirSync(OUT,{recursive:true});

const FRAME = 'dark etched gunmetal game UI, hextech arcane style, engraved rune line ornaments, beveled machined edges, subtle cyan energy seams, symmetrical, clean silhouette, isolated on transparent background, no text';
const ENAMEL = 'polished enamel and gem game UI element, saturated inlay, soft specular highlight, matte dark metal socket, premium mobile game style, clean silhouette, centered, isolated on transparent background, no text';
const PAINT = 'hand-painted game illustration, visible painterly brushstrokes, rich texture, warm rim light against deep blue darkness, no text';

const ASSETS = [
 {f:'bg-gate1.jpg', s:'1536x1024', q:'high', bg:'opaque', p:`vast underground rune cavern arena, glowing cyan glyph pillars, mist floor reflection, wide empty center stage, ${PAINT}, deep blue darkness dominates 70 percent, cinematic wide shot`},
 {f:'bg-gate2.jpg', s:'1536x1024', q:'high', bg:'opaque', p:`twisted shadow forest arena at night, violet witchlights between tall black trees, wide empty center stage, ${PAINT}, darkness dominates 70 percent, cinematic wide shot`},
 {f:'bg-gate3.jpg', s:'1536x1024', q:'high', bg:'opaque', p:`open-air tower summit arena above clouds, crimson storm sky, burning rune ring on floor, wide empty center stage, ${PAINT}, darkness dominates 70 percent, cinematic wide shot`},
 {f:'ui-console.png',  s:'1536x1024', q:'high',   bg:'transparent', p:`ornate rectangular frame border for a quiz console panel, ${FRAME}, completely empty transparent center for nine-slice scaling, gold corner accents`},
 {f:'ui-bossbar.png',  s:'1536x1024', q:'high',   bg:'transparent', p:`long horizontal health bar housing frame, segmented ticks, engraved end caps, ${FRAME}, empty transparent inner channel`},
 {f:'ui-hpbar.png',    s:'1536x1024', q:'medium', bg:'transparent', p:`compact horizontal player health bar frame, small green gem end caps, ${FRAME}, empty transparent inner channel`},
 {f:'ui-tile-light.png',s:'1024x1024',q:'medium', bg:'transparent', p:`square ability button socket with cyan crystal inlay ring, ${ENAMEL}`},
 {f:'ui-tile-heavy.png',s:'1024x1024',q:'medium', bg:'transparent', p:`square ability button socket with amber ember crystal inlay ring, ${ENAMEL}`},
 {f:'ui-gem-off.png',  s:'1024x1024', q:'medium', bg:'transparent', p:`rhombus diamond-shaped gem socket, dark unlit smoky glass, ${ENAMEL}`},
 {f:'ui-gem-lit.png',  s:'1024x1024', q:'medium', bg:'transparent', p:`rhombus diamond-shaped gem, glowing violet enamel, radiant inner light, ${ENAMEL}`},
 {f:'ui-badge-silver.png',s:'1024x1024',q:'medium',bg:'transparent',p:`round rarity emblem, brushed silver enamel laurel, ${ENAMEL}`},
 {f:'ui-badge-gold.png',  s:'1024x1024',q:'medium',bg:'transparent',p:`round rarity emblem, engraved radiant gold enamel laurel, ${ENAMEL}`},
 {f:'ui-badge-prism.png', s:'1024x1024',q:'medium',bg:'transparent',p:`round rarity emblem, iridescent prismatic opal enamel laurel, ${ENAMEL}`},
 {f:'ui-cardbg-silver.png',s:'1024x1536',q:'high', bg:'opaque', p:`vertical trading card background, dark slate parchment with subtle silver filigree border, ${PAINT}, empty center for card content`},
 {f:'ui-cardbg-gold.png',  s:'1024x1536',q:'high', bg:'opaque', p:`vertical trading card background, dark parchment with ornate gold filigree border, ${PAINT}, empty center for card content`},
 {f:'ui-cardbg-prism.png', s:'1024x1536',q:'high', bg:'opaque', p:`vertical trading card background, dark parchment with iridescent prismatic filigree border, ${PAINT}, empty center for card content`},
 {f:'ui-drafttable.jpg',   s:'1536x1024',q:'high', bg:'opaque', p:`dark arcane cloth table backdrop viewed from above, faint woven rune patterns, candle-warm vignette at edges, ${PAINT}`},
];

const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only')+1] : null;
const force = process.argv.includes('--force');
const MODELS = ['gpt-image-2','gpt-image-1.5','gpt-image-1'];

async function gen(a){
  const fp = path.join(OUT, a.f);
  if(!force && fs.existsSync(fp)){ console.log('skip(已存在)', a.f); return; }
  for(const model of MODELS){
    const body = { model, prompt:a.p, size:a.s, quality:a.q, output_format:a.f.endsWith('jpg')?'jpeg':'png' };
    if(a.bg==='transparent') body.background='transparent';
    const r = await fetch('https://api.openai.com/v1/images/generations',{
      method:'POST', headers:{'Authorization':`Bearer ${KEY}`,'Content-Type':'application/json'},
      body: JSON.stringify(body)});
    const j = await r.json();
    if(j.data && j.data[0] && j.data[0].b64_json){
      fs.writeFileSync(fp, Buffer.from(j.data[0].b64_json,'base64'));
      console.log('OK', a.f, model, Math.round(fs.statSync(fp).size/1024)+'KB');
      return;
    }
    const msg = (j.error&&j.error.message)||'unknown';
    if(/model/i.test(msg) && MODELS.indexOf(model)<MODELS.length-1){ continue; }   // 模型不可用→降级
    console.log('FAIL', a.f, model, msg.slice(0,140));
    return;
  }
}
const list = ASSETS.filter(a=>!only || a.f.includes(only));
console.log('生成队列:', list.length, '张');
// 3 并发
let i=0;
async function worker(){ while(i<list.length){ const a=list[i++]; await gen(a); } }
await Promise.all([worker(),worker(),worker()]);
console.log('done');
