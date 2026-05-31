// OptimalJoy · Summit — static sub-page generator.
// Produces <slug>/index.html for every menu + treatment page from a shared shell.
// Run: node _build.mjs   (from redesign/summit/)
import { writeFileSync } from 'node:fs';

const BOOK = "https://www.optimantra.com/optimus/om/patient/login";
const A = "../../../assets";   // assets path from a sub-page folder
const H = "..";                // summit homepage from a sub-page folder
const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

const CONTACT = { phone:"(865) 855-5441", phoneNote:"Text ONLY", email:"info@optimaljoylife.com",
  street:"921 Foch St", city:"Maryville", state:"TN", zip:"37801", hours:"By Appointment Only" };
const SOCIAL = [
  {p:"Facebook", u:"https://www.facebook.com/profile.php?id=100077419494058"},
  {p:"Instagram", u:"https://www.instagram.com/optimaljoy.traci/"}
];
const TREATMENTS = [
  {slug:"hormone-replacement-therapy", name:"Hormone Replacement Therapy"},
  {slug:"prescription-weight-loss", name:"Medical Weight Loss"},
  {slug:"dermal-fillers-lips", name:"Dermal Fillers / Lips"},
  {slug:"medical-grade-chemical-peel", name:"Medical Grade Chemical Peel"},
  {slug:"microneedling-with-rf", name:"Microneedling with RF"},
  {slug:"liquid-lipo", name:"Liquid Lipo"},
  {slug:"neurotoxin-treatment", name:"Neurotoxin Treatment"},
];

