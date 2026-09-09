/* ============================================================
   HSG GEKKOS HOCKEY — Main JavaScript
   ============================================================ */

/* ---- Nav scroll + mobile toggle ---- */
(function () {
  const nav    = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  if (toggle && links) {
    const closeMenu = () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    const closeBtn = links.querySelector('.nav-close');
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* Active link */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-page]').forEach(el => {
    if (el.dataset.page === page) el.classList.add('active');
  });
})();

/* ---- Scroll reveal ---- */
(function () {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
})();

/* ---- Animated counters ---- */
(function () {
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function runCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 2000;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOutCubic(progress) * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        runCounter(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => obs.observe(el));
})();

/* ---- Money Rain ---- */
const MoneyRain = window.MoneyRain = (function () {
  const SYMBOLS = ['💵', '💰', '💸', '$', '💵', '$', '💴', '💶', '🤑', '$', '💵'];
  const COLORS  = ['#f0c330', '#29b352', '#f5f5f5', '#d4a017', '#f0c330', '#1d7a3a'];

  function spawn(overlay) {
    const el  = document.createElement('div');
    el.className  = 'money-bill';
    el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

    const size     = 1.2 + Math.random() * 1.6;
    const left     = Math.random() * 96 + 2;
    const duration = 2.5 + Math.random() * 4;
    const delay    = Math.random() * 1.5;

    el.style.cssText = `
      left: ${left}%;
      font-size: ${size}rem;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      color: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
    `;

    overlay.appendChild(el);
    setTimeout(() => el.remove(), (duration + delay + 0.5) * 1000);
  }

  return {
    start(count = 60, fast = false) {
      const overlay = document.getElementById('money-rain-overlay');
      if (!overlay) return;
      const interval = fast ? 25 : 70;
      let n = 0;
      const t = setInterval(() => {
        spawn(overlay);
        if (++n >= count) clearInterval(t);
      }, interval);
    }
  };
})();

/* ---- Auto-rain on homepage ---- */
if (document.body.classList.contains('page-home')) {
  window.addEventListener('load', () => {
    setTimeout(() => MoneyRain.start(70), 600);
  });
}

