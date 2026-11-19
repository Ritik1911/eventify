/* ===== EVENTIFY – shared script (vanilla JS) =====
   FLASK NOTE: EVENTS below is sample data. Replace with Jinja loops / a JSON endpoint.
   The navbar/footer are injected here; move them into templates/base.html when integrating. */
const EVENTS=[
{id:1,title:"Full-Stack Web Development with Flask",cat:"Workshop",date:"2026-12-06",time:"10:00 AM",venue:"Seminar Hall A",price:499,seats:18,img:"flask-workshop.svg",featured:1,desc:"A hands-on day building a database-backed web app with Python, Flask and Jinja2 templates."},
{id:2,title:"CodeStorm 24-Hour Hackathon",cat:"Hackathon",date:"2026-12-12",time:"09:00 AM",venue:"Innovation Lab",price:299,seats:64,img:"hackathon.svg",featured:1,desc:"Form a team of four, pick a problem statement and ship a working prototype in 24 hours."},
{id:3,title:"AI & Machine Learning Seminar",cat:"Seminar",date:"2026-12-09",time:"11:00 AM",venue:"Main Auditorium",price:0,seats:140,img:"ai-seminar.svg",featured:1,desc:"Industry speakers explain how machine learning is used in products students use every day."},
{id:4,title:"UI/UX Design Sprint",cat:"Workshop",date:"2026-12-15",time:"10:30 AM",venue:"Design Studio, Block C",price:399,seats:9,img:"design-sprint.svg",desc:"Go from user research to a clickable Figma prototype in a single guided sprint."},
{id:5,title:"Cybersecurity CTF Challenge",cat:"Competition",date:"2026-12-18",time:"02:00 PM",venue:"Computer Lab 3",price:199,seats:35,img:"ctf.svg",desc:"Solve web, crypto and forensics puzzles in a jeopardy-style capture-the-flag contest."},
{id:6,title:"Cloud Computing with AWS",cat:"Workshop",date:"2026-12-20",time:"10:00 AM",venue:"Seminar Hall B",price:599,seats:27,img:"cloud.svg",desc:"Deploy a web application using EC2, S3 and IAM, with free-tier accounts set up on the day."},
{id:7,title:"Startup Pitch Day",cat:"Competition",date:"2027-01-08",time:"01:00 PM",venue:"Incubation Centre",price:149,seats:52,img:"pitch.svg",desc:"Pitch your idea to a panel of founders and investors for a chance at seed mentorship."},
{id:8,title:"Python for Data Analysis",cat:"Workshop",date:"2027-01-10",time:"10:00 AM",venue:"Computer Lab 1",price:349,seats:41,img:"python.svg",desc:"Clean, explore and chart real datasets using pandas and Matplotlib."},
{id:9,title:"Placement Prep Career Talk",cat:"Seminar",date:"2027-01-15",time:"03:00 PM",venue:"Main Auditorium",price:0,seats:5,img:"career.svg",desc:"Recruiters share what they look for in résumés, coding rounds and interviews."}];
const CATS=["Workshop","Hackathon","Seminar","Competition"];
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const money=p=>p?`₹${p}`:"Free";
const fmtDate=d=>new Date(d+"T00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});

/* ---------- notifications ---------- */
function toast(msg,type="info"){let box=$("#toasts");if(!box){box=document.createElement("div");box.id="toasts";box.setAttribute("aria-live","polite");document.body.append(box)}
const t=document.createElement("div");t.className="toast "+type;t.textContent=msg;box.append(t);setTimeout(()=>t.remove(),4200)}

/* ---------- layout (navbar + footer) ---------- */
function buildLayout(){
const page=location.pathname.split("/").pop()||"index.html";
const links=[["index.html","Home"],["events.html","Events"],["about.html","About"],["contact.html","Contact"]];
const nav=$("#site-header");if(nav)nav.outerHTML=`<header class="nav"><div class="container"><a class="logo" href="index.html"><i>E</i>Eventify</a>
<button class="burger" aria-label="Toggle menu" aria-expanded="false">☰</button>
<nav class="nav-links" aria-label="Main">${links.map(([h,t])=>`<a href="${h}" class="${h===page?"active":""}">${t}</a>`).join("")}<a href="login.html" class="${page==="login.html"?"active":""}">Login</a><a href="register.html" class="btn btn-primary btn-sm">Sign Up</a></nav></div></header>`;
const f=$("#site-footer");if(f)f.outerHTML=`<footer class="footer"><div class="container"><div class="foot-grid">
<div><a class="logo" href="index.html"><i>E</i>Eventify</a><p style="margin-top:14px;max-width:300px">Discover workshops, seminars, hackathons and competitions at your college.</p></div>
<div><h4>Explore</h4><ul>${links.map(([h,t])=>`<li><a href="${h}">${t}</a></li>`).join("")}</ul></div>
<div><h4>Account</h4><ul><li><a href="login.html">Login</a></li><li><a href="register.html">Register</a></li><li><a href="payment.html">Payment</a></li></ul></div>
<div><h4>Contact</h4><p>support@eventify.example<br>Vadodara, Gujarat, India</p></div></div>
<p class="copy">© 2026 Eventify · B.Tech Semester 5 PBL Project</p></div></footer>`;
const b=$(".burger"),n=$(".nav-links");b?.addEventListener("click",()=>{const o=n.classList.toggle("open");b.setAttribute("aria-expanded",o)});
$$(".nav-links a").forEach(a=>a.addEventListener("click",()=>n.classList.remove("open")))}

/* ---------- event cards ---------- */
function cardHTML(e){const low=e.seats<=10;return `<article class="glass event-card" data-id="${e.id}"><img src="assets/images/${e.img}" alt="${e.title}" loading="lazy">
<div class="card-body"><span class="badge">${e.cat}</span><h3>${e.title}</h3><p>${e.desc}</p>
<ul class="meta"><li>📅 ${fmtDate(e.date)}, ${e.time}</li><li>📍 ${e.venue}</li></ul>
<div class="card-foot"><span class="price">${money(e.price)}</span><span class="seats ${low?"low":""}">${low?"Only ":""}${e.seats} seats left</span></div>
<div class="actions"><button class="btn btn-ghost btn-sm" data-details="${e.id}">View Details</button><a class="btn btn-primary btn-sm" href="payment.html?event=${e.id}">Book Now</a></div></div></article>`}
function renderEvents(box,list){box.innerHTML=list.length?list.map(cardHTML).join(""):`<p class="empty">No events match your search. Try a different keyword or category.</p>`}
function initDetails(){let dlg=$("#event-dialog");if(!dlg){dlg=document.createElement("dialog");dlg.id="event-dialog";document.body.append(dlg)}
document.addEventListener("click",ev=>{const b=ev.target.closest("[data-details]");if(!b)return;const e=EVENTS.find(x=>x.id==b.dataset.details);
dlg.innerHTML=`<img src="assets/images/${e.img}" alt=""><div class="modal-body"><span class="badge">${e.cat}</span><h2>${e.title}</h2><p>${e.desc}</p>
<ul class="meta"><li>📅 ${fmtDate(e.date)}, ${e.time}</li><li>📍 ${e.venue}</li><li>🎟️ ${money(e.price)} · ${e.seats} seats left</li></ul>
<div class="actions"><button class="btn btn-ghost" onclick="this.closest('dialog').close()">Close</button><a class="btn btn-primary" href="payment.html?event=${e.id}">Book Now</a></div></div>`;dlg.showModal()});
dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()})}
function initHomeEvents(){const f=$("#featured-events"),u=$("#upcoming-events");
if(f)renderEvents(f,EVENTS.filter(e=>e.featured));
if(u)renderEvents(u,[...EVENTS].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4));
const c=$("#category-tiles");if(c)c.innerHTML=CATS.map(k=>`<a class="glass cat-tile" href="events.html?cat=${k}"><b>${k}s</b><span>${EVENTS.filter(e=>e.cat===k).length} events</span></a>`).join("")}
function initEventsPage(){const box=$("#events-list");if(!box)return;const q=$("#search"),chips=$("#chips");
chips.innerHTML=["All",...CATS].map(c=>`<button class="chip" data-cat="${c}">${c}</button>`).join("");
let cat=new URLSearchParams(location.search).get("cat");if(!CATS.includes(cat))cat="All";
const apply=()=>{const t=q.value.trim().toLowerCase();$$(".chip").forEach(c=>c.classList.toggle("active",c.dataset.cat===cat));
const list=EVENTS.filter(e=>(cat==="All"||e.cat===cat)&&(e.title+e.desc+e.venue+e.cat).toLowerCase().includes(t));renderEvents(box,list);$("#result-count").textContent=`${list.length} event${list.length===1?"":"s"} found`};
chips.addEventListener("click",e=>{const b=e.target.closest(".chip");if(b){cat=b.dataset.cat;apply()}});q.addEventListener("input",apply);apply()}