/* ---------------- shared shell ---------------- */
const CSS = `
:root{
  --bronze:#C4926b;--bronze-d:#a9774f;--clay:#7a5230;--gold:#d6a23f;--gold-b:#f2af29;
  --teal:#38C5B5;--teal-d:#2DA194;--teal-deep:#1e6f64;
  --sand:#efe4d3;--linen:#f6efe3;--cream:#fbf6ec;--paper:#fdf9f1;
  --ink:#2a1f15;--text:#6a5947;--muted:#a89782;--line:#e6d9c5;--espresso:#241910;
  --disp:'Cormorant Garamond',Georgia,serif;--serif:'Cormorant Garamond',Georgia,serif;
  --sans:'EB Garamond',Georgia,serif;--vintage:'Cinzel',Georgia,serif;
  --r:20px;--sh:0 26px 60px rgba(36,25,16,.18);
  --grain:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--sans);color:var(--text);background:var(--paper);line-height:1.62;font-size:1.1rem;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{max-width:100%;display:block}a{text-decoration:none;color:inherit}
h1,h2,h3,h4{font-family:var(--disp);color:var(--ink);font-weight:600;line-height:1.08;letter-spacing:0}
.wrap{max-width:1140px;margin:0 auto;padding:0 28px}
.narrow{max-width:820px;margin:0 auto;padding:0 28px}
section{padding:84px 0;position:relative}
[id]{scroll-margin-top:92px}
body::after{content:"";position:fixed;inset:0;background:var(--grain);background-size:170px;opacity:.04;pointer-events:none;z-index:9999;mix-blend-mode:multiply}
.kw{font-family:var(--vintage);text-transform:uppercase;letter-spacing:.2em;font-size:.78rem;font-weight:600;color:var(--gold);display:inline-flex;align-items:center;gap:12px}
.kw::before{content:"";width:30px;height:2px;background:var(--gold)}
.kw.c{justify-content:center}
.btn{font-family:var(--sans);display:inline-flex;align-items:center;gap:.5em;background:var(--gold-b);color:#3a2a12;font-weight:700;padding:.95rem 1.9rem;border-radius:100px;border:none;cursor:pointer;transition:.25s;font-size:1rem;box-shadow:0 12px 26px rgba(214,162,63,.28)}
.btn:hover{background:var(--gold);transform:translateY(-3px);box-shadow:0 18px 34px rgba(214,162,63,.4)}
.btn.teal{background:var(--teal-d);color:#fff;box-shadow:0 12px 26px rgba(45,161,148,.3)}
.btn.teal:hover{background:var(--teal)}
.btn.ghost{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.5);box-shadow:none}
.btn.ghost:hover{background:#fff;color:var(--ink);border-color:#fff}
.btn.out{background:transparent;color:var(--clay);border:1.5px solid var(--clay);box-shadow:none}
.btn.out:hover{background:var(--clay);color:#fff}
.reveal{opacity:0;transform:translateY(40px) scale(.99);filter:blur(6px);transition:opacity 1s cubic-bezier(.16,1,.3,1),transform 1.1s cubic-bezier(.16,1,.3,1),filter .9s ease}
.reveal.in{opacity:1;transform:none;filter:none}

/* header */
header{position:sticky;top:0;z-index:50;background:rgba(253,249,241,.88);backdrop-filter:blur(13px);border-bottom:1px solid var(--line)}
.nav{display:flex;align-items:center;justify-content:space-between;height:84px}
.nav img{height:48px}
.nav .bookbtn{padding:.46rem 1rem;font-size:.82rem;background:transparent;color:var(--ink);border:1.5px solid var(--clay);box-shadow:none;border-radius:100px;font-weight:700;font-family:var(--sans);transition:.2s}
.nav .bookbtn:hover{background:var(--clay);color:#fff}
.links{display:flex;gap:34px;align-items:center}
.links>a,.subtoggle{font-weight:600;font-size:1rem;color:var(--ink);font-family:var(--sans);background:none;border:none;cursor:pointer;padding:0;display:inline-flex;align-items:center;gap:6px}
.links>a:hover,.subtoggle:hover{color:var(--clay)}
.caret{font-size:.6rem;transition:.25s}
.navitem.has-sub{position:relative;display:flex;align-items:center}
.navitem.open .caret{transform:rotate(180deg)}
.submenu{display:none;position:absolute;top:calc(100% + 16px);left:0;min-width:250px;background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:var(--sh);padding:10px;flex-direction:column;z-index:60}
.navitem.open>.submenu{display:flex}
.submenu a{padding:10px 14px;border-radius:10px;font-size:.96rem;color:var(--ink);white-space:nowrap;font-weight:500}
.submenu a:hover{background:var(--sand);color:var(--clay)}
.submenu a.all{font-weight:700;color:var(--clay)}
@media(hover:hover) and (min-width:921px){.navitem.has-sub:hover>.submenu{display:flex}.navitem.has-sub:hover .caret{transform:rotate(180deg)}}
.burger{display:none;background:none;border:none;font-size:1.6rem;cursor:pointer;color:var(--ink)}

/* banner */
.banner{background:radial-gradient(120% 130% at 80% 0%,#3c2a18,#241910 60%,#1b120a);color:#f3e8d6;position:relative;overflow:hidden;padding:0}
.banner::before{content:"";position:absolute;inset:0;background:var(--grain);background-size:160px;opacity:.5;mix-blend-mode:overlay;pointer-events:none}
.banner .inner{position:relative;z-index:2;padding:72px 0 96px;text-align:center}
.banner .crumb{font-family:var(--sans);font-size:.9rem;color:#cdb89c;margin-bottom:18px}
.banner .crumb a:hover{color:var(--gold-b)}
.banner h1{color:#fff;font-size:clamp(2.6rem,6vw,4.4rem);margin:.4rem 0 .8rem}
.banner p{color:#d9c9b4;max-width:42rem;margin:0 auto 1.6rem;font-size:1.16rem}
.banner svg.ridge{position:absolute;left:0;bottom:0;width:100%;height:80px;z-index:2}

/* prose */
.prose{max-width:820px;margin:0 auto}
.prose.center{text-align:center}
.prose h2{font-size:clamp(2rem,4vw,3rem);margin-bottom:1rem}
.prose p{margin-bottom:1rem;font-size:1.14rem}
.lead{font-size:1.22rem;color:var(--ink)}

/* cards */
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:46px}
.cards.two{grid-template-columns:repeat(2,1fr)}
.card{background:radial-gradient(130% 130% at 0% 0%,#fff,var(--cream));border:1px solid var(--line);border-radius:var(--r);padding:34px 30px;transition:.3s;position:relative;overflow:hidden}
.card:hover{transform:translateY(-6px);box-shadow:var(--sh);border-color:var(--bronze)}
.card .ic{width:54px;height:54px;border-radius:14px;background:var(--sand);display:grid;place-items:center;color:var(--clay);font-family:var(--vintage);font-weight:700;font-size:1.2rem;margin-bottom:16px}
.card h3{font-size:1.4rem;margin-bottom:.4rem}
.card ul{list-style:none;margin-top:10px}
.card li{padding:7px 0 7px 26px;position:relative;border-bottom:1px solid var(--line)}
.card li:last-child{border-bottom:none}
.card li::before{content:"✦";position:absolute;left:0;color:var(--gold);font-size:.8rem}

/* split */
.split{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.split .ph img{border-radius:var(--r);box-shadow:var(--sh)}
.split h2{font-size:clamp(2rem,4vw,2.8rem);margin:.5rem 0 1rem}

/* checklist */
.checklist{list-style:none;display:grid;gap:12px;margin-top:8px}
.checklist li{padding-left:34px;position:relative;font-size:1.1rem}
.checklist li::before{content:"✓";position:absolute;left:0;top:0;width:22px;height:22px;border-radius:50%;background:rgba(45,161,148,.16);color:var(--teal-deep);display:grid;place-items:center;font-size:.8rem;font-weight:700}

/* steps */
.steps-band{background:radial-gradient(110% 120% at 50% -10%,#3c2a18,#241910 60%,#1b120a);color:#efe2cf}
.steps-band .kw{color:var(--gold)}.steps-band .kw::before{background:var(--gold)}
.steps-band h2{color:#fff}
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;margin-top:46px}
.steps.s3{grid-template-columns:repeat(3,1fr)}
.step .pin{width:62px;height:62px;border-radius:50%;background:#1b120a;border:2px solid var(--gold);display:grid;place-items:center;color:var(--gold-b);font-family:var(--vintage);font-weight:700;font-size:1.2rem;margin-bottom:16px}
.step h3{color:#fff;font-size:1.3rem;margin-bottom:.3rem}
.step p{color:#cdb89c;font-size:1.02rem}

/* faq */
.faq{max-width:820px;margin:36px auto 0}
.qa{border-bottom:1px solid var(--line)}
.qa button{width:100%;text-align:left;background:none;border:none;cursor:pointer;font-family:var(--disp);font-weight:600;font-size:1.32rem;color:var(--ink);padding:22px 40px 22px 0;position:relative}
.qa button::after{content:"+";position:absolute;right:6px;top:50%;transform:translateY(-50%);color:var(--clay);font-size:1.6rem;transition:.2s}
.qa.open button::after{content:"–"}
.qa .ans{max-height:0;overflow:hidden;transition:max-height .35s ease}
.qa .ans p{padding:0 0 22px;font-size:1.12rem}

/* pricing */
.pricegroups{display:grid;grid-template-columns:repeat(2,1fr);gap:30px;margin-top:46px}
.pricecard{background:#fff;border:1px solid var(--line);border-radius:var(--r);padding:32px;box-shadow:var(--sh)}
.pricecard h3{font-size:1.6rem;margin-bottom:14px;color:var(--clay)}
.pricecard .row{display:flex;justify-content:space-between;gap:16px;padding:11px 0;border-bottom:1px dashed var(--line);align-items:baseline}
.pricecard .row:last-child{border-bottom:none}
.pricecard .row .n{font-size:1.08rem}
.pricecard .row .p{font-family:var(--vintage);font-weight:600;color:var(--ink);white-space:nowrap}
.pricenote{text-align:center;color:var(--muted);margin-top:28px;font-size:1rem}

/* contact */
.contactgrid{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:start}
.cinfo .row{display:flex;gap:16px;padding:18px 0;border-bottom:1px solid var(--line)}
.cinfo .row .ic{width:46px;height:46px;border-radius:50%;background:var(--sand);display:grid;place-items:center;color:var(--clay);flex:none;font-size:1.1rem}
.cinfo .row b{font-family:var(--disp);font-size:1.3rem;color:var(--ink);display:block}
.cinfo .soc{display:flex;gap:12px;margin-top:22px}
.cinfo .soc a{width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center}
.cinfo .soc a:hover{background:var(--clay)}
.mapwrap{border-radius:var(--r);overflow:hidden;box-shadow:var(--sh);border:1px solid var(--line)}
.mapwrap iframe{width:100%;height:340px;border:0;display:block}

/* form */
.formwrap{max-width:760px;margin:0 auto;background:#fff;border:1px solid var(--line);border-radius:var(--r);padding:40px;box-shadow:var(--sh)}
fieldset{border:none;margin-bottom:26px}
fieldset legend{font-family:var(--disp);font-weight:600;font-size:1.5rem;color:var(--ink);margin-bottom:14px;padding-bottom:8px;border-bottom:2px solid var(--gold);width:100%}
.field{margin-bottom:16px}
.field.row2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
label{display:block;font-family:var(--sans);font-weight:600;color:var(--ink);margin-bottom:6px;font-size:1rem}
input,select,textarea{width:100%;font-family:var(--sans);font-size:1.05rem;padding:12px 14px;border:1px solid var(--line);border-radius:10px;background:var(--paper);color:var(--ink)}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--clay);box-shadow:0 0 0 3px rgba(122,82,48,.12)}
.field .note{font-size:.9rem;color:var(--muted);margin-top:4px}
.checkrow{display:flex;gap:10px;align-items:flex-start}
.checkrow input{width:auto;margin-top:5px}
.securenote{background:var(--sand);border-radius:12px;padding:16px 18px;font-size:1rem;color:var(--clay);display:flex;gap:12px;align-items:flex-start}

/* cta */
.cta{background:linear-gradient(135deg,var(--clay),var(--bronze-d) 55%,#3c2a18);color:#fff;text-align:center;position:relative;overflow:hidden}
.cta::before{content:"";position:absolute;inset:0;background:var(--grain);background-size:160px;opacity:.5;mix-blend-mode:overlay}
.cta .wrap{position:relative;z-index:2}
.cta h2{color:#fff;font-size:clamp(2.2rem,5vw,3.4rem);max-width:18ch;margin:0 auto 1.2rem}

/* footer */
footer{background:#1b120a;color:#bda787;padding:74px 0 30px}
footer .cols{display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:46px}
footer img{height:52px;margin-bottom:20px}
footer h4{font-family:var(--vintage);color:#fff;font-size:.92rem;letter-spacing:.08em;text-transform:uppercase;margin-bottom:16px}
footer a:hover{color:var(--gold-b)}
footer p{margin-bottom:6px}
footer .soc{display:flex;gap:12px;margin-top:16px}
footer .soc a{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.08);display:grid;place-items:center;color:#fff}
footer .soc a:hover{background:var(--clay)}
.fb{border-top:1px solid rgba(255,255,255,.12);margin-top:44px;padding-top:22px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:.9rem;color:#8c7a61}

/* modal */
.modal{position:fixed;inset:0;background:rgba(27,18,10,.66);display:none;place-items:center;z-index:120;padding:20px}
.modal.open{display:grid}
.modal .box{background:#fff;border-radius:var(--r);max-width:460px;width:100%;padding:38px;text-align:center;box-shadow:var(--sh)}
.modal .box .ic{width:64px;height:64px;border-radius:50%;background:rgba(45,161,148,.16);color:var(--teal-deep);display:grid;place-items:center;margin:0 auto 18px;font-size:1.6rem}
.modal .box h3{font-size:1.7rem;margin-bottom:8px}
.modal .box p{margin-bottom:20px}

.badge{position:fixed;left:14px;bottom:14px;z-index:80;background:#241910;color:#f3e8d6;border:1px solid var(--clay);box-shadow:var(--sh);font-size:.72rem;padding:8px 14px;border-radius:100px;font-weight:700;font-family:var(--sans)}

@media(max-width:920px){
  .links{display:none}.burger{display:block}
  .nav img{height:42px}.nav .bookbtn{margin-left:auto;white-space:nowrap}
  .links{position:absolute;top:100%;left:0;right:0;flex-direction:column;align-items:stretch;gap:0;background:rgba(253,249,241,.98);border-bottom:1px solid var(--line);box-shadow:var(--sh);padding:8px 0}
  header.nav-open .links{display:flex}
  .links>a,.subtoggle{padding:15px 28px;font-size:1.1rem;border-bottom:1px solid var(--line);width:100%;justify-content:space-between}
  .navitem.has-sub{display:block}
  .submenu{position:static;display:none;box-shadow:none;border:none;border-radius:0;padding:0;background:var(--sand);min-width:0}
  .submenu a{padding:13px 40px;border-bottom:1px solid var(--line);white-space:normal}
  .cards,.cards.two,.split,.steps,.steps.s3,.pricegroups,.contactgrid,footer .cols{grid-template-columns:1fr}
  .split .ph{order:-1}.field.row2{grid-template-columns:1fr}
  section{padding:64px 0}
}
@media(max-width:560px){.wrap,.narrow{padding:0 22px}.formwrap{padding:26px}}
`;