/* ---- Roster (season switcher + tabs + stats) ---- */
(function () {

  /* ─── Season data ─── */
  const SEASONS = {
    '25-26': {
      label: '2025 / 26',
      players: [
        { num: 9,  av:'🦎', name:'Max Richter',   posLabel:'Left Wing / Forward',  pos:'forward', badge:'⭐ Captain',   quote:'Greed is good. Goals are better.' },
        { num:17,  av:'🏒', name:'Leon Bauer',    posLabel:'Center / Forward',     pos:'forward', badge:'©️ Alternate',  quote:'The market always wins — and so do I.' },
        { num:11,  av:'🏒', name:'Nico Graf',     posLabel:'Right Wing / Forward', pos:'forward', quote:'100% ROI on every shot attempt.' },
        { num: 7,  av:'🏒', name:'Jonas Huber',   posLabel:'Left Wing / Forward',  pos:'forward', quote:'I short sell the defense every single time.' },
        { num:23,  av:'🏒', name:'Tim Vogel',     posLabel:'Center / Forward',     pos:'forward', quote:'Hostile takeover — on ice.' },
        { num:44,  av:'🏒', name:'Fabian Koch',   posLabel:'Right Wing / Forward', pos:'forward', quote:'Diversified portfolio: goals, assists, hits.' },
        { num:19,  av:'🏒', name:'David Steger',  posLabel:'Center / Forward',     pos:'forward', quote:'Fast breaks are the best arbitrage.' },
        { num:22,  av:'🏒', name:'Lukas Frei',    posLabel:'Left Wing / Forward',  pos:'forward', quote:'I play the long game. Always.' },
        { num: 4,  av:'🛡️', name:'Simon Wolf',    posLabel:'Defenseman',           pos:'defense', badge:'©️ Alternate',  quote:'Defense is just leverage in action.' },
        { num: 8,  av:'🛡️', name:'Jan Müller',    posLabel:'Defenseman',           pos:'defense', quote:'Blue chip defender. Rock solid.' },
        { num:27,  av:'🛡️', name:'Kevin Schwarz', posLabel:'Defenseman',           pos:'defense', quote:'I control the zone like a market maker.' },
        { num:33,  av:'🛡️', name:'Elia Brunner',  posLabel:'Defenseman',           pos:'defense', quote:'First in, last out. Every shift.' },
        { num:55,  av:'🛡️', name:'Marco Keller',  posLabel:'Defenseman',           pos:'defense', quote:'Systemic risk management — from the blue line.' },
        { num:31,  av:'🥅', name:'Alex Berger',   posLabel:'Goaltender',           pos:'goalie',  badge:'Starter', quote:'I stop everything. Including happy hour.' },
        { num:37,  av:'🥅', name:'Noah Klein',    posLabel:'Goaltender',           pos:'goalie',  quote:'The last IPO before the market crashes.' },
      ],
      skaters: [
        { num: 9, name:'Max Richter',   pos:'LW', gp:22, g:18, a:20, pts:38, pog:5 },
        { num:17, name:'Leon Bauer',    pos:'C',  gp:21, g:14, a:18, pts:32, pog:3 },
        { num:11, name:'Nico Graf',     pos:'RW', gp:22, g:11, a:14, pts:25, pog:2 },
        { num: 7, name:'Jonas Huber',   pos:'LW', gp:20, g: 9, a:12, pts:21, pog:2 },
        { num:23, name:'Tim Vogel',     pos:'C',  gp:19, g: 8, a:10, pts:18, pog:1 },
        { num:44, name:'Fabian Koch',   pos:'RW', gp:20, g: 8, a: 9, pts:17, pog:1 },
        { num:19, name:'David Steger',  pos:'C',  gp:21, g: 6, a:10, pts:16, pog:2 },
        { num:22, name:'Lukas Frei',    pos:'LW', gp:18, g: 5, a: 8, pts:13, pog:1 },
        { num: 4, name:'Simon Wolf',    pos:'D',  gp:22, g: 3, a:10, pts:13, pog:2 },
        { num: 8, name:'Jan Müller',    pos:'D',  gp:22, g: 2, a: 9, pts:11, pog:1 },
        { num:27, name:'Kevin Schwarz', pos:'D',  gp:20, g: 2, a: 7, pts: 9, pog:1 },
        { num:33, name:'Elia Brunner',  pos:'D',  gp:18, g: 1, a: 6, pts: 7, pog:0 },
        { num:55, name:'Marco Keller',  pos:'D',  gp:19, g: 1, a: 4, pts: 5, pog:0 },
      ],
      goalies: [
        { num:31, name:'Alex Berger', gp:18, so:3, w:14, pog:3 },
        { num:37, name:'Noah Klein',  gp: 8, so:1, w: 6, pog:1 },
      ],
    },
    '24-25': {
      label: '2024 / 25',
      players: [
        { num: 9,  av:'🦎', name:'Julian Weber',     posLabel:'Left Wing / Forward',  pos:'forward', badge:'⭐ Captain',   quote:'The market rewards the bold. So do I.' },
        { num:17,  av:'🏒', name:'Tobias Schneider', posLabel:'Center / Forward',     pos:'forward', badge:'©️ Alternate',  quote:'I see plays three moves ahead.' },
        { num:11,  av:'🏒', name:'Manuel Bieri',     posLabel:'Right Wing / Forward', pos:'forward', quote:'Pure alpha — every shift.' },
        { num: 7,  av:'🏒', name:'Niklas Reuter',    posLabel:'Left Wing / Forward',  pos:'forward', quote:'High-velocity, high-conviction hockey.' },
        { num:23,  av:'🏒', name:'Felix Hartmann',   posLabel:'Center / Forward',     pos:'forward', quote:'Short the defense. Long on goals.' },
        { num:44,  av:'🏒', name:'Stefan Küng',      posLabel:'Right Wing / Forward', pos:'forward', quote:'Every shot is a calculated risk.' },
        { num:19,  av:'🏒', name:'Adrian Moser',     posLabel:'Center / Forward',     pos:'forward', quote:'Compounding assists since day one.' },
        { num:22,  av:'🏒', name:'Dominik Bär',      posLabel:'Left Wing / Forward',  pos:'forward', quote:'Patient capital on the forecheck.' },
        { num: 4,  av:'🛡️', name:'Lars Vogel',       posLabel:'Defenseman',           pos:'defense', badge:'©️ Alternate',  quote:'Built different. Locked different.' },
        { num: 8,  av:'🛡️', name:'Sven Amstutz',     posLabel:'Defenseman',           pos:'defense', quote:'Hedge fund in the defensive zone.' },
        { num:27,  av:'🛡️', name:'Philipp Ritter',   posLabel:'Defenseman',           pos:'defense', quote:'Risk-adjusted clearances only.' },
        { num:33,  av:'🛡️', name:'Samuel Baur',      posLabel:'Defenseman',           pos:'defense', quote:'Structural defense. No volatility.' },
        { num:55,  av:'🛡️', name:'Cedric Wirth',     posLabel:'Defenseman',           pos:'defense', quote:'Bear market on the opposition forwards.' },
        { num:31,  av:'🥅', name:'Thomas Meier',     posLabel:'Goaltender',           pos:'goalie',  badge:'Starter', quote:'Zero leakage in the portfolio.' },
        { num:37,  av:'🥅', name:'Pascal Wyss',      posLabel:'Goaltender',           pos:'goalie',  quote:'Second option. Still unbeatable.' },
      ],
      skaters: [
        { num: 9, name:'Julian Weber',     pos:'LW', gp:20, g:15, a:17, pts:32, pog:4 },
        { num:17, name:'Tobias Schneider', pos:'C',  gp:19, g:12, a:15, pts:27, pog:3 },
        { num:11, name:'Manuel Bieri',     pos:'RW', gp:20, g:10, a:12, pts:22, pog:2 },
        { num: 7, name:'Niklas Reuter',    pos:'LW', gp:18, g: 8, a:10, pts:18, pog:2 },
        { num:23, name:'Felix Hartmann',   pos:'C',  gp:17, g: 7, a: 9, pts:16, pog:1 },
        { num:44, name:'Stefan Küng',      pos:'RW', gp:18, g: 7, a: 8, pts:15, pog:1 },
        { num:19, name:'Adrian Moser',     pos:'C',  gp:19, g: 5, a: 9, pts:14, pog:1 },
        { num:22, name:'Dominik Bär',      pos:'LW', gp:16, g: 4, a: 7, pts:11, pog:1 },
        { num: 4, name:'Lars Vogel',       pos:'D',  gp:20, g: 3, a: 8, pts:11, pog:2 },
        { num: 8, name:'Sven Amstutz',     pos:'D',  gp:20, g: 2, a: 7, pts: 9, pog:1 },
        { num:27, name:'Philipp Ritter',   pos:'D',  gp:18, g: 1, a: 6, pts: 7, pog:0 },
        { num:33, name:'Samuel Baur',      pos:'D',  gp:16, g: 1, a: 4, pts: 5, pog:0 },
        { num:55, name:'Cedric Wirth',     pos:'D',  gp:17, g: 0, a: 3, pts: 3, pog:0 },
      ],
      goalies: [
        { num:31, name:'Thomas Meier', gp:16, so:2, w:12, pog:2 },
        { num:37, name:'Pascal Wyss',  gp: 7, so:1, w: 5, pog:1 },
      ],
    },
  };

  /* ─── State ─── */
  let currentSeason = '25-26';
  let currentFilter = 'all';
  let skSort = { key: 'pts', dir: -1 };
  let goSort = { key: 'w',   dir: -1 };

  /* ─── DOM refs ─── */
  const tabs        = document.querySelectorAll('.tab-btn');
  const seasonBtns  = document.querySelectorAll('.season-btn');
  const gridPanel   = document.getElementById('roster-grid-panel');
  const statsPanel  = document.getElementById('stats-panel');
  const alumniPanel = document.getElementById('alumni-panel');
  const seasonLabel = document.getElementById('season-hero-label');
  const playersGrid = document.querySelector('.players-grid');
  if (!tabs.length) return;

  /* ─── Render player cards ─── */
  function renderPlayers() {
    if (!playersGrid) return;
    const { players } = SEASONS[currentSeason];
    const toShow = currentFilter === 'all' ? players : players.filter(p => p.pos === currentFilter);
    playersGrid.innerHTML = toShow.map((p, i) => `
      <div class="player-card reveal" data-pos="${p.pos}" style="transition-delay:${i * 0.06}s;">
        <div class="player-num">#${p.num}</div>
        <div class="player-avatar">${p.av}</div>
        <div class="player-name">${p.name}</div>
        <div class="player-pos">${p.posLabel}</div>
        ${p.badge ? `<div class="player-badge">${p.badge}</div>` : ''}
        <div class="player-quote">"${p.quote}"</div>
      </div>
    `).join('');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        playersGrid.querySelectorAll('.player-card').forEach(c => c.classList.add('visible'));
      });
    });
  }

  /* ─── Stats columns ─── */
  const SK_COLS = [
    { key:'rk',  label:'RK',     sort:false },
    { key:'num', label:'#',      sort:true  },
    { key:'name',label:'Player', sort:false },
    { key:'pos', label:'Pos',    sort:false },
    { key:'gp',  label:'GP',     sort:true  },
    { key:'g',   label:'G',      sort:true  },
    { key:'a',   label:'A',      sort:true  },
    { key:'pts', label:'PTS',    sort:true  },
    { key:'pog', label:'POG',    sort:true  },
  ];
  const GO_COLS = [
    { key:'rk',  label:'RK',     sort:false },
    { key:'num', label:'#',      sort:true  },
    { key:'name',label:'Player', sort:false },
    { key:'gp',  label:'GP',     sort:true  },
    { key:'so',  label:'SO',     sort:true  },
    { key:'w',   label:'W',      sort:true  },
    { key:'pog', label:'POG',    sort:true  },
  ];

  function buildTable(rows, cols, sortState, tableId) {
    const sorted = [...rows].sort((a, b) => {
      const av = a[sortState.key] ?? 0;
      const bv = b[sortState.key] ?? 0;
      return sortState.dir * (av - bv);
    });
    let head = '<tr>';
    cols.forEach(c => {
      if (!c.sort) { head += `<th>${c.label}</th>`; return; }
      const active = sortState.key === c.key;
      const arrow  = active ? (sortState.dir === -1 ? ' ▼' : ' ▲') : '';
      head += `<th class="st-sortable${active ? ' st-active' : ''}" data-col="${c.key}">${c.label}${arrow}</th>`;
    });
    head += '</tr>';
    let body = '';
    sorted.forEach((p, i) => {
      body += '<tr>';
      cols.forEach(c => {
        if (c.key === 'rk')   { body += `<td class="st-gray">${i + 1}</td>`; return; }
        if (c.key === 'num')  { body += `<td class="st-gray">${p.num}</td>`; return; }
        if (c.key === 'name') { body += `<td class="st-name">${p.name}</td>`; return; }
        if (c.key === 'pts')  { body += `<td class="st-pts">${p[c.key]}</td>`; return; }
        body += `<td>${p[c.key] ?? 0}</td>`;
      });
      body += '</tr>';
    });
    return `<table class="stats-table" id="${tableId}"><thead>${head}</thead><tbody>${body}</tbody></table>`;
  }

  function renderStats() {
    if (!statsPanel) return;
    const { skaters, goalies } = SEASONS[currentSeason];
    statsPanel.innerHTML =
      `<p class="section-label" style="margin-bottom:0.75rem;">Skaters</p>` +
      `<div class="stats-table-wrap">${buildTable(skaters, SK_COLS, skSort, 'sk-table')}</div>` +
      `<p class="section-label" style="margin:1.75rem 0 0.75rem;">Goalies</p>` +
      `<div class="stats-table-wrap">${buildTable(goalies, GO_COLS, goSort, 'go-table')}</div>`;
    statsPanel.querySelectorAll('#sk-table .st-sortable').forEach(th => {
      th.addEventListener('click', () => {
        const k = th.dataset.col;
        skSort = { key: k, dir: skSort.key === k ? -skSort.dir : -1 };
        renderStats();
      });
    });
    statsPanel.querySelectorAll('#go-table .st-sortable').forEach(th => {
      th.addEventListener('click', () => {
        const k = th.dataset.col;
        goSort = { key: k, dir: goSort.key === k ? -goSort.dir : -1 };
        renderStats();
      });
    });
  }

  /* ─── Panel visibility ─── */
  const alumniSectionPermanent = document.getElementById('alumni-section-permanent');
  function showPanel(name) {
    if (gridPanel)   gridPanel.style.display   = name === 'grid'   ? '' : 'none';
    if (statsPanel)  statsPanel.style.display  = name === 'stats'  ? '' : 'none';
    if (alumniPanel) alumniPanel.style.display = name === 'alumni' ? '' : 'none';
    if (alumniSectionPermanent) alumniSectionPermanent.style.display = name === 'alumni' ? 'none' : '';
  }

  /* ─── Tab clicks ─── */
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      if (filter === 'stats') {
        showPanel('stats'); renderStats();
      } else if (filter === 'alumni') {
        showPanel('alumni');
      } else {
        currentFilter = filter;
        showPanel('grid');
        renderPlayers();
      }
    });
  });

  /* ─── Season clicks ─── */
  seasonBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.season === currentSeason) return;
      seasonBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSeason = btn.dataset.season;
      if (seasonLabel) seasonLabel.textContent = SEASONS[currentSeason].label + ' Season';
      const activeTab = document.querySelector('.tab-btn.active');
      const filter = activeTab ? activeTab.dataset.filter : 'all';
      if (filter === 'stats') {
        skSort = { key: 'pts', dir: -1 };
        goSort = { key: 'w',   dir: -1 };
        renderStats();
      } else if (filter !== 'alumni') {
        renderPlayers();
      }
    });
  });

  /* ─── Initial render ─── */
  renderPlayers();

})();

