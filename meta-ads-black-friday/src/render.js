const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();
for(const v of ['A','B'])for(const [n,h] of [['square-1080x1080',1080],['feed-1080x1350',1350],['story-1080x1920',1920]]){
 const p=await b.newPage({viewport:{width:1080,height:h},deviceScaleFactor:1});
 await p.goto('file://'+path.resolve('ad.html')+`?h=${h}&v=${v}`);await p.waitForTimeout(300);
 await p.locator('#ad').screenshot({path:`../lark-bf-${v}-${n}.png`});await p.close();}
await b.close();})();
