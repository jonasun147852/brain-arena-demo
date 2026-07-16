// 无头测试桩(重建版):最小 DOM/环境仿真,供 engine.js eval 使用
// 教训:原版住在会话 scratchpad 里被清了——测试资产从此进仓库。
const els = new Map();
function mkEl(id){
  const el = {
    id, style:{ setProperty(){}, removeProperty(){} }, dataset:{},
    classList:{ _s:new Set(),
      add(...c){ c.forEach(x=>this._s.add(x)); },
      remove(...c){ c.forEach(x=>this._s.delete(x)); },
      toggle(c,f){ if(f===undefined) f=!this._s.has(c); if(f) this._s.add(c); else this._s.delete(c); return f; },
      contains(c){ return this._s.has(c); } },
    children:[], textContent:'', innerHTML:'', value:'', disabled:false, placeholder:'', title:'',
    appendChild(c){ this.children.push(c); return c; },
    removeChild(c){ const i=this.children.indexOf(c); if(i>=0) this.children.splice(i,1); },
    addEventListener(){}, removeEventListener(){},
    focus(){}, blur(){}, click(){}, setAttribute(){}, removeAttribute(){},
    getBoundingClientRect(){ return {left:0, top:0, width:100, height:100, x:0, y:0, right:100, bottom:100}; },
    offsetWidth:0, parentElement:null,
  };
  Object.defineProperty(el, 'className', {
    get(){ return [...el.classList._s].join(' '); },
    set(v){ el.classList._s = new Set(String(v).split(/\s+/).filter(Boolean)); },
  });
  return el;
}
global.document = {
  getElementById(id){ if(!els.has(id)) els.set(id, mkEl(id)); return els.get(id); },
  createElement(){ return mkEl('el_'+Math.random()); },
  createTextNode(t){ return { textContent:t }; },
  querySelectorAll(){ return []; },
  // 故意不给 querySelector:引擎内有存在性守卫,顺带验证守卫不丢
  fonts: { load(){ return Promise.resolve(); } },
  addEventListener(){}, removeEventListener(){},
  activeElement: null,
  body: mkEl('body'),
};
global.window = {
  location: { search:'', pathname:'/', href:'http://test/' },
  addEventListener(){}, removeEventListener(){},
  devicePixelRatio: 1, innerWidth: 1280, innerHeight: 800,
};
global.navigator = { maxTouchPoints: 0, userAgent: 'headless-test', vibrate(){} };
global.localStorage = {
  _m: Object.create(null),
  getItem(k){ return k in this._m ? this._m[k] : null; },
  setItem(k, v){ this._m[k] = String(v); },
  removeItem(k){ delete this._m[k]; },
};
global.fetch = () => Promise.resolve({ ok:true });   // 遥测上报在测试里必须是哑炮
global.requestAnimationFrame = fn => { return 0; };

// 虚拟时钟:Date.now 由 global.CLOCK 接管,测试手动拨表(确定性时序,消灭真实时间竞态)
global.CLOCK = 1000000000;
Date.now = () => global.CLOCK;

// 定时器捕获:游戏逻辑的 setTimeout 全部入队,由测试用 __flushShort() 手动冲洗
global.timers = [];
global.setTimeout = (fn, ms) => { global.timers.push({ fn, ms: ms||0 }); return { _t:true }; };
global.clearTimeout = () => {};
global.setInterval = () => ({ _i:true });
global.clearInterval = () => {};
global.__flushShort = (cap) => {   // 冲洗 ≤cap ms 的排队回调(默认 2000),连锁新入队的也冲,防死循环上限 6 轮
  cap = cap==null ? 2000 : cap;
  for(let round=0; round<6; round++){
    const batch = global.timers.filter(t=>t.ms<=cap);
    if(!batch.length) break;
    global.timers = global.timers.filter(t=>t.ms>cap);
    batch.forEach(t=>{ try{ t.fn(); }catch(e){} });
  }
};
