// ===== Utilities =====
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Year in footer
$('#year').textContent = new Date().getFullYear();

// Smooth scroll for anchor links
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id.length>1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
      // close mobile nav after click
      nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false');
    }
  });
});

// ===== Mobile Nav =====
const toggle = $('.nav-toggle');
const nav = $('#primary-nav');
toggle.addEventListener('click', ()=>{
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

// ===== Sliders (News + Testimonials) =====
$$('.slider').forEach(slider=>{
  const track = slider.querySelector('.slides');
  const prev = slider.querySelector('.prev');
  const next = slider.querySelector('.next');

  const scrollStep = () => track.clientWidth * 0.9;
  prev?.addEventListener('click', ()=> track.scrollBy({left:-scrollStep(), behavior:'smooth'}));
  next?.addEventListener('click', ()=> track.scrollBy({left: scrollStep(), behavior:'smooth'}));

  // Basic drag to scroll
  let isDown=false, startX=0, scrollLeft=0;
  track.addEventListener('mousedown', e=>{isDown=true; startX=e.pageX; scrollLeft=track.scrollLeft;});
  ['mouseleave','mouseup'].forEach(evt=>track.addEventListener(evt, ()=>isDown=false));
  track.addEventListener('mousemove', e=>{
    if(!isDown) return;
    e.preventDefault();
    track.scrollLeft = scrollLeft - (e.pageX - startX);
  });
});

// ===== Lightbox for Gallery =====
const modal = document.querySelector('[data-modal]');
const modalBody = document.querySelector('[data-modal-body]');
const closeModal = () => { modal.setAttribute('hidden',''); modalBody.innerHTML=''; };
document.querySelector('[data-close]').addEventListener('click', closeModal);
modal.addEventListener('click', e=>{ if(e.target === modal) closeModal(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && !modal.hasAttribute('hidden')) closeModal(); });

// Open lightbox on image click
$$('[data-lightbox] img').forEach(img=>{
  img.addEventListener('click', ()=>{
    const full = document.createElement('img');
    full.src = img.src;
    full.alt = img.alt || '';
    const cap = img.dataset.caption;
    modalBody.innerHTML = '';
    modalBody.appendChild(full);
    if(cap){ const p=document.createElement('p'); p.style.color='#fff'; p.style.marginTop='8px'; p.textContent=cap; modalBody.appendChild(p); }
    modal.removeAttribute('hidden');
  });
});

// ===== Reusable Video Modal for Clubs/Sports =====
$$('[data-video]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const src = btn.dataset.video;
    const vid = document.createElement('video');
    vid.controls = true; vid.autoplay = true; vid.src = src; vid.style.background='#000';
    modalBody.innerHTML = ''; modalBody.appendChild(vid);
    modal.removeAttribute('hidden');
  });
});

// ===== Minimal Events Calendar =====
(function initCalendar(){
  const el = document.querySelector('[data-calendar]');
  if(!el) return;
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  // Configure events here – easy to edit:
  const events = {
    // 'YYYY-MM-DD': 'Description'
    [`${year}-08-24`]: 'PTA Meeting',
    [`${year}-09-06`]: 'Inter-School Athletics',
    [`${year}-09-20`]: 'Midterm Exams Begin',
  };

  // Build header
  const monthName = new Intl.DateTimeFormat('en', {month:'long'}).format(new Date(year, month, 1));
  const header = document.createElement('div');
  header.className = 'cal-header';
  header.innerHTML = `<h3>${monthName} ${year}</h3>`;
  el.appendChild(header);

  // Build grid
  const grid = document.createElement('div');
  grid.className = 'grid';
  el.appendChild(grid);

  // Weekday headers
  const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  weekdays.forEach(d=>{ const w=document.createElement('div'); w.className='wk'; w.textContent=d; grid.appendChild(w); });

  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();

  // blanks before 1st
  for(let i=0;i<startDay;i++){ const b=document.createElement('div'); b.className='day'; grid.appendChild(b); }

  const details = document.querySelector('.calendar-details');
  const showDetails = (dateKey, elDay) => {
    const msg = events[dateKey] ? `${dateKey}: ${events[dateKey]}` : `${dateKey}: No events`;
    details.textContent = msg;
    if(elDay) elDay.focus();
  };

  for(let d=1; d<=daysInMonth; d++){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'day';
    btn.textContent = d;
    btn.setAttribute('aria-label', `Day ${d}`);
    const key = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    if(events[key]) btn.classList.add('event');
    btn.addEventListener('click', ()=> showDetails(key, btn));
    grid.appendChild(btn);
  }

  // Preload today
  const keyToday = `${year}-${String(month+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  showDetails(keyToday);
})();