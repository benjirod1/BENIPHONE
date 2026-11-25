const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();
for(const [n,h] of [['feed',1350],['story',1920]]){const p=await b.newPage({viewport:{width:1080,height:h}});
await p.goto('file://'+path.resolve('ad-full.html')+`?h=${h}&v=A`);await p.waitForTimeout(300);
await p.locator('#ad').screenshot({path:`/tmp/claude-0/-home-user-BENIPHONE/a2284060-401a-5e64-ab4d-de04a3985fc6/scratchpad/test-${n}.png`});await p.close();}
await b.close();})();