/* ---------- forms ---------- */
const RULES={email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)||"Enter a valid email address.",
mobile:v=>/^[6-9]\d{9}$/.test(v)||"Enter a 10-digit Indian mobile number.",
password:v=>v.length>=8||"Use at least 8 characters."};
function validateField(el){const f=el.closest(".field");let m=true;const v=el.value.trim();
if(el.required&&!v)m="This field is required.";else if(v&&RULES[el.dataset.rule])m=RULES[el.dataset.rule](v);
if(m===true&&el.dataset.match&&el.value!==$("#"+el.dataset.match).value)m="Passwords do not match.";
if(!f)return m===true;f.classList.toggle("invalid",m!==true);let e=$(".err",f);if(!e){e=document.createElement("small");e.className="err";f.append(e)}e.textContent=m===true?"":m;return m===true}
function initForms(){$$("form[data-validate]").forEach(form=>{form.noValidate=true;
$$("input:not([type=checkbox]),select,textarea",form).forEach(el=>el.addEventListener("blur",()=>validateField(el)));
form.addEventListener("submit",e=>{let ok=$$("input:not([type=checkbox]),select,textarea",form).map(validateField).every(Boolean);
const t=$("[name=terms]",form);if(t&&!t.checked){ok=false;toast("Please accept the Terms and Conditions.","error")}
if(!ok){e.preventDefault();toast("Please fix the highlighted fields.","error");return}
/* Static mode: no backend yet. Remove data-static from <body> when Flask handles the POST. */
if(document.body.dataset.static!==undefined){e.preventDefault();toast("Form is valid. Backend not connected yet, so nothing was saved.")}})});
$$("[data-toggle-pw]").forEach(b=>b.addEventListener("click",()=>{const i=$("#"+b.dataset.togglePw);const s=i.type==="password";i.type=s?"text":"password";b.textContent=s?"Hide":"Show"}));
$$("[data-soon]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();toast(a.dataset.soon)}))}

/* ---------- payment ---------- */
const FEE=19,GST=.18;
function initPayment(){const box=$("#pay-event");if(!box)return;
const id=new URLSearchParams(location.search).get("event");let e=EVENTS.find(x=>x.id==id);
if(!e){e=EVENTS[0];toast("No event selected, showing a sample booking.")}
const fee=e.price?FEE:0,gst=+(fee*GST).toFixed(2),total=+(e.price+fee+gst).toFixed(2);
box.innerHTML=`<img src="assets/images/${e.img}" alt="${e.title}"><div class="card-body"><span class="badge">${e.cat}</span><h2>${e.title}</h2>
<ul class="meta"><li>📅 ${fmtDate(e.date)}, ${e.time}</li><li>📍 ${e.venue}</li><li>🎟️ 1 ticket · ${e.seats} seats left</li></ul></div>`;
$("#rows").innerHTML=`<div><span>Ticket price</span><span>${money(e.price)}</span></div><div><span>Convenience fee</span><span>₹${fee}</span></div><div><span>GST (18% on fee)</span><span>₹${gst.toFixed(2)}</span></div><div class="total"><span>Total amount</span><span>₹${total.toFixed(2)}</span></div>`;
$("#pay-now").textContent=total?`Pay ₹${total.toFixed(2)}`:"Confirm free registration";
/* FLASK / RAZORPAY: on click, POST event id to your server, create a Razorpay test-mode order,
   then open Razorpay Checkout with the returned order_id. Verify the signature server-side. */
$("#pay-now").addEventListener("click",()=>toast("Razorpay test mode is not connected yet. No payment was made."));
const show=s=>$$(".state").forEach(x=>x.classList.toggle("on",x.dataset.state===s));
$$("[data-preview]").forEach(b=>b.addEventListener("click",()=>show(b.dataset.preview)));show("checkout")}

document.addEventListener("DOMContentLoaded",()=>{buildLayout();initHomeEvents();initEventsPage();initDetails();initForms();initPayment();
const nums=$$("[data-count]");if(nums.length&&"IntersectionObserver"in window){const io=new IntersectionObserver(en=>en.forEach(x=>{if(!x.isIntersecting)return;io.unobserve(x.target);const el=x.target,end=+el.dataset.count;let n=0;const step=()=>{n=Math.min(end,n+Math.ceil(end/40));el.textContent=n.toLocaleString("en-IN")+(el.dataset.suffix||"");if(n<end)requestAnimationFrame(step)};step()}));nums.forEach(n=>io.observe(n))}});