const RIDGE = `<svg class="ridge" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,80 L0,46 C220,20 360,60 560,40 C760,20 900,58 1120,40 C1280,28 1380,50 1440,42 L1440,80 Z" fill="#fdf9f1"/></svg>`;

function header(){
  const sub = `<div class="navitem has-sub"><button class="subtoggle" onclick="toggleSub(this)">Treatments <span class="caret">▾</span></button><div class="submenu"><a class="all" href="${H}/#treatments">All Treatments</a>${TREATMENTS.map(t=>`<a href="${H}/${t.slug}/">${esc(t.name)}</a>`).join('')}</div></div>`;
  return `<header><div class="wrap nav">
    <a href="${H}/"><img src="${A}/logo/Optimal-Joy-Logo.svg" alt="OptimalJoy Wellness & Aesthetics"></a>
    <nav class="links">${sub}<a href="${H}/about/">Meet Traci</a><a href="${H}/#process">How It Works</a><a href="${H}/contact/">Contact</a></nav>
    <a class="btn bookbtn" href="${BOOK}" target="_blank" rel="noopener">Book Appointment</a>
    <button class="burger" aria-label="Menu" onclick="toggleNav(this)">&#9776;</button>
  </div></header>`;
}
function footer(){
  const links = TREATMENTS.slice(0,5).map(t=>`<p><a href="${H}/${t.slug}/">${esc(t.name)}</a></p>`).join('');
  return `<footer><div class="wrap">
    <div class="cols">
      <div><img src="${A}/logo/Optimal-Joy-Logo-WHITE.svg" alt="OptimalJoy"><p>Our practice is dedicated to enhancing your natural beauty and promoting overall wellness through personalized, expert care in a welcoming and supportive environment.</p>
        <div class="soc">${SOCIAL.map(s=>`<a href="${s.u}" target="_blank" rel="noopener" title="${s.p}">${s.p[0]}</a>`).join('')}</div></div>
      <div><h4>Treatments</h4>${links}<p><a href="${H}/pricing/">Pricing</a></p></div>
      <div><h4>Contact</h4><p><strong>${CONTACT.phone}</strong> (${CONTACT.phoneNote})</p><p><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></p><p>${CONTACT.street}<br>${CONTACT.city}, ${CONTACT.state} ${CONTACT.zip}</p><p>${CONTACT.hours}</p></div>
    </div>
    <div class="fb"><div>&copy; 2026 OptimalJoy Wellness &amp; Aesthetics · <a href="${H}/privacy-policy/">Privacy Policy</a> · <a href="${H}/terms-and-conditions/">Terms &amp; Conditions</a></div><div>Maryville, TN</div></div>
  </div></footer>`;
}
const MODAL = `<div class="modal" id="modal"><div class="box"><div class="ic">✓</div><h3 id="mTitle">Thank you!</h3><p id="mBody"></p><button class="btn" onclick="document.getElementById('modal').classList.remove('open')">Close</button></div></div>`;
const SCRIPTS = `<script>
function toggleNav(b){const h=document.querySelector('header');const o=h.classList.toggle('nav-open');if(b)b.innerHTML=o?'✕':'☰';}
function closeNav(){const h=document.querySelector('header');if(h)h.classList.remove('nav-open');const b=document.querySelector('.burger');if(b)b.innerHTML='☰';document.querySelectorAll('.navitem.open').forEach(n=>n.classList.remove('open'));}
function toggleSub(b){b.closest('.navitem').classList.toggle('open');}
function toggleQA(b){const qa=b.closest('.qa');const a=qa.querySelector('.ans');const open=qa.classList.toggle('open');a.style.maxHeight=open?a.scrollHeight+'px':'0';}
function popup(t,b){document.getElementById('mTitle').textContent=t;document.getElementById('mBody').textContent=b;document.getElementById('modal').classList.add('open');}
function formDemo(e){e.preventDefault();popup('Request received','This is a design preview — in production this form connects securely to the OptimalJoy patient system. No data was submitted.');return false;}
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',closeNav));
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
});
</script>`;

