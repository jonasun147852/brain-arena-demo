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
 {f:'concept-v-jinbang-guochao.jpg', s:'1024x1536', q:'high', bg:'opaque', p:`mobile quiz battle game UI concept art, portrait 1024x1536, BRIGHT Chinese guochao variety-show esports arena on warm low-saturation rice-paper ivory stage, matte gold trim on panel frames only, strict 10-color palette, uniform dark ink-navy #1E2430 outlines 3-4px outer 1-2px inner on every element, flat two-tone cel shading with subtle xuan-paper grain, flat even daylight, festive scholarly exam-hall tension. Top: cyan-blue YOU versus red-orange RIVAL tug-of-war bar clashing at gold VS emblem. Upper-left below capsule: orange brush-stroke combo flame counter. Upper-center: red-orange health bar over chibi door-god examiner boss, 3 heads tall, three-zone opera face-paint, bronze taotie armor, crossed-arm proctor pose, stone brow, cyan eye glow. Center: crisp paper-white question card, single highest-contrast element, ink text, four saturated cyan-blue answer buttons in one column, slim incense-stick countdown, ember tip, above card. Left edge: muted-ink carved-seal build column. Bottom corners: square carved-seal skill tiles, cyan liquid-fill energy inside tiles. NO independent energy bar, NO rank-ladder motif, NO lower-area combo counter, NO darkness, NO patterns near question card, NO red-gold flooding, NO horror, NO skulls, NO religious icons, NO gradients, NO casino imagery`},
 {f:'concept-v-liangle-mainstream-bright.jpg', s:'1024x1536', q:'high', bg:'opaque', p:`mobile quiz battle game UI concept art, portrait 1024x1536, BRIGHT esports variety-show studio arena, low-saturation pale teal-grey stage, flat even daylight lighting, strict 10-color palette, saturation reserved for information layer only, uniform dark-navy outlines 3-4px outer 1-2px inner on every element, flat two-tone cel shading, felt-grain texture, top: red YOU versus blue RIVAL tug-of-war bar clashing at gold VS emblem, upper-center: stone golem examiner boss, 3 heads tall, chunky angular geometric silhouette, flat stone brow pressed low, arms crossed gazing down, glowing cyan sigma rune on chest, center: crisp ivory-white question card, single highest-contrast element, bold dark text, four full-width cyan-blue answer buttons in one column, left: tall orange combo flame capsule, right: countdown ring with red final-third arc, above skill row: horizontal strip of small greyscale rune badges showing equipped build, bottom corners: squared low-radius rune skill tiles including one wax-seal wager tile, blue energy liquid inside buttons, cheerful fierce game-show exam energy, NO dark background, NO horror, NO skulls, NO religious symbols, NO casino imagery, NO coins, NO gradients, NO neon-on-black, NO photorealism`},
 {f:'concept-v-nuanyang-mass-warm.jpg', s:'1024x1536', q:'high', bg:'opaque', p:`mobile quiz battle game UI concept art, portrait 1024x1536, bright warm mass-market casual arena in match-3 aesthetic, cream-apricot backdrop, single focal point, limited 10-color palette: warm cream base, paper white, deep ink-navy, bright sky cyan, combo orange, rival red-orange, rare gold accents, uniform dark-navy outlines 4px outer 2px inner, flat two-tone cel shading, zero gradients, flat even daylight, top chunky red versus blue tug-of-war bar with gold VS badge, upper-center warm sandstone golem examiner, 3 heads tall, huge friendly close-up face, eyes 40 percent of face width, one stern flat stone brow, cyan glint in eyes, holding a score paddle rimmed by a red-orange charge arc, center big pure-white question card as single highest-contrast element, giant bold dark text, four full-width candy-slab answer buttons in one column, thick outlines, small red-orange bet chip announcing next-question-doubles beside the card, lower orange flame combo counter, cyan energy bar, bottom corners compact square rune skill tiles, cheerful daytime game-show energy with real stakes, ad-ready first frame, NO darkness, NO horror, NO skulls, NO religious symbols, NO casino slot imagery, NO neon, NO pastel macaron, NO gradients, NO clutter`},
 {f:'concept-v-xideng-dark-finals.jpg', s:'1024x1536', q:'high', bg:'opaque', p:`mobile quiz battle game UI concept art, portrait 1024x1536, esports quiz studio, house lights off for finals night, deep desaturated slate-navy stage never pure black, dim cyan rune etchings on floor, one cool overhead spotlight cone, strict 11-color palette, one accent per channel: cyan energy, combo-only orange flame, red-orange rival danger, transient gold only, decoration pressed muted grey-navy, uniform dark navy outlines 3-4px outer 1-2px inner, flat two-tone cel shading, characters keep bright daylight colors, top: fully bright red YOU versus blue RIVAL tug-of-war bar with glowing VS emblem, upper-center: chibi stone golem examiner, 3 heads tall, chunky granite body, stern flat stone brow, glowing cyan sigma rune on chest, arms-crossed proctor pose, center: luminous ivory question card as the single highest-contrast element, extra-large bold dark navy question text, four saturated cyan answer buttons with thick outlines, lower: orange flame combo counter, cyan energy bar, red-orange crystal multiplier gems, blackout-final tension, fierce but clean, NO pure black, NO horror, NO skulls, NO occult or religious symbols, NO blue-purple haze, NO casino slot-machine imagery, NO muddy darkness`},
 {f:'concept-liangl-battle.jpg', s:'1024x1536', q:'high', bg:'opaque', p:`mobile quiz battle game UI concept art, portrait. BRIGHT competitive arena: light teal-grey stage (NOT dark), bold thick black outlines everywhere, flat two-tone cel shading, saturated warm colors on characters and buttons, limited 10-color palette. Top: chibi stone golem examiner boss, 2.5 heads tall, chunky geometric silhouette, glowing cyan sigma rune chest, smug intimidating proctor expression, red-versus-blue duel progress bar. Center: clean white question card highest contrast with bold dark text, four bright answer buttons thick outlines. Bottom: orange fire combo counter, blue energy bar, red-orange multiplier gems. Speed lines, confetti particles, esports variety-show stage energy. Style: Brawl Stars meets TFT mobile, cheerful but fierce, NO darkness NO horror`},
  {f:'concept-liangl-sigma.png', s:'1024x1024', q:'high', bg:'transparent', p:`chibi stone golem examiner boss character, 2.5 heads tall, chunky geometric rock body with sharp angular silhouette, glowing cyan sigma rune core on chest, thick bold black outer outlines with thinner inner lines, flat cel shading exactly two tones per color, saturated bright colors, smug intimidating expression like a strict exam proctor, arms crossed, cartoon exaggeration, Brawl Stars Clash Royale character style, isolated on transparent background, NO dark atmosphere`},
  {f:'foe-sigma.png', s:'1024x1024', q:'high', bg:'transparent', p:`ancient stone golem guardian, floating cracked rock torso with glowing cyan sigma rune core, slow heavy presence, orbiting stone fragments, cyan energy veins in cracks, symmetrical front view, isolated character on transparent background, ${PAINT}`},
  {f:'foe-omega.png', s:'1024x1024', q:'high', bg:'transparent', p:`spectral hunter wraith, sleek predator silhouette formed of violet smoke and blades, glowing purple omega rune as its eye, mid-lunge coiled posture, thin sharp shapes, asymmetric dynamic front view, isolated character on transparent background, ${PAINT}`},
  {f:'foe-delta.png', s:'1024x1024', q:'high', bg:'transparent', p:`tyrant overlord avatar, monolithic triangular obsidian crown-form wreathed in crimson flame, glowing red delta rune heart, ember particles rising, oppressive scale, throne-like silhouette, symmetrical imposing front view, isolated character on transparent background, ${PAINT}`},
  {f:'keyart-title.jpg', s:'1536x1024', q:'high', bg:'opaque', p:`epic title splash: a glowing luminous pen morphing into a sword blade held aloft, before a colossal dark rune tower, three guardian sigils orbiting the tower (cyan sigma, violet omega, crimson delta), ${PAINT}, dark negative space at top third for logo, deep blue darkness dominates, cinematic scale`},
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
