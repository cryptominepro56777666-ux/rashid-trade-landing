/* script.js — upgraded demo behavior (no backend, mock UX) */

const TRADERS = (function gen(){
  const styles = ['Scalping','Swing','Long-Term','AI Hybrid'];
  const countries = ['US','GB','JP','DE','IN','BR','AU','SG'];
  const risk = ['Low','Medium','High'];
  const names = ['Rashid Ali','Alex Morgan','Maria Silva','Chen Wei','Olivia Park','Mateo Ruiz','Sofia Ivanova','Liam Brown','Ava Johnson','Noah Lee','Emma Davis','Mason Clark','Isabella Luis','Ethan Garcia','Mia Patel','Lucas Schmidt','Amelia Nguyen','Logan Turner','Harper Hill','James King'];
  return names.map((n,i)=>{
    const base = 50 + i*2;
    const values = Array.from({length:30}, (_,k)=> +(base + Math.sin((k+i)/5)*8 + Math.random()*6).toFixed(2));
    return {
      id: i+1,
      name: n,
      roi: +(Math.random()*120).toFixed(2),
      profit: Math.floor(Math.random()*49000 + 50),
      avgTradeDuration: Math.floor(Math.random()*9 + 1),
      riskLevel: risk[i % risk.length],
      country: countries[i % countries.length],
      tradingStyle: styles[i % styles.length],
      description: `${n} is a ${styles[i % styles.length]} trader focusing on multi-asset strategies.`,
      chartData: values
    };
  });
})();

function $(s){return document.querySelector(s)}
function $all(s){return Array.from(document.querySelectorAll(s))}
function format(n){return n.toLocaleString()}

/* small sparkline svg */
function sparkSVG(values,w=140,h=36){
  const max = Math.max(...values), min = Math.min(...values);
  const range = max-min || 1;
  const step = w/(values.length-1);
  const pts = values.map((v,i)=>`${(i*step).toFixed(1)},${(h - ((v-min)/range)*h).toFixed(1)}`).join(' ');
  const last = values[values.length-1];
  const color = last >= values[0] ? '#16a34a' : '#f97316';
  return `<svg viewBox="0 0 ${w} ${h}" class="small-spark" xmlns="http://www.w3.org/2000/svg"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

/* INDEX: render top grid + reveal on scroll */
function renderTopGrid(){
  const container = $('#topGrid');
  if(!container) return;
  const top = TRADERS.slice(0,8);
  container.innerHTML = '';
  top.forEach(t=>{
    const el = document.createElement('div');
    el.className = 'trader-card';
    el.innerHTML = `
      <div class="trader-name">${t.name}</div>
      <div class="trader-meta">${t.tradingStyle} · ${t.country}</div>
      <div style="margin-top:10px">${sparkSVG(t.chartData,220,48)}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
        <div>
          <div style="font-weight:700">${t.roi}%</div>
          <div class="trader-meta">${format(t.profit)} profit</div>
        </div>
        <div>
          <a class="btn" href="trader.html?id=${t.id}">View</a>
        </div>
      </div>
    `;
    container.appendChild(el);
  });

  // reveal animation
  setTimeout(()=> {
    container.classList.add('show');
  }, 180);
}

/* MARKETS: render table and filters */
function renderMarkets(){
  const tbody = $('#tradersTable tbody');
  const empty = $('#emptyState');
  if(!tbody) return;

  function buildRows(list){
    tbody.innerHTML = '';
    list.forEach(t=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="trader-name">${t.name}</div>
          <div class="trader-meta">${t.tradingStyle} · ${t.country}</div>
        </td>
        <td>${t.roi}</td>
        <td>${format(t.profit)}</td>
        <td>${t.avgTradeDuration}</td>
        <td>${t.riskLevel}</td>
        <td>${sparkSVG(t.chartData)}</td>
        <td><button class="btn followBtn" data-id="${t.id}">Follow</button></td>
      `;
      tbody.appendChild(tr);
    });
    empty.hidden = list.length > 0;
  }

  const search = $('#searchInput');
  const risk = $('#filterRisk');
  const style = $('#filterStyle');
  const sort = $('#sortBy');

  function applyFilters(){
    let result = TRADERS.slice();
    const q = (search.value || '').trim().toLowerCase();
    if(q) result = result.filter(t => t.name.toLowerCase().includes(q) || t.tradingStyle.toLowerCase().includes(q));
    if(risk.value) result = result.filter(t => t.riskLevel === risk.value);
    if(style.value) result = result.filter(t => t.tradingStyle === style.value);
    if(sort.value === 'roi') result.sort((a,b)=>b.roi - a.roi);
    if(sort.value === 'profit') result.sort((a,b)=>b.profit - a.profit);
    buildRows(result);
    bindFollowButtons();
  }

  $('#resetBtn').addEventListener('click', ()=>{
    search.value=''; risk.value=''; style.value=''; sort.value='roi'; applyFilters();
  });

  [search,risk,style,sort].forEach(el => el && el.addEventListener('input', applyFilters));
  applyFilters();
}

function bindFollowButtons(){
  $all('.followBtn').forEach(btn=>{
    btn.onclick = (e)=>{
      const id = e.currentTarget.dataset.id;
      showFollowModal(id);
    };
  });
}