/* ---------------- section renderers ---------------- */
function banner(p){
  return `<section class="banner"><div class="wrap"><div class="inner reveal">
    <div class="crumb"><a href="${H}/">Home</a> &nbsp;/&nbsp; ${p.crumb?esc(p.crumb)+' &nbsp;/&nbsp; ':''}${esc(p.title)}</div>
    <span class="kw c">${esc(p.eyebrow||'OptimalJoy Wellness & Aesthetics')}</span>
    <h1>${esc(p.title)}</h1>
    ${p.tagline?`<p>${esc(p.tagline)}</p>`:''}
    <a class="btn" href="${BOOK}" target="_blank" rel="noopener">Book Appointment</a>
  </div></div>${RIDGE}</section>`;
}
const R = {
  prose:s=>`<section${s.bg?` style="background:${s.bg}"`:''}><div class="wrap"><div class="prose ${s.center?'center':''} reveal">${s.eyebrow?`<span class="kw ${s.center?'c':''}">${esc(s.eyebrow)}</span>`:''}${s.heading?`<h2 style="margin-top:.5rem">${esc(s.heading)}</h2>`:''}${(s.body||[]).map((b,i)=>`<p class="${i===0&&s.lead?'lead':''}">${b}</p>`).join('')}</div></div></section>`,
  cards:s=>`<section${s.bg?` style="background:${s.bg}"`:''}><div class="wrap">${s.heading?`<div class="prose center reveal"><span class="kw c">${esc(s.eyebrow||'')}</span><h2 style="margin-top:.5rem">${esc(s.heading)}</h2></div>`:''}<div class="cards ${s.cols===2?'two':''} reveal">${s.items.map(c=>`<div class="card">${c.icon?`<div class="ic">${c.icon}</div>`:''}<h3>${esc(c.title)}</h3>${c.body?`<p>${esc(c.body)}</p>`:''}${c.list?`<ul>${c.list.map(li=>`<li>${esc(li)}</li>`).join('')}</ul>`:''}</div>`).join('')}</div></div></section>`,
  split:s=>`<section${s.bg?` style="background:${s.bg}"`:''}><div class="wrap split">${s.side==='left'?`<div class="ph reveal"><img src="${s.img}" alt="${esc(s.heading)}"></div>`:''}<div class="reveal"><span class="kw">${esc(s.eyebrow||'')}</span><h2>${esc(s.heading)}</h2>${(s.body||[]).map(b=>`<p style="margin-bottom:1rem">${b}</p>`).join('')}${s.bullets?`<ul class="checklist">${s.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}</ul>`:''}${s.cta?`<a class="btn out" style="margin-top:1.4rem" href="${s.cta.href}"${s.cta.ext?' target="_blank" rel="noopener"':''}>${esc(s.cta.label)}</a>`:''}</div>${s.side!=='left'?`<div class="ph reveal"><img src="${s.img}" alt="${esc(s.heading)}"></div>`:''}</div></section>`,
  steps:s=>`<section class="steps-band"><div class="wrap reveal"><div class="prose center" style="max-width:680px"><span class="kw c">${esc(s.eyebrow||'The Process')}</span><h2 style="margin-top:.5rem">${esc(s.heading)}</h2>${s.intro?`<p style="color:#cdb89c">${esc(s.intro)}</p>`:''}</div><div class="steps ${s.items.length===3?'s3':''}">${s.items.map((st,i)=>`<div class="step"><div class="pin">${String(i+1).padStart(2,'0')}</div><h3>${esc(st.title)}</h3><p>${esc(st.body)}</p></div>`).join('')}</div></div></section>`,
  faq:s=>`<section${s.bg?` style="background:${s.bg}"`:''}><div class="wrap"><div class="prose center reveal"><span class="kw c">FAQ</span><h2 style="margin-top:.5rem">${esc(s.heading||'Frequently Asked Questions')}</h2></div><div class="faq reveal">${s.items.map(q=>`<div class="qa"><button onclick="toggleQA(this)">${esc(q.q)}</button><div class="ans"><p>${esc(q.a)}</p></div></div>`).join('')}</div></div></section>`,
  pricing:s=>`<section><div class="wrap"><div class="prose center reveal"><span class="kw c">${esc(s.eyebrow||'Investment')}</span><h2 style="margin-top:.5rem">${esc(s.heading)}</h2></div><div class="pricegroups reveal">${s.groups.map(g=>`<div class="pricecard"><h3>${esc(g.name)}</h3>${g.items.map(it=>`<div class="row"><span class="n">${esc(it.n)}${it.note?`<br><small style="color:var(--muted)">${esc(it.note)}</small>`:''}</span><span class="p">${esc(it.p)}</span></div>`).join('')}</div>`).join('')}</div>${s.note?`<p class="pricenote">${esc(s.note)}</p>`:''}</div></section>`,
  contact:s=>`<section><div class="wrap contactgrid"><div class="cinfo reveal"><span class="kw">Get In Touch</span><h2 style="font-size:2.2rem;margin:.4rem 0 1rem">We'd love to hear from you</h2>
    <div class="row"><div class="ic">✆</div><div><b>${CONTACT.phone}</b><span style="color:var(--muted)">${CONTACT.phoneNote}</span></div></div>
    <div class="row"><div class="ic">✉</div><div><b><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></b></div></div>
    <div class="row"><div class="ic">⌖</div><div><b>${CONTACT.street}</b><span style="color:var(--muted)">${CONTACT.city}, ${CONTACT.state} ${CONTACT.zip}</span></div></div>
    <div class="row"><div class="ic">◷</div><div><b>${CONTACT.hours}</b></div></div>
    <div class="soc">${SOCIAL.map(x=>`<a href="${x.u}" target="_blank" rel="noopener" title="${x.p}">${x.p[0]}</a>`).join('')}</div>
    <a class="btn" style="margin-top:24px" href="${BOOK}" target="_blank" rel="noopener">Book an Appointment</a>
  </div><div class="mapwrap reveal"><iframe loading="lazy" title="OptimalJoy location" src="https://www.google.com/maps?q=921%20Foch%20St%2C%20Maryville%2C%20TN%2037801&output=embed"></iframe></div></div></section>`,
  form:s=>`<section><div class="narrow"><div class="prose center reveal" style="margin-bottom:30px">${s.intro?`<p class="lead">${esc(s.intro)}</p>`:''}</div><form class="formwrap reveal" onsubmit="return formDemo(event)">${s.fieldsets.map(fs=>`<fieldset><legend>${esc(fs.legend)}</legend>${fs.fields.map(f=>field(f)).join('')}${fs.note?`<div class="securenote"><span>🔒</span><span>${esc(fs.note)}</span></div>`:''}</fieldset>`).join('')}<button class="btn teal" type="submit" style="width:100%;justify-content:center">${esc(s.submit||'Submit Request')}</button></form></div></section>`,
  cta:s=>`<section class="cta"><div class="wrap"><span class="kw c">${esc(s.eyebrow||'Begin Your Journey')}</span><h2 style="margin-top:.7rem">${esc(s.heading)}</h2><a class="btn" href="${BOOK}" target="_blank" rel="noopener">${esc(s.button||'Book Appointment')}</a></div></section>`,
  html:s=>`<section${s.bg?` style="background:${s.bg}"`:''}><div class="wrap reveal">${s.content}</div></section>`,
};
function field(f){
  if(f.type==='checkbox') return `<div class="field"><div class="checkrow"><input type="checkbox" id="${f.id||''}" ${f.required?'required':''}><label for="${f.id||''}" style="margin:0">${esc(f.label)}</label></div>${f.note?`<div class="note">${esc(f.note)}</div>`:''}</div>`;
  if(f.type==='textarea') return `<div class="field"><label>${esc(f.label)}</label><textarea rows="4" placeholder="${esc(f.ph||'')}" ${f.required?'required':''}></textarea></div>`;
  if(f.type==='select') return `<div class="field"><label>${esc(f.label)}</label><select ${f.required?'required':''}><option value="" disabled selected>Select…</option>${f.options.map(o=>`<option>${esc(o)}</option>`).join('')}</select></div>`;
  const inp = t=>`<input type="${t}" placeholder="${esc(f.ph||'')}" ${f.required?'required':''}>`;
  if(f.row) return `<div class="field row2"><div><label>${esc(f.label)}</label>${inp(f.type||'text')}</div><div><label>${esc(f.label2)}</label>${inp(f.type2||'text')}</div></div>`;
  return `<div class="field"><label>${esc(f.label)}</label>${inp(f.type||'text')}${f.note?`<div class="note">${esc(f.note)}</div>`:''}</div>`;
}

function pageDoc(p){
  const body = banner(p) + p.sections.map(s=>R[s.type](s)).join('') + (p.noCta?'':R.cta({heading:p.ctaHeading||'Take Your Beauty To The Next Level'})) + footer() + MODAL;
  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(p.title)} · OptimalJoy Wellness & Aesthetics</title>