/* ---- Calendar filter ---- */
(function () {
  const btns = document.querySelectorAll('.cal-filter-btn');
  const rows = document.querySelectorAll('.cal-row');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      rows.forEach(row => {
        if (filter === 'all') { row.style.display = ''; return; }
        row.style.display = row.dataset.type === filter ? '' : 'none';
      });
    });
  });
})();

/* ---- Join form ---- */
(function () {
  const form    = document.getElementById('join-form');
  const success = document.getElementById('success-msg');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    MoneyRain.start(120, true);

    form.style.transition = 'opacity 0.4s';
    form.style.opacity = '0';
    setTimeout(() => {
      form.style.display = 'none';
      if (success) {
        success.style.display = 'block';
        requestAnimationFrame(() => {
          success.style.opacity = '1';
        });
      }
    }, 400);

    setTimeout(() => MoneyRain.start(80, true), 1800);
  });
})();

/* ---- Stagger reveal for grids ---- */
(function () {
  const grids = document.querySelectorAll('.trophies-grid, .news-grid');
  grids.forEach(grid => {
    const children = Array.from(grid.children);
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.06}s`;
      child.classList.add('reveal');
    });
  });

  /* re-observe after delay assignment */
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.trophies-grid .reveal, .news-grid .reveal').forEach(el => obs.observe(el));
})();
