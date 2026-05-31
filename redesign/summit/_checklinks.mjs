import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
const root = process.cwd();
const slugs = ["hormone-replacement-therapy","prescription-weight-loss","dermal-fillers-lips","medical-grade-chemical-peel","microneedling-with-rf","liquid-lipo","neurotoxin-treatment","about","contact","pricing","faqs","blogs","deals-and-promotions","cherry-payment-plan","privacy-policy","terms-and-conditions","medication-refill-form","hormone-replacement-therapy-interest-form","current-hrt-clients-medication-refill-form"];
const pages = ["index.html", ...slugs.map(s=>s+"/index.html")];
let broken=[], checked=0, ok=0;
for(const pg of pages){
  const dir = dirname(resolve(root,pg));
  const html = readFileSync(resolve(root,pg),"utf8");
  const hrefs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]);
  for(let h of hrefs){
    if(/^(https?:|mailto:|tel:|data:|#)/.test(h)) continue;
    if(h.includes("${")) continue; // homepage runtime templates
    let p = h.split("#")[0].split("?")[0];
    if(!p) continue;
    checked++;
    let t = resolve(dir, p);
    if(p.endsWith("/")) t = join(t,"index.html");
    else if(!/\.[a-z0-9]+$/i.test(p)) t = join(t,"index.html");
    if(existsSync(t)) ok++; else broken.push(pg+"  →  "+h);
  }
}
console.log(`Checked ${checked} internal links/assets across ${pages.length} pages. OK: ${ok}`);
console.log(broken.length ? "BROKEN LINKS:\n"+broken.join("\n") : "✓ All internal links & assets resolve.");