/* Follow modal (markets page) */
function showFollowModal(id){
  const modal = $('#followModal');
  if(!modal) return;
  modal.setAttribute('aria-hidden','false');
  const t = TRADERS.find(x=>x.id==id);
  $('#modalTitle2').textContent = 'Follow trader';
  $('#modalBody2').textContent = `You will follow ${t.name} (demo).`;
  $('#confirmFollow').onclick = ()=>{
    alert(`Now following ${t.name} (demo).`);
    closeFollow();
  };
}
function closeFollow(){
  const modal = $('#followModal'); if(!modal) return;
  modal.setAttribute('aria-hidden','true');
  $('#confirmFollow').onclick = null;
}

/* Trader details page */
function renderTraderDetails(){
  const detail = $('#traderDetail'); if(!detail) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || '1';
  const t = TRADERS.find(x=>x.id==id) || TRADERS[0];
  detail.innerHTML = `
    <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:12px">
          <div>
            <div style="font-weight:800;font-size:20px">${t.name}</div>
            <div class="trader-meta">${t.tradingStyle} · ${t.country}</div>
          </div>
          <div style="margin-left:auto;text-align:right">
            <div style="font-weight:800;font-size:20px">${t.roi}%</div>
            <div class="trader-meta">${format(t.profit)} profit</div>
          </div>
        </div>
        <div style="margin-top:12px">${bigLineSVG(t.chartData,760,160)}</div>
      </div>
      <div style="min-width:220px;max-width:280px">
        <div class="card" style="margin-bottom:12px">
          <strong>Win Rate</strong><div class="trader-meta">${Math.floor(50 + Math.random()*40)}%</div>
        </div>
        <div class="card" style="margin-bottom:12px">
          <strong>Avg Trade</strong><div class="trader-meta">${t.avgTradeDuration} days</div>
        </div>
        <div class="card" style="margin-bottom:12px">
          <strong>Risk</strong><div class="trader-meta">${t.riskLevel}</div>
        </div>
        <div style="text-align:right"><button class="btn" onclick="openLogin()">FOLLOW</button></div>
      </div>
    </div>

    <div style="margin-top:14px">
      <h3>About</h3>
      <p class="trader-meta">${t.description}</p>
    </div>
  `;
}

/* Basic big line svg for trader detail */
function bigLineSVG(values,w=760,h=160){
  const max = Math.max(...values), min = Math.min(...values);
  const range = max - min || 1;
  const step = w/(values.length-1);
  const pts = values.map((v,i)=>`${(i*step).toFixed(1)},${(h - ((v-min)/range)*h).toFixed(1)}`).join(' ');
  const last = values[values.length-1];
  const color = last >= values[0] ? '#16a34a' : '#f97316';
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

/* Dashboard: fake transactions */
function populateDashboard(){
  if(!document.body.dataset.page || !document.body.dataset.page.includes('dashboard')) {
    // also check pathname
    if(!location.pathname.includes('dashboard')) return;
  }
  const txBody = $('#txTable tbody');
  if(!txBody) return;
  txBody.innerHTML = '';
  for(let i=0;i<6;i++){
    const time = new Date(Date.now() - i*3600*1000).toLocaleString();
    const sym = ['BTC/USDT','ETH/USDT','EUR/USD'][i%3];
    const size = (Math.random()*1.5+0.01).toFixed(2);
    const pl = (Math.random()*200-100).toFixed(2);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${time}</td><td>${sym}</td><td>${size}</td><td>${pl}</td>`;
    txBody.appendChild(tr);
  }
  // mock balances
  $('#walletBalance') && ($('#walletBalance').textContent = '$' + (Math.random()*400).toFixed(2));
  $('#totalProfit') && ($('#totalProfit').textContent = '$' + (Math.random()*2500).toFixed(2));
}

/* Login behavior (fake) */
function openLogin(){ $('#loginModal').setAttribute('aria-hidden','false'); }
function closeLogin(){ $('#loginModal').setAttribute('aria-hidden','true'); }
function doGoogle(){ alert('Google login (demo)'); localStorage.setItem('demoUser','google'); window.location='dashboard.html'; }
function doLogin(){
  const email = $('#emailField').value || 'user@demo';
  localStorage.setItem('demoUser', email);
  window.location='dashboard.html';
}
function doLogout(){
  localStorage.removeItem('demoUser');
  window.location='index.html';
}

/* Deposit page: copy wallet and open external link */
function copyWallet(){
  const el = $('#walletAddress');
  if(!el) return;
  const addr = el.textContent.trim();
  navigator.clipboard.writeText(addr).then(()=> alert('Address copied to clipboard!'));
}
function setDepositLink(url){
  const a = $('#openExternal');
  if(a && url) a.href = url;
}

/* boot */
function boot(){
  // set years
  ['#year','#year2','#year3','#year4'].forEach(id=>{
    const e = document.querySelector(id); if(e) e.textContent = new Date().getFullYear();
  });

  // attach login buttons
  $all('#loginBtn,#loginBtn2,#loginBtn3').forEach(b=>b && (b.onclick=openLogin));
  $('#logoutBtn') && ($('#logoutBtn').onclick = doLogout);

  // per-page actions
  renderTopGrid();
  renderMarkets();
  renderTraderDetails();
  populateDashboard();

  // set deposit link placeholder; replace with your TRC20 link later
  setDepositLink('https://t.me/'); // placeholder

  // close follow modal click handlers
  document.addEventListener('click', function(e){
    const followModal = $('#followModal'); if(!followModal) return;
    if(followModal.getAttribute('aria-hidden')==='false' && !followModal.querySelector('.modal-panel').contains(e.target) && !e.target.classList.contains('followBtn')) closeFollow();
  });
}

document.addEventListener('DOMContentLoaded', boot);
