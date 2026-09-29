// ==UserScript==
// @name         WikiMasters - Auto ouverture de paquets
// @namespace    https://wiki-masters.com/
// @version      2.8
// @description  Ouvre les paquets dès qu'il y en a, fait défiler les cartes, clique sur Continuer, avec HUD. Le timer et le compteur continuent hors de la page Paquets, avec alerte sonore/notification et timer dans le titre de l'onglet.
// @match        https://wiki-masters.com/*
// @match        https://www.wiki-masters.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  /* ================= MODES (délai minimum entre deux clics, en ms) ================= */
  const SPEEDS = {
    normal: { label: 'Normal', open: 800, arrow: 250, cont: 600 },
    rapide: { label: 'Rapide', open: 300, arrow: 80,  cont: 200 },
  };
  const TICK_MS = 60;

  /* ================= CONFIG PERSISTANTE ================= */
  const DEFAULTS = { enabled: true, speed: 'normal', minimized: false, x: null, y: null, alert: true };
  const MIGRATE = { slow: 'normal', normal: 'normal', fast: 'rapide', turbo: 'rapide', rapide: 'rapide' };

  let cfg = { ...DEFAULTS };
  try {
    const saved = JSON.parse(localStorage.getItem('wm_cfg') || '{}');
    cfg = {
      ...DEFAULTS,
      enabled: saved.enabled ?? true,
      speed: MIGRATE[saved.speed] ?? 'normal',
      minimized: saved.minimized ?? false,
      alert: true, // toujours active
      x: saved.x ?? null,
      y: saved.y ?? null,
    };
  } catch (e) {}
  const save = () => { try { localStorage.setItem('wm_cfg', JSON.stringify(cfg)); } catch (e) {} };

  /* ================= STATS & ÉTAT ================= */
  const stats = { opened: 0, cards: 0, continues: 0 };
  const logs = [];
  let lastClick = 0;
  let status = 'Démarrage…';
  let prevAvailable = null;

  function addLog(msg) {
    const t = new Date().toLocaleTimeString('fr-FR');
    logs.unshift(`${t}  ${msg}`);
    if (logs.length > 6) logs.pop();
  }

  /* ================= SUIVI DU TIMER (fonctionne sur toutes les pages) =================
     Sur la page Paquets, on lit le vrai compteur et le vrai timer. Ailleurs, on continue
     à faire tourner le timer et on estime le nombre de paquets. Les données sont gardées
     en mémoire du navigateur, donc même un rechargement de page ne les perd pas. */
  const PK_KEY = 'wm_pk';
  let pk = { available: null, max: 10, nextAt: null, interval: null };
  try { pk = { ...pk, ...JSON.parse(localStorage.getItem(PK_KEY) || '{}') }; } catch (e) {}
  let pkSaved = JSON.stringify(pk);
  let notifiedFor = null;
  const savePk = () => {
    const j = JSON.stringify(pk);
    if (j === pkSaved) return;
    pkSaved = j;
    try { localStorage.setItem(PK_KEY, j); } catch (e) {}
  };

  function parseTimer(s) {
    const p = s.split(':').map(Number);
    return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1];
  }
  function fmtSecs(n) {
    n = Math.max(0, Math.round(n));
    const h = Math.floor(n / 3600), m = Math.floor((n % 3600) / 60), x = n % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0');
  }

  // Appelé sur la page Paquets avec les vraies valeurs affichées par le site
  function syncPacks(info) {
    if (info.available == null) return;
    pk.available = info.available;
    if (info.max != null) pk.max = info.max;
    if (info.available >= pk.max) {
      pk.nextAt = null; // stock plein : plus de timer
    } else if (info.next) {
      const secs = parseTimer(info.next);
      const at = Date.now() + secs * 1000;
      if (pk.nextAt == null || Math.abs(at - pk.nextAt) > 1500) pk.nextAt = at;
      if (secs > (pk.interval || 0)) pk.interval = secs; // durée d'un cycle, apprise en observant le timer
    }
    savePk();
  }

  // Estimation valable partout : paquets disponibles et temps restant avant le prochain
  function estimate() {
    if (pk.available == null) return null;
    const now = Date.now();
    const max = pk.max || 10;
    if (pk.nextAt == null) return { available: pk.available, remain: null };
    if (now < pk.nextAt) return { available: pk.available, remain: (pk.nextAt - now) / 1000 };
    if (!pk.interval) return { available: Math.min(max, pk.available + 1), remain: null };
    const over = (now - pk.nextAt) / 1000;
    const avail = Math.min(max, pk.available + 1 + Math.floor(over / pk.interval));
    return { available: avail, remain: avail >= max ? null : pk.interval - (over % pk.interval) };
  }

  /* ================= ALERTE (son + notification) ================= */
  let audioCtx = null;
  function getAudio() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) {}
    return audioCtx;
  }
  async function beep() {
    const ctx = getAudio();
    if (!ctx) return;
    if (ctx.state !== 'running') { try { await ctx.resume(); } catch (e) {} }
    if (ctx.state !== 'running') return; // le navigateur bloque le son tant qu'il n'y a pas eu de clic sur la page
    [[880, 0], [1320, 0.18], [880, 0.36]].forEach(([f, dt]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      const t = ctx.currentTime + dt;
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + 0.32);
    });
  }
  function notify(text) {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        const n = new Notification('WikiMasters', { body: text });
        n.onclick = () => { window.focus(); n.close(); };
      }
    } catch (e) {}
  }
  function requestNotif() {
    try { if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission(); } catch (e) {}
  }
  function alertReady(n) {
    if (!cfg.alert) return;
    beep();
    notify(n > 1 ? `${n} paquets sont prêts !` : 'Un paquet est prêt !');
  }
  // Un vrai clic sur la page débloque le son et permet de demander l'autorisation de notification
  addEventListener('click', (e) => { if (e.isTrusted && cfg.alert) { getAudio(); requestNotif(); } }, true);

  /* ================= TIMER DANS LE TITRE DE L'ONGLET ================= */
  function updateTitle(avail, remain, real) {
    const base = document.title.replace(/^\[[ ⏳][^\]]*\]\s*/u, '');
    let prefix = '';
    if (avail != null) {
      const t = remain != null ? fmtSecs(remain) : null;
      const n = avail;
      prefix = avail >= 1 ? `[ ${n}${t ? ' · ' + t : ''}] ` : `[⏳ ${t || '?'}] `;
    }
    const want = prefix + base;
    if (document.title !== want) document.title = want;
  }

  /* ================= OUTILS DOM ================= */
  const txtOf = (el) => (el.innerText || el.textContent || '').trim();

  // L'ouverture des paquets ne se fait que sur la page « Paquets »
  const onPacksPage = () => /^\/pulls(\/|$)/.test(location.pathname);

  function isVisible(el) {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
  }
  const isDisabled = (el) => el.disabled || el.getAttribute('aria-disabled') === 'true';
  const inHud = (el) => !!el.closest('#wmh-root');
  const allButtons = () => [...document.querySelectorAll('button')].filter((b) => isVisible(b) && !inHud(b));

  function realClick(el) {
    const r = el.getBoundingClientRect();
    const opts = {
      bubbles: true, cancelable: true, view: window,
      clientX: r.left + r.width / 2, clientY: r.top + r.height / 2,
    };
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach((type) => {
      const Ctor = type.startsWith('pointer') ? PointerEvent : MouseEvent;
      el.dispatchEvent(new Ctor(type, opts));
    });
  }

  function packsInfo() {
    const body = document.body.innerText;
    const m = body.match(/(\d+)\s*\/\s*(\d+)\s*paquets?\s+disponibles?/i);
    const t = body.match(/Prochain\s+dans\s+(\d+:\d+(?::\d+)?)/i);
    return { available: m ? +m[1] : null, max: m ? +m[2] : null, next: t ? t[1] : null };
  }

  /* ================= DÉTECTION ================= */
  const findOpenDialog = () => [...document.querySelectorAll('[role="dialog"]')].find(isVisible) || null;
  const findDialogClose = (d) =>
    [...d.querySelectorAll('button')].find((b) => /fermer/i.test(b.getAttribute('aria-label') || ''));

  function findOpenButton() {
    return allButtons().find((el) => {
      if (isDisabled(el)) return false;
      const img = el.querySelector('img[alt*="paquet" i]');
      return img && /ouvrir/i.test(img.alt + ' ' + txtOf(el));
    });
  }

  function findNextArrow() {
    const encore = allButtons().find((b) => /^encore\s+\d+\s+cartes?$/i.test(txtOf(b)));
    if (!encore || !encore.parentElement) return null;
    const arrows = [...encore.parentElement.querySelectorAll('button')].filter(
      (b) => isVisible(b) && !txtOf(b) && b.querySelector('svg') && /rounded-full/.test(b.className)
    );
    return arrows.length ? arrows[arrows.length - 1] : null;
  }

  const findContinueButton = () =>
    allButtons().find((b) => /^continuer$/i.test(txtOf(b)) && !isDisabled(b));

  /* ================= LOGIQUE ================= */
  function canClick(type) {
    const wait = SPEEDS[cfg.speed][type];
    const jitter = wait * 0.15 * Math.random();
    return Date.now() - lastClick >= wait + jitter;
  }

  function act(el, label) {
    lastClick = Date.now();
    realClick(el);
    addLog(label);
  }

  function tick() {
    // Hors de la page Paquets : on ne clique pas, mais le timer continue de tourner
    if (!onPacksPage()) {
      prevAvailable = null;
      const est = estimate();

      if (pk.nextAt != null && Date.now() >= pk.nextAt && notifiedFor !== pk.nextAt) {
        notifiedFor = pk.nextAt;
        addLog('🔔 Nouveau paquet prêt (estimation)');
        alertReady(est ? est.available : 1);
      }

      if (!cfg.enabled) status = '⏸ Auto-pack désactivé';
      else if (est) {
        status = `💤 Hors page Paquets · ${est.available}/${pk.max}` +
          (est.remain != null ? ` · prochain dans ${fmtSecs(est.remain)}` : '');
      } else status = '💤 Va sur la page « Paquets » (timer inconnu)';
      return;
    }

    const info = packsInfo();
    syncPacks(info);

    if (info.available != null) {
      if (prevAvailable != null && info.available > prevAvailable && !cfg.enabled) alertReady(info.available);
      if (prevAvailable === 0 && info.available > 0) {
        addLog(`🔔 Paquet dispo : ${info.available}/${info.max}`);
      }
      prevAvailable = info.available;
    }

    if (!cfg.enabled) { status = '⏸ Auto-pack désactivé'; return; }

    // Fenêtre ouverte (boutique…) -> on la ferme
    const dialog = findOpenDialog();
    if (dialog) {
      const close = findDialogClose(dialog);
      if (close && canClick('cont')) {
        act(close, '✖ Fenêtre fermée : ' + (dialog.getAttribute('aria-label') || ''));
      }
      status = '⚠ Fenêtre ouverte';
      return;
    }

    // Cartes (prioritaire, même si le compteur est à 0 après le dernier paquet)
    const arrow = findNextArrow();
    if (arrow) {
      if (!isDisabled(arrow)) {
        status = '🃏 Défilement des cartes';
        if (canClick('arrow')) { stats.cards++; act(arrow, '→ Carte suivante'); }
      } else status = '🃏 Révélation en cours…';
      return;
    }

    // Continuer
    const cont = findContinueButton();
    if (cont) {
      status = '✅ Récupération des cartes';
      if (canClick('cont')) { stats.continues++; stats.cards++; act(cont, '✔ Continuer'); } // +1 : la 5e carte n'a pas de flèche
      return;
    }

    // Aucun paquet : on attend que le compteur passe à 1 ou plus
    if (info.available === 0) {
      status = `⏳ En attente d'un paquet (0/${info.max ?? 10})`;
      return;
    }

    // Ouverture (uniquement si le compteur indique au moins 1 paquet)
    const openBtn = findOpenButton();
    if (openBtn && info.available != null && info.available >= 1) {
      status = 'Ouverture du paquet';
      if (canClick('open')) { stats.opened++; act(openBtn, 'Paquet ouvert'); }
      return;
    }

    status = '👀 En attente…';
  }

  /* ================= HUD ================= */
  const CSS = `
  #wmh-root{position:fixed;z-index:2147483647;width:240px;font:12px/1.4 system-ui,sans-serif;color:#e8ece9;
    background:rgba(14,16,15,.95);border:1px solid #2a3b33;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.55);
    backdrop-filter:blur(6px);user-select:none}
  #wmh-root *{box-sizing:border-box}
  #wmh-head{display:flex;align-items:center;gap:8px;padding:10px 12px;cursor:move}
  #wmh-dot{width:9px;height:9px;border-radius:50%;background:#8a2b2b;flex:none}
  #wmh-dot.on{background:#2fd39a;box-shadow:0 0 8px #2fd39a}
  #wmh-dot.idle{background:#d9a441;box-shadow:0 0 8px #d9a441}
  #wmh-title{font-weight:700;font-size:13px;flex:1}
  #wmh-body{padding:0 12px 12px;display:flex;flex-direction:column;gap:10px}
  .wmh-hero{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .wmh-hero div{background:#1a211e;border-radius:10px;padding:8px 6px;text-align:center}
  .wmh-hero b{display:block;font-size:22px;line-height:1.25;color:#2fd39a;font-variant-numeric:tabular-nums}
  .wmh-hero span{color:#8fa198;font-size:10px}
  .wmh-switch{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 10px;
    background:#1a211e;border-radius:10px;cursor:pointer}
  .wmh-lab b{display:block;font-size:12px}
  .wmh-lab small{color:#8fa198;font-size:10px}
  .wmh-switch input{display:none}
  .wmh-slider{position:relative;width:36px;height:20px;border-radius:20px;background:#4a3a3a;transition:background .15s;flex:none}
  .wmh-slider::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;
    background:#fff;transition:transform .15s}
  .wmh-switch input:checked + .wmh-slider{background:#2fd39a}
  .wmh-switch input:checked + .wmh-slider::after{transform:translateX(16px)}
  .wmh-cap{color:#8fa198;font-size:10px;margin-bottom:4px}
  .wmh-seg{display:flex;background:#1a211e;border-radius:10px;padding:3px;gap:3px}
  .wmh-speed{flex:1;padding:6px 0;border:0;border-radius:7px;background:transparent;color:#cfd8d3;cursor:pointer;font-size:12px}
  .wmh-speed.act{background:#2fd39a;color:#06140e;font-weight:700}
  #wmh-foot{display:flex;justify-content:space-between;color:#8fa198;font-size:11px;padding:0 2px}
  #wmh-foot b{color:#e8ece9}
  `;

  function buildHud() {
    if (document.getElementById('wmh-root')) return;

    if (!document.getElementById('wmh-style')) {
      const st = document.createElement('style');
      st.id = 'wmh-style';
      st.textContent = CSS;
      document.head.appendChild(st);
    }

    const root = document.createElement('div');
    root.id = 'wmh-root';
    root.innerHTML = `
      <div id="wmh-head">
        <span id="wmh-dot" title="Vert : actif · Orange : actif, hors page Paquets · Rouge : désactivé"></span>
        <span id="wmh-title">WikiMasters</span>
      </div>
      <div id="wmh-body">
        <div class="wmh-hero">
          <div><b id="wmh-s-avail">–</b><span>Paquets prêts</span></div>
          <div><b id="wmh-s-next">–</b><span>Prochain dans</span></div>
        </div>
        <label class="wmh-switch">
          <span class="wmh-lab"><b>Auto-ouverture</b><small>Ouvre les paquets tout seul</small></span>
          <input type="checkbox" id="wmh-o-enabled">
          <span class="wmh-slider"></span>
        </label>
        <div>
          <div class="wmh-cap">Vitesse</div>
          <div class="wmh-seg">
            ${Object.entries(SPEEDS).map(([k, v]) => `<button class="wmh-speed" data-speed="${k}">${v.label}</button>`).join('')}
          </div>
        </div>
        <div id="wmh-foot">
          <span><b id="wmh-s-open">0</b> paquets ouverts</span>
          <span><b id="wmh-s-cards">0</b> cartes</span>
        </div>
      </div>`;
    document.body.appendChild(root);

    // Position
    if (cfg.x == null || cfg.y == null) {
      root.style.right = '12px'; root.style.bottom = '12px';
    } else {
      root.style.left = Math.min(cfg.x, innerWidth - 60) + 'px';
      root.style.top = Math.min(cfg.y, innerHeight - 40) + 'px';
    }

    // Drag
    const head = root.querySelector('#wmh-head');
    head.addEventListener('mousedown', (e) => {
      const r = root.getBoundingClientRect();
      const dx = e.clientX - r.left, dy = e.clientY - r.top;
      const move = (ev) => {
        root.style.right = 'auto'; root.style.bottom = 'auto';
        root.style.left = Math.max(0, Math.min(ev.clientX - dx, innerWidth - 60)) + 'px';
        root.style.top = Math.max(0, Math.min(ev.clientY - dy, innerHeight - 40)) + 'px';
      };
      const up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        const rr = root.getBoundingClientRect();
        cfg.x = rr.left; cfg.y = rr.top; save();
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
      e.preventDefault();
    });

    // Contrôles
    const $ = (id) => root.querySelector(id);
    $('#wmh-o-enabled').onchange = (e) => { cfg.enabled = e.target.checked; save(); refreshHud(); };
    root.querySelectorAll('.wmh-speed').forEach((b) => {
      b.onclick = () => { cfg.speed = b.dataset.speed; save(); refreshHud(); };
    });
  }

  function refreshHud() {
    buildHud();
    const root = document.getElementById('wmh-root');
    if (!root) return;
    const $ = (id) => root.querySelector(id);

    const onPacks = onPacksPage();
    const active = cfg.enabled && onPacks;
    $('#wmh-dot').classList.toggle('on', active);
    $('#wmh-dot').classList.toggle('idle', cfg.enabled && !onPacks);
    $('#wmh-o-enabled').checked = cfg.enabled;

    root.querySelectorAll('.wmh-speed').forEach((b) => b.classList.toggle('act', b.dataset.speed === cfg.speed));

    $('#wmh-s-open').textContent = stats.opened;
    $('#wmh-s-cards').textContent = stats.cards;

    let tAvail = null, tRemain = null;
    if (onPacks) {
      // Valeurs réelles lues sur la page
      const info = packsInfo();
      $('#wmh-s-avail').textContent = info.available == null ? '–' : `${info.available}/${info.max}`;
      $('#wmh-s-next').textContent = info.next || '–';
      tAvail = info.available;
      tRemain = info.next ? parseTimer(info.next) : null;
    } else {
      // Estimation (non lue sur la page)
      const est = estimate();
      if (est) { tAvail = est.available; tRemain = est.remain; }
      $('#wmh-s-avail').textContent = est ? `${est.available}/${pk.max}` : '–';
      $('#wmh-s-next').textContent = est && est.remain != null ? fmtSecs(est.remain)
        : (est && est.available >= pk.max ? 'plein' : '–');
    }

    updateTitle(tAvail, tRemain, onPacks);

  }

  /* ================= LANCEMENT ================= */
  buildHud();
  setInterval(tick, TICK_MS);
  setInterval(refreshHud, 400);
  console.log('[WM-AutoPack] v2.8 chargé');
})();