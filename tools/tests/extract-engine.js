// 从 index.html 提取最大 <script> 段为 engine.js(测试用)
const fs=require('fs'), path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','..','prototypes','single-engine','index.html'),'utf8');
const m=[...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).sort((a,b)=>b.length-a.length)[0];
fs.writeFileSync(path.join(__dirname,'engine.js'), m);
console.log('engine.js', m.length, 'bytes');