<meta name="description" content="${esc(p.meta||p.tagline||p.title)}"/>
<link rel="icon" href="${A}/logo/Optimal-Joy-Logo.svg"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet"/>
<style>${CSS}</style></head><body>
${header()}
${body}
<a class="badge" href="${H}/">Summit · OptimalJoy</a>
${SCRIPTS}
</body></html>`;
}

/* ================= PAGE CONTENT ================= */
const provider = "Treatment led by Traci Carnette, MSN, FNP-C — a Board-Certified Family Nurse Practitioner with 14+ years of clinical experience.";
const PAGES = [];

/* ---- Treatments ---- */
PAGES.push({ slug:"hormone-replacement-therapy", title:"Hormone Replacement Therapy", crumb:"Treatments",
  eyebrow:"Men & Women", tagline:provider, img:`${A}/images/treatment-hrt.jpg`,
  sections:[
    {type:"prose",center:true,lead:true,heading:"Restore balance, vitality & well-being",body:["At OptimalJoy Wellness & Aesthetics, we proudly care for both men and women seeking hormone replacement therapy (HRT) to restore balance, vitality, and overall well-being.","Our personalized approach ensures each individual receives treatment tailored to their unique needs — whether it's addressing hormone imbalances, improving energy levels, enhancing mental clarity, or supporting weight management."]},
    {type:"cards",cols:2,heading:"Men's HRT",eyebrow:"For Him",items:[
      {title:"Symptoms We Address",list:["Reduced libido","Fatigue & low energy","Increased body fat","Decreased muscle mass & strength","Mood changes","Erectile dysfunction"]},
      {title:"Benefits",list:["Increased energy, less fatigue","Improved mood & less irritability","Supports muscle growth & strength","Boosts libido & sexual health","Sharper mental clarity & focus"]},
    ]},
    {type:"split",side:"left",img:`${A}/images/treatment-hrt.jpg`,eyebrow:"Men's HRT · What's Included",heading:"Starting at $250/month",body:["A $199 consultation fee applies to begin care."],bullets:["Testosterone injections or compounded cream (up to 200mg)","Quarterly telehealth or in-person follow-ups","Routine blood work monitoring via insurance or LabCorp"],cta:{label:"Book a Consultation",href:BOOK,ext:true}},
    {type:"cards",cols:2,heading:"Women's HRT",eyebrow:"For Her",bg:"var(--linen)",items:[
      {title:"Symptoms We Address",list:["Hot flashes & night sweats","Mood swings & irritability","Weight gain","Low libido & sexual dysfunction","Vaginal dryness & discomfort","Brain fog & memory issues"]},
      {title:"Benefits",list:["Relief from menopausal symptoms","Improved bone health","Enhanced mood & mental clarity","Increased energy & vitality","Support for sexual health"]},
    ]},
    {type:"split",side:"right",img:`${A}/images/practitioner-traci.jpg`,eyebrow:"Women's HRT · What's Included",heading:"Starting at $275/month",body:["A $199 consultation fee applies to begin care."],bullets:["Up to three hormone prescriptions (Progesterone, Testosterone, Estradiol)","Quarterly telehealth or in-person follow-ups","Regular blood work monitoring"],cta:{label:"Book a Consultation",href:BOOK,ext:true}},
    {type:"faq",heading:"Hormone Therapy FAQs",items:[
      {q:"What are the benefits of testosterone replacement therapy (TRT)?",a:"TRT can improve energy levels, muscle mass, mood, mental clarity, and libido while reducing symptoms like fatigue, irritability, and weight gain."},
      {q:"How is testosterone replacement therapy administered?",a:"Testosterone can be delivered through injections, topical creams, or patches. Your provider will recommend the best option based on your needs and preferences."},
      {q:"Are there any risks or side effects associated with TRT?",a:"While TRT is generally safe when monitored by a provider, possible side effects include acne, fluid retention, or changes in red blood cell count."},
      {q:"What symptoms can HRT help alleviate in women?",a:"HRT can relieve menopausal symptoms such as hot flashes, night sweats, mood swings, fatigue, and vaginal dryness, while also supporting bone health and energy levels."},
      {q:"How long does it take to see results from HRT?",a:"Many women start noticing improvements within a few weeks, though it may take a few months for full benefits to develop."},
      {q:"Is HRT safe for all women?",a:"HRT is safe for most women, but it may not be suitable for those with certain health conditions, such as a history of hormone-sensitive cancers or blood clotting disorders."},
    ]},
  ]});

PAGES.push({ slug:"prescription-weight-loss", title:"Medical Weight Loss", crumb:"Treatments",
  eyebrow:"GLP-1 Guided", tagline:provider,
  sections:[
    {type:"prose",center:true,lead:true,heading:"Lose weight without the hunger",body:["Our prescription weight loss program offers a comprehensive approach using medications that target your brain's appetite centers to reduce cravings and promote satiety.","On average, participants see 1–3 lbs of weight loss per week while the program helps reset your metabolic set point — boosting metabolism, reducing inflammation, and increasing energy."]},
    {type:"cards",heading:"What You'll Experience",items:[
      {title:"Eliminate Cravings",icon:"✦",body:"Regulates hunger hormones and slows gastric emptying so you feel full and satisfied."},
      {title:"Manage Weight",icon:"◆",body:"Improved fat utilization and a boosted metabolism for steady, sustainable results."},
      {title:"Improve Health",icon:"❋",body:"Reduced inflammation, higher energy, and improved athletic performance & recovery."},
    ]},
    {type:"pricing",heading:"Two Treatment Options",eyebrow:"Simple, Transparent",groups:[
      {name:"GLP-1",items:[{n:"Consultation",p:"$75",note:"Credited toward your first vial"},{n:"First vial",p:"$350"}]},
      {name:"GIP & GLP-1",items:[{n:"Consultation",p:"$75",note:"Credited toward your first vial"},{n:"First vial",p:"$550"}]},
    ],note:"Every program includes a customized plan, medication & supplies delivered, weekly text check-ins, direct provider access, and virtual follow-ups — with no hidden fees, contracts, or obligations."},
    {type:"faq",heading:"Weight Loss FAQs",items:[
      {q:"How quickly can I expect results?",a:"Results vary, but on average participants may start seeing weight loss of 1–3 pounds per week."},
      {q:"Will I feel hungry?",a:"The program minimizes hunger by slowing gastric emptying and regulating your hunger hormones."},
      {q:"Is it suitable for everyone?",a:"An initial consultation is required to assess your health history and current medications before starting."},
      {q:"Are there benefits beyond weight loss?",a:"Yes — participants often experience a boosted metabolism, reduced inflammation, increased energy, fewer cravings, and enhanced athletic performance."},
    ]},
  ]});

PAGES.push({ slug:"dermal-fillers-lips", title:"Dermal Fillers / Lips", crumb:"Treatments",
  eyebrow:"Facial Aesthetics", tagline:"Unlock a youthful, vibrant look with our comprehensive dermal filler and lip augmentation services.",
  sections:[
    {type:"prose",center:true,lead:true,heading:"Shape, define & enhance — naturally",body:["Restore volume, define your facial contours, and enhance your natural beauty through artistic precision. "+provider,"Our dermal filler and lip augmentation services are designed to embrace your natural features — never overdone."]},
    {type:"cards",heading:"What Fillers Can Do",items:[
      {title:"Dermal Fillers",icon:"✦",list:["Restore volume & define contours","Sculpt a youthful appearance","Soften lines & folds"]},
      {title:"Lip Augmentation",icon:"◆",list:["Fuller, plumper, balanced lips","Improved facial symmetry","Natural-looking results"]},
      {title:"The Benefits",icon:"❋",list:["Enhanced appearance & symmetry","Boosted confidence","Long-lasting (6–18 months)","Minimal downtime"]},
    ]},
    {type:"steps",heading:"Recovery & Aftercare",eyebrow:"What to Expect",intro:"Most clients return to normal activities quickly. A simple aftercare routine keeps results looking their best.",items:[
      {title:"Soothe",body:"Apply cold compresses in 10–15 minute intervals to reduce swelling."},
      {title:"Rest",body:"Avoid strenuous exercise and heat for 24–48 hours; keep lips moisturized."},
      {title:"Be Gentle",body:"Avoid makeup for 24 hours and extremely hot foods or beverages."},
      {title:"Reveal",body:"A follow-up checks your progress; full results appear within 1–2 weeks."},
    ]},
    {type:"faq",heading:"Filler FAQs",items:[
      {q:"What can I expect from lip augmentation at OptimalJoy?",a:"We enhance your lips' natural shape and volume for a fuller, more symmetrical look using safe, effective techniques with artistic precision."},
      {q:"What is the typical recovery process?",a:"Recovery is generally quick, with some swelling or redness initially that resolves over a few days."},
      {q:"What benefits can I expect from lip fillers?",a:"Volume enhancement, shape definition, improved symmetry, non-permanent results, minimal downtime, and a confidence boost."},
      {q:"How does OptimalJoy ensure natural-looking results?",a:"Through artful, tailored treatments that respect and highlight your natural features using the latest techniques."},
    ]},
  ]});

PAGES.push({ slug:"medical-grade-chemical-peel", title:"Medical Grade Chemical Peel", crumb:"Treatments",
  eyebrow:"Skin Rejuvenation", tagline:provider,
  sections:[
    {type:"prose",center:true,lead:true,heading:"Reveal brighter, healthier skin",body:["Our medical-grade chemical peels are specially formulated with glutathione — a powerful antioxidant that penetrates deep skin layers to combat oxidative damage and prevent premature aging.","Customized to your skin, each peel rejuvenates from the cellular level for a smoother, more radiant complexion."]},
    {type:"cards",cols:2,heading:"The Benefits",items:[
      {title:"Youthful Radiance",icon:"✦",body:"Diminish fine lines and wrinkles for smoother, fresher-looking skin."},
      {title:"Clear, Bright Complexion",icon:"◆",body:"Reduce the look of scars, hyperpigmentation, and sun damage."},
      {title:"Healthier Skin",icon:"❋",body:"Fight oxidative stress for a more resilient, vibrant complexion."},
      {title:"Fully Customized",icon:"✧",body:"Tailored to your skin type and concerns, with minimal downtime."},
    ]},
    {type:"steps",heading:"What to Expect",eyebrow:"The Process",items:[
      {title:"Consultation",body:"A personalized assessment of your skincare goals."},
      {title:"Customization",body:"Peel strength tailored to your skin type and concerns."},
      {title:"Application",body:"A gentle peel removes the outer, dulled skin layers."},
      {title:"Reveal",body:"Visible improvements in texture and tone after a series of treatments."},
    ]},
    {type:"faq",heading:"Chemical Peel FAQs",items:[
      {q:"How do medical-grade peels differ from over-the-counter options?",a:"Higher concentrations of active ingredients like glutathione offer deeper exfoliation and more significant, longer-lasting results under professional supervision."},
      {q:"How often can I get a peel?",a:"Typically, peels can be safely done every 4–6 weeks. We'll design a personalized plan at your consultation."},
      {q:"Are peels suitable for all skin types?",a:"Yes — our peels are customizable to suit various skin types and concerns."},
      {q:"What is the recovery time?",a:"It varies by intensity. Light peels may have minimal to no downtime, while deeper peels may require a few days; redness, sensitivity, and peeling are common and temporary."},
    ]},
  ]});

PAGES.push({ slug:"microneedling-with-rf", title:"Microneedling with RF", crumb:"Treatments",
  eyebrow:"Radio Frequency", tagline:provider,
  sections:[
    {type:"prose",center:true,lead:true,heading:"Collagen renewal, deeper than ever",body:["Microneedling with RF combines microneedling's collagen-inducing power with radiofrequency energy for deep tissue remodeling.","This minimally invasive treatment targets deeper skin layers to refine texture, reduce the signs of aging, and restore a youthful, glowing complexion."]},
    {type:"cards",heading:"The Benefits",items:[
      {title:"Texture & Firmness",icon:"✦",body:"Stimulates collagen for smoother, firmer-looking skin."},
      {title:"Fewer Lines & Pores",icon:"◆",body:"Softens fine lines and wrinkles while minimizing pores and scars."},
      {title:"Tone & Elasticity",icon:"❋",body:"Combats sagging and uneven texture — safe for all skin types."},
    ]},
    {type:"steps",heading:"What to Expect",eyebrow:"The Journey",intro:"A comfortable treatment with minimal downtime and beautiful, building results.",items:[
      {title:"Comfort",body:"Topical numbing keeps the treatment relatively comfortable — most feel only mild discomfort."},
      {title:"Treatment",body:"Fine needles plus RF energy remodel the deeper layers of skin."},
      {title:"Recover",body:"Redness like a mild sunburn subsides within days; resume normal activity within 24 hours."},
      {title:"Glow",body:"Immediate improvement, with the most significant results at 4–6 weeks."},
    ]},
    {type:"faq",heading:"Microneedling FAQs",items:[
      {q:"Is it painful?",a:"Most clients experience mild discomfort at most, with numbing cream applied beforehand."},
      {q:"How long until I see results?",a:"The most significant results typically emerge 4 to 6 weeks after treatment."},
      {q:"What's the downtime?",a:"Redness and sensitivity usually subside within a few days; most resume activities within 24 hours."},
      {q:"Who's a good candidate?",a:"Anyone targeting fine lines, laxity, scars, or texture, across all skin types. Those with active infections, certain skin conditions, or who are pregnant should consult their provider first."},
    ]},
  ]});

PAGES.push({ slug:"liquid-lipo", title:"Liquid Lipo", crumb:"Treatments",
  eyebrow:"Non-Surgical Contouring", tagline:"Sculpt your ideal shape — without surgery or extended recovery.",
  sections:[
    {type:"prose",center:true,lead:true,heading:"Dissolve fat, define your shape",body:["Liquid Lipo injects a specially formulated solution into targeted fat areas, breaking down fat cells that your body then naturally eliminates — for a more sculpted appearance without surgery. "+provider]},
    {type:"cards",cols:2,heading:"Why Liquid Lipo",items:[
      {title:"Non-Surgical Contouring",icon:"✦",body:"Achieve a slimmer silhouette without the risks and downtime of surgery."},
      {title:"Targeted Fat Reduction",icon:"◆",body:"Precisely addresses stubborn fat that resists diet and exercise."},
      {title:"Minimal Downtime",icon:"❋",body:"Most clients experience little to no downtime."},
      {title:"Visible, Lasting Results",icon:"✧",body:"Noticeable reductions in fat and improved body contours."},
    ]},
    {type:"split",side:"left",img:`${A}/images/treatment-liquid-lipo.jpg`,eyebrow:"Treatment Details",heading:"Quick, comfortable sessions",body:["Sessions last 30–60 minutes depending on the area. The number of sessions varies based on your goals."],bullets:["Treatable areas: abdomen, thighs, buttocks, arms & chin","Results visible within weeks","Optimal results after 1–3 months"],cta:{label:"Book a Consultation",href:BOOK,ext:true}},
    {type:"faq",heading:"Liquid Lipo FAQs",items:[
      {q:"How many sessions will I need?",a:"It varies based on your goals and treatment area. We'll map out a personalized plan at your consultation."},
      {q:"When will I see results?",a:"Many clients see results within a few weeks, with optimal results developing over 1–3 months."},
      {q:"Is there downtime?",a:"Most clients experience little to no downtime and return to normal activities quickly."},
    ]},
  ]});

PAGES.push({ slug:"neurotoxin-treatment", title:"Neurotoxin Treatment", crumb:"Treatments",
  eyebrow:"Xeomin", tagline:provider,
  sections:[
    {type:"prose",center:true,lead:true,heading:"Smooth lines, keep your expressions",body:["Xeomin is a highly purified neurotoxin that temporarily relaxes facial muscles to soften fine lines and wrinkles. Formulated without accessory proteins, it may reduce the chance of resistance for lasting results.","Smooth frown lines, crow's feet, and forehead lines while preserving your natural expressions."]},
    {type:"cards",heading:"Why Xeomin",items:[
      {title:"Natural Results",icon:"✦",body:"Soften lines while keeping your expressions your own."},
      {title:"Quick & Easy",icon:"◆",body:"Often completed within 10–15 minutes, with no downtime."},
      {title:"Lasting Effect",icon:"❋",body:"A refreshed, youthful look for up to 3–4 months."},
    ]},
    {type:"steps",heading:"What to Expect",eyebrow:"The Process",items:[
      {title:"Consultation",body:"A comprehensive assessment of your facial structure and goals."},
      {title:"The Procedure",body:"Fine-needle injections, typically about 15 minutes."},
      {title:"Aftercare",body:"No downtime — simply avoid strenuous activity the same day."},
      {title:"Results",body:"Visible within days, with full results in about two weeks."},
    ]},
    {type:"faq",heading:"Neurotoxin FAQs",items:[
      {q:"What is Xeomin and how does it work?",a:"Xeomin contains botulinum toxin type A, which blocks the nerve signals to targeted muscles, causing them to relax and softening the lines above them."},
      {q:"How long does treatment take?",a:"Typically about 10 to 20 minutes."},
      {q:"When will I see results and how long do they last?",a:"Visible smoothing can appear as early as 3–4 days, with full effect within about 30 days, lasting up to 3–4 months."},
      {q:"Who is a candidate, and what are the side effects?",a:"Suitable for most adults seeking wrinkle reduction. Common side effects include localized pain, swelling, and minimal bruising."},
    ]},
  ]});

/* ---- About ---- */
PAGES.push({ slug:"about", title:"About OptimalJoy", crumb:null, eyebrow:"Meet Your Practitioner",
  tagline:"Dedicated to enhancing your natural beauty and promoting overall wellness through personalized, expert care.",
  sections:[
    {type:"split",side:"left",img:`${A}/images/practitioner-traci.jpg`,eyebrow:"Founder & Lead Practitioner",heading:"Traci Carnette, MSN, FNP-C",body:["Traci is a Board-Certified Family Nurse Practitioner who brings a rich, multifaceted healthcare background to OptimalJoy. She earned her Master's in Nursing from Western Governors University in 2019 and her FNP credentials in 2023.","With 14 years of nursing experience across emergency care (adult and pediatric), labor & delivery, psychiatry, teaching, and school nursing, Traci integrates deep clinical knowledge with a genuine passion for helping clients look and feel their best."],bullets:["Board-Certified Family Nurse Practitioner","14+ years of diverse clinical expertise","Personalized, holistic treatment plans","Uncompromising safety & client satisfaction"],cta:{label:"Book With Traci",href:BOOK,ext:true}},
    {type:"prose",center:true,bg:"var(--linen)",eyebrow:"Our Philosophy",heading:"Care that uplifts every client",body:["At OptimalJoy, we break away from the cycle of costly and ineffective health and beauty treatments. Our mission is to provide safe, effective solutions in weight loss, facial aesthetics, and overall health — all designed to help you uncover and embrace your most beautiful self.","We believe wellness and aesthetics go hand in hand, and that everyone deserves expert care delivered in a welcoming, supportive environment."]},
    {type:"cards",heading:"What Sets Us Apart",items:[
      {title:"Affordable Care",icon:"✦",body:"Effective, accessible treatments so beauty and health are within reach for everyone."},
      {title:"Expert Hands",icon:"◆",body:"Years of clinical experience behind every personalized treatment plan."},
      {title:"Real Results",icon:"❋",body:"Services that go beyond expectations — visible, lasting, and deeply appreciated."},
    ]},
  ]});

/* ---- Contact ---- */
PAGES.push({ slug:"contact", title:"Contact Us", crumb:null, eyebrow:"We're Here For You",
  tagline:"Questions, bookings, or just saying hello — reach out and our team will be glad to help.",
  sections:[ {type:"contact"} ], ctaHeading:"Ready to begin? Let's talk." });

/* ---- Pricing ---- */
PAGES.push({ slug:"pricing", title:"Our Pricing", crumb:null, eyebrow:"Transparent Investment",
  tagline:"Honest, upfront pricing for every service. Memberships and financing available.",
  sections:[
    {type:"pricing",heading:"Treatments & Services",groups:[
      {name:"Hormone Replacement Therapy",items:[{n:"Women — starting at",p:"$275/mo"},{n:"Men — starting at",p:"$250/mo"},{n:"Consultation fee",p:"$199"}]},
      {name:"Medical Weight Loss",items:[{n:"GLP-1 — first vial",p:"$350"},{n:"GIP & GLP-1 — first vial",p:"$550"},{n:"Consultation (credited)",p:"$75"}]},
      {name:"Facial Treatments",items:[{n:"Medical Grade Chemical Peel",p:"$300"},{n:"Microneedling RF — Face",p:"$400"},{n:"Microneedling RF — Face/Neck",p:"$500"},{n:"Microneedling RF — Face/Neck/Chest",p:"$600"}]},
      {name:"Dermal Fillers",items:[{n:"Full Lip Augmentation (1 syringe)",p:"from $700"},{n:"Filler Treatment",p:"from $700"},{n:"Facial Balancing (3–4 syringes)",p:"from $2,500"},{n:"Lip Dissolving",p:"$350"},{n:"Radiesse Skin Rejuvenation",p:"from $750"}]},
      {name:"Injectables & Tox",items:[{n:"Lip Flip",p:"$150"},{n:"Xeomin",p:"$11/unit"},{n:"Daxxify",p:"$7.50/unit"},{n:"Liquid Lipo",p:"from $600"}]},
      {name:"Vitamin Boosts",items:[{n:"Vitamin Boost Injections (10 weeks)",p:"$200"},{n:"Shot Bar — single",p:"$30"},{n:"Shot Bar — 4 shots",p:"$100"}]},
    ],note:"Prices are starting points and may vary based on your personalized treatment plan. Flexible monthly payments are available through our Cherry Payment Plan."},
  ]});

/* ---- FAQs (compiled from real treatment FAQs) ---- */
PAGES.push({ slug:"faqs", title:"Frequently Asked Questions", crumb:null, eyebrow:"How Can We Help?",
  tagline:"Answers to the questions we hear most. Don't see yours? Reach out any time.",
  sections:[
    {type:"faq",heading:"General",items:[
      {q:"How do I book an appointment?",a:"Use the Book Appointment button anywhere on the site to schedule securely through our online booking system, or text us at (865) 855-5441."},
      {q:"Where are you located?",a:"We're at 921 Foch St, Maryville, TN 37801. Visits are by appointment only."},
      {q:"Do you offer financing?",a:"Yes — we offer flexible monthly payments through our Cherry Payment Plan. Approval is quick and there's no hard credit check to check your options."},
    ]},
    {type:"faq",heading:"Hormone Therapy",bg:"var(--linen)",items:[
      {q:"How long does it take to see results from HRT?",a:"Many clients notice improvements within a few weeks, though it may take a few months for full benefits to develop."},
      {q:"Is HRT safe for everyone?",a:"HRT is safe for most people, but it may not be suitable for those with certain conditions such as a history of hormone-sensitive cancers or blood clotting disorders. Your provider will review your history."},
    ]},
    {type:"faq",heading:"Weight Loss",items:[
      {q:"How quickly can I expect results?",a:"On average, participants may start seeing weight loss of 1–3 pounds per week."},
      {q:"Will I feel hungry?",a:"The program minimizes hunger by slowing gastric emptying and regulating your hunger hormones."},
    ]},
    {type:"faq",heading:"Aesthetics",bg:"var(--linen)",items:[
      {q:"How long do fillers last?",a:"Most dermal fillers last 6–18 months depending on the product and area treated."},
      {q:"Is microneedling with RF painful?",a:"Most clients feel only mild discomfort thanks to topical numbing applied beforehand."},
      {q:"How long does neurotoxin (Xeomin) last?",a:"Results typically last up to 3–4 months."},
    ]},
  ]});

/* ---- Blogs ---- */
PAGES.push({ slug:"blogs", title:"Stories & Insights", crumb:null, eyebrow:"The OptimalJoy Journal",
  tagline:"Wellness tips, treatment guides, and behind-the-scenes from the foothills of the Smokies.",
  sections:[
    {type:"cards",heading:"Coming Soon",eyebrow:"Fresh Content",items:[
      {title:"HRT, Explained",icon:"✦",body:"A plain-English guide to hormone therapy for men and women — what to expect and who it helps."},
      {title:"Your Weight-Loss Roadmap",icon:"◆",body:"How GLP-1 programs work, week by week, and how to set yourself up for lasting success."},
      {title:"Glow Guide",icon:"❋",body:"Peels, microneedling, and tox — how to choose the right treatment for your skin goals."},
    ]},
    {type:"prose",center:true,bg:"var(--linen)",heading:"Be the first to know",body:["Our journal launches soon. In the meantime, follow us on Instagram and Facebook for tips, specials, and real client results — or reach out with a topic you'd love us to cover."]},
  ]});

/* ---- Deals & Promotions ---- */
PAGES.push({ slug:"deals-and-promotions", title:"Deals & Promotions", crumb:null, eyebrow:"Don't Miss Out",
  tagline:"Get ready for amazing deals at OptimalJoy! Our specials change constantly — grab them while they last.",
  sections:[
    {type:"cards",cols:2,heading:"Current Specials",items:[
      {title:"Buy 1, Get the 2nd 50% Off",icon:"✦",body:"On select treatments — the perfect time to try something new or stock up on a favorite."},
      {title:"Ever-Changing Exclusives",icon:"◆",body:"Members and followers get first access to limited-time offers throughout the year."},
    ]},
    {type:"prose",center:true,bg:"var(--linen)",heading:"How to claim",body:["Specials are limited and change often. Text us at (865) 855-5441 or book online and mention the offer you'd like — we'll take care of the rest.","Follow @optimaljoy.traci on Instagram so you never miss a deal."]},
  ], ctaHeading:"Seize the offer while it lasts" });

/* ---- Cherry Payment Plan ---- */
PAGES.push({ slug:"cherry-payment-plan", title:"Cherry Payment Plan", crumb:null, eyebrow:"Flexible Financing",
  tagline:"Pay over time for the treatments you love — with quick approvals and no hard credit check to get started.",
  sections:[
    {type:"prose",center:true,lead:true,heading:"Wellness now, pay monthly",body:["We've partnered with Cherry to make your treatments more affordable with simple, flexible monthly payments. Checking your options takes seconds and won't affect your credit score.","Whether it's hormone therapy, a weight-loss program, or facial aesthetics, Cherry lets you move forward today and pay over time."]},
    {type:"steps",heading:"How It Works",eyebrow:"Three Easy Steps",intro:"Getting approved is fast, paperless, and pressure-free.",items:[
      {title:"Check Your Options",body:"A quick application with no hard credit check — see what you qualify for in seconds."},
      {title:"Choose a Plan",body:"Select the monthly payment option that fits your budget."},
      {title:"Book & Enjoy",body:"Schedule your treatment and pay over time, interest options available."},
    ]},
    {type:"cards",heading:"Why Clients Love Cherry",items:[
      {title:"No Hard Credit Check",icon:"✦",body:"Checking your eligibility won't impact your credit score."},
      {title:"Fast Approvals",icon:"◆",body:"Get a decision in seconds and book the same day."},
      {title:"Flexible Terms",icon:"❋",body:"Monthly plans designed to fit your budget, with options for every treatment."},
    ]},
  ], ctaHeading:"Ready to get started with Cherry?" });

/* ---- Forms ---- */
PAGES.push({ slug:"medication-refill-form", title:"Medication Refill Form", crumb:"Patient Resources", eyebrow:"Patient Resources",
  tagline:"Provide the following information to process your refill request. Please allow two business days.",
  noCta:true,
  sections:[ {type:"form",submit:"Submit Refill Request",fieldsets:[
    {legend:"Patient Information",fields:[
      {label:"First Name",label2:"Last Name",row:true},
      {label:"Email",type:"email",required:true},
      {label:"Phone",type:"tel",required:true},
      {label:"Date of Birth",type:"date",required:true},
      {label:"Street Address"},
      {label:"City",label2:"State / ZIP",row:true},
    ]},
    {legend:"Medication",fields:[
      {label:"Medication to Refill",type:"select",required:true,options:["Tirzepatide 20 mg vial – $550","Tirzepatide 40 mg vial – $750","Tirzepatide 60 mg vial – $875","Semaglutide 5 mg – $350","Semaglutide 10 mg – $500"]},
      {label:"Last Dose Taken (units)"},
      {label:"Weight Lost So Far"},
    ]},
    {legend:"Consent",fields:[
      {type:"checkbox",id:"consent",required:true,label:"I consent to treatment with compounded medications and confirm the information provided is accurate."},
      {label:"Patient Initials"},
      {label:"Today's Date",type:"date"},
    ]},
    {legend:"Secure Payment",note:"For your security, payment details are never collected on this website. Once your refill is reviewed, you'll receive a secure payment link from the OptimalJoy patient system.",fields:[]},
  ]} ]});

PAGES.push({ slug:"hormone-replacement-therapy-interest-form", title:"HRT Interest Form", crumb:"Patient Resources", eyebrow:"Patient Resources",
  tagline:"Curious about hormone replacement therapy? Tell us a bit about yourself and we'll reach out.",
  noCta:true,
  sections:[ {type:"form",submit:"Submit Interest Form",fieldsets:[
    {legend:"About You",fields:[
      {label:"First Name",label2:"Last Name",row:true},
      {label:"Email",type:"email",required:true},
      {label:"Phone",type:"tel",required:true},
      {label:"Date of Birth",type:"date"},
      {label:"I'm interested in",type:"select",required:true,options:["Women's HRT","Men's HRT","Not sure yet — please advise"]},
    ]},
    {legend:"Your Goals",fields:[
      {label:"Symptoms you'd like to address",type:"textarea",ph:"e.g. low energy, mood changes, weight gain, low libido…"},
      {label:"Anything else we should know?",type:"textarea",ph:"Current medications, health history, questions…"},
      {type:"checkbox",id:"hrtconsent",required:true,label:"I'd like a provider to contact me about hormone therapy options."},
    ]},
  ]} ]});

PAGES.push({ slug:"current-hrt-clients-medication-refill-form", title:"Current HRT Client Refill", crumb:"Patient Resources", eyebrow:"Patient Resources",
  tagline:"Already a hormone therapy client? Request your refill here. Please allow two business days.",
  noCta:true,
  sections:[ {type:"form",submit:"Request Refill",fieldsets:[
    {legend:"Client Information",fields:[
      {label:"First Name",label2:"Last Name",row:true},
      {label:"Email",type:"email",required:true},
      {label:"Phone",type:"tel",required:true},
      {label:"Date of Birth",type:"date",required:true},
    ]},
    {legend:"Refill Details",fields:[
      {label:"Current Prescription(s)",type:"textarea",required:true,ph:"List the hormone prescription(s) you'd like refilled…"},
      {label:"Last Refill Date",type:"date"},
      {label:"Any changes to your health or medications?",type:"textarea"},
      {type:"checkbox",id:"hrtrefill",required:true,label:"I confirm the information above is accurate and request a refill."},
    ]},
    {legend:"Secure Payment",note:"Payment details are never collected on this website. You'll receive a secure payment link from the OptimalJoy patient system once your refill is reviewed.",fields:[]},
  ]} ]});

/* ---- Legal ---- */
PAGES.push({ slug:"privacy-policy", title:"Privacy Policy", crumb:null, eyebrow:"Your Privacy", noCta:true,
  tagline:"How OptimalJoy Wellness & Aesthetics collects, uses, and protects your information.",
  sections:[ {type:"html",content:legalPrivacy()} ]});
PAGES.push({ slug:"terms-and-conditions", title:"Terms & Conditions", crumb:null, eyebrow:"The Fine Print", noCta:true,
  tagline:"The terms that govern your use of this website and our services.",
  sections:[ {type:"html",content:legalTerms()} ]});

function legalBlock(items){
  return `<div class="prose" style="max-width:820px">${items.map(([h,b])=>`<h2 style="font-size:1.7rem;margin:1.6rem 0 .6rem">${h}</h2><p>${b}</p>`).join('')}<p style="margin-top:2rem;color:var(--muted)">Last updated: 2026. Questions? Contact us at <a href="mailto:${CONTACT.email}" style="color:var(--clay)">${CONTACT.email}</a> or ${CONTACT.phone} (${CONTACT.phoneNote}).</p></div>`;
}
function legalPrivacy(){return legalBlock([
  ["Overview","OptimalJoy Wellness &amp; Aesthetics (\"we,\" \"us\") respects your privacy. This policy explains what information we collect through this website and how we use it. By using this site you agree to the practices described here."],
  ["Information We Collect","We collect information you voluntarily provide — such as your name, email, phone number, and any details you submit through our forms — as well as basic technical data (like your browser type and pages visited) to help us improve the site."],
  ["How We Use Your Information","We use your information to respond to inquiries, schedule and manage appointments, process treatment and refill requests, and communicate about your care and our services. We do not sell your personal information."],
  ["Protected Health Information","Any health information you share is treated as confidential and handled in accordance with applicable healthcare privacy laws, including HIPAA where applicable. Sensitive submissions are processed through our secure patient system, not stored on this website."],
  ["Cookies & Analytics","This site may use cookies and analytics tools to understand how visitors use the site. You can disable cookies in your browser settings."],
  ["Your Choices","You may request access to, correction of, or deletion of your personal information by contacting us. You may also opt out of marketing communications at any time."],
]);}
function legalTerms(){return legalBlock([
  ["Acceptance of Terms","By accessing this website you agree to these Terms &amp; Conditions. If you do not agree, please do not use the site."],
  ["Medical Disclaimer","Content on this website is for general informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified provider regarding any medical condition. Individual results vary."],
  ["Appointments & Payments","Appointments are booked through our secure scheduling system. Pricing shown is a starting point and may vary based on your personalized treatment plan. Consultation and deposit fees, where noted, apply as described at the time of booking."],
  ["Forms & Submissions","Forms on this website are provided for your convenience. Treatment, refill, and payment processing are completed through our secure patient system. Do not submit emergency requests through this site — call 911 for medical emergencies."],
  ["Intellectual Property","All content, branding, and design on this site are the property of OptimalJoy Wellness &amp; Aesthetics and may not be reproduced without permission."],
  ["Limitation of Liability","We strive for accuracy but make no warranties about the completeness of site content. To the fullest extent permitted by law, we are not liable for any damages arising from your use of this website."],
]);}

/* ================= generate ================= */
let count=0;
for(const p of PAGES){ writeFileSync(`./${p.slug}/index.html`, pageDoc(p)); count++; }
console.log('Generated '+count+' pages:');
console.log(PAGES.map(p=>'  /'+p.slug+'/').join('\n'));
