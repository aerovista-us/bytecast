(function () {
  'use strict';

  let data = null;
  let noncoderData = null;
  let summitCoursesData = null;
  const views = ['home', 'onboarding', 'bytecasts', 'summit', 'divisions', 'sales', 'delivery', 'intake', 'pricing', 'bundles', 'onepager'];

  const state = {
    divisionFilter: '',
    expandedDivisions: new Set(),
    searchIndex: [],
    searchResults: [],
    searchCursor: -1,
    qaChecked: loadQaState(),
    onboardingChecks: loadOnboardingChecks(),
    bytecastsDone: loadBytecastDone(),
    summitDone: loadSummitDone(),
    summitCriteriaProgress: loadSummitCriteriaProgress(),
    summitLevelFilter: loadSummitLevelFilter(),
    summitSort: loadSummitSort(),
    lastRoute: loadLastRoute(),
    lastRouteAt: loadLastRouteAt(),
    toastTimer: null,
  };

  function $(id) { return document.getElementById(id); }
  function qs(sel, el) { return (el || document).querySelector(sel); }
  function qsAll(sel, el) { return Array.from((el || document).querySelectorAll(sel)); }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s == null ? '' : String(s);
    return div.innerHTML;
  }

  function showToast(message) {
    const toast = $('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    if (state.toastTimer) window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 1700);
  }

  function showView(name, opts) {
    const options = opts || {};
    const hash = name === 'home' ? '' : name;
    const targetHash = hash ? '#' + hash : '#';
    if (!options.skipHash && window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    if (name !== 'home') saveLastRoute(name);
    views.forEach(function (v) {
      const el = $('view-' + v);
      if (el) el.classList.toggle('view--hidden', v !== name);
    });
    qsAll('[data-route]').forEach(function (a) {
      a.setAttribute('aria-current', a.getAttribute('data-route') === name ? 'true' : 'false');
    });
    if (name === 'home') renderHome();
  }

  function getRouteFromHash() {
    const h = (window.location.hash || '').replace(/^#/, '');
    if (h.startsWith('offer-')) return { view: 'divisions', offerId: h.replace('offer-', '') };
    if (views.indexOf(h) >= 0) return { view: h, offerId: null };
    return { view: 'home', offerId: null };
  }

  function applyRoute() {
    const route = getRouteFromHash();
    showView(route.view, { skipHash: true });
    const detailEl = $('offer-detail');
    if (route.view === 'divisions' && route.offerId) {
      showOfferDetail(route.offerId);
    } else if (detailEl) {
      detailEl.classList.add('offer-detail--hidden');
    }
  }

  window.addEventListener('hashchange', applyRoute);

  function getRouteLabel(route) {
    const labels = {
      home: 'Home',
      onboarding: 'Non-Coder Onboarding',
      bytecasts: 'Non-Coder ByteCasts',
      summit: 'Summit Courses',
      divisions: 'Divisions & Offers',
      sales: 'Sales Playbook',
      delivery: 'Delivery',
      intake: 'Intake',
      pricing: 'Pricing',
      bundles: 'Bundles',
      onepager: 'One-pager'
    };
    return labels[route] || 'Section';
  }

  function formatRelativeTime(ts) {
    const n = Number(ts);
    if (!n || n <= 0) return '';
    const diffMs = Date.now() - n;
    if (diffMs < 45000) return 'just now';
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 60) return minutes + ' min ago';
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + ' hr ago';
    const days = Math.floor(hours / 24);
    if (days < 7) return days + ' day' + (days === 1 ? '' : 's') + ' ago';
    const weeks = Math.floor(days / 7);
    if (weeks < 6) return weeks + ' wk ago';
    return '';
  }

  function formatLastVisited(ts) {
    const n = Number(ts);
    if (!n || n <= 0) return '';
    const rel = formatRelativeTime(n);
    const exact = new Date(n).toLocaleString();
    return rel ? (rel + ' (' + exact + ')') : exact;
  }

  function renderHome() {
    if (!data) return;
    const pitchEl = $('home-pitch');
    if (pitchEl) pitchEl.textContent = data.sales.pitch || '';

    const statsEl = $('home-stats');
    if (statsEl) {
      const offers = (data.divisions || []).reduce(function (sum, div) { return sum + ((div.offers || []).length); }, 0);
      const stats = [
        { value: (data.divisions || []).length, label: 'Divisions' },
        { value: offers, label: 'Offers' },
        { value: (data.bundles || []).length, label: 'Bundles' },
        { value: (data.delivery && data.delivery.qaChecklists ? data.delivery.qaChecklists.length : 0), label: 'QA Lists' },
      ];
      statsEl.innerHTML = stats.map(function (s) {
        return '<div class="stat"><span class="stat__value">' + escapeHtml(s.value) + '</span><span class="stat__label">' + escapeHtml(s.label) + '</span></div>';
      }).join('');
    }

    const continueEl = $('home-continue');
    const lastRoute = state.lastRoute || '';
    if (continueEl) {
      if (lastRoute && lastRoute !== 'home') {
        const lastVisited = formatLastVisited(state.lastRouteAt);
        const summitHint = lastRoute === 'summit'
          ? '<p class="home-continue__hint">Saved Summit preferences: level ' + escapeHtml(state.summitLevelFilter || 'all') + ', sort ' + escapeHtml(state.summitSort || 'recommended') + '.</p>'
          : '';
        continueEl.innerHTML = '<div class="home-continue">' +
          '<p class="home-continue__label">Continue where you left off</p>' +
          (lastVisited ? '<p class="home-continue__stamp">Last visited: ' + escapeHtml(lastVisited) + '</p>' : '') +
          '<div class="home-continue__actions">' +
          '<button type="button" class="btn btn--primary" id="home-continue-btn" data-route="' + escapeHtml(lastRoute) + '">Resume ' + escapeHtml(getRouteLabel(lastRoute)) + '</button>' +
          '<button type="button" class="btn" id="home-clear-continue">Clear</button>' +
          '</div>' +
          summitHint +
          '</div>';
      } else {
        continueEl.innerHTML = '';
      }
    }

    const nav = $('home-nav-tiles');
    if (!nav) return;
    const links = [
      { route: 'onboarding', label: 'Non-Coder Onboarding' },
      { route: 'bytecasts', label: 'Non-Coder ByteCasts' },
      { route: 'summit', label: 'Summit Courses' },
      { route: 'divisions', label: 'Divisions & Offers' },
      { route: 'sales', label: 'Sales Playbook' },
      { route: 'delivery', label: 'Delivery SOP & QA' },
      { route: 'intake', label: 'Intake Form' },
      { route: 'pricing', label: 'Pricing Grid' },
      { route: 'bundles', label: 'Bundles' },
      { route: 'onepager', label: 'One-pager' }
    ];
    nav.innerHTML = links.map(function (l) {
      return '<a href="#' + l.route + '" class="tile" data-route="' + l.route + '"><span class="tile__label">' + escapeHtml(l.label) + '</span></a>';
    }).join('');
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        showView(a.getAttribute('data-route'));
      });
    });

    const continueBtn = $('home-continue-btn');
    if (continueBtn) {
      continueBtn.addEventListener('click', function () {
        const route = continueBtn.getAttribute('data-route');
        if (route) showView(route);
      });
    }
    const clearBtn = $('home-clear-continue');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        state.lastRoute = '';
        state.lastRouteAt = 0;
        try { localStorage.removeItem('offerpack-last-route'); } catch (e) {}
        try { localStorage.removeItem('offerpack-last-route-at'); } catch (e) {}
        renderHome();
      });
    }
  }

  function highlightMatch(text, term) {
    const src = text == null ? '' : String(text);
    if (!term) return escapeHtml(src);
    const idx = src.toLowerCase().indexOf(term.toLowerCase());
    if (idx < 0) return escapeHtml(src);
    const before = escapeHtml(src.slice(0, idx));
    const hit = escapeHtml(src.slice(idx, idx + term.length));
    const after = escapeHtml(src.slice(idx + term.length));
    return before + '<mark>' + hit + '</mark>' + after;
  }

  function renderDivisions() {
    const list = $('divisions-list');
    if (!list || !data) return;
    const filter = (state.divisionFilter || '').trim().toLowerCase();

    list.innerHTML = data.divisions.map(function (div) {
      const filteredOffers = (div.offers || []).filter(function (o) {
        if (!filter) return true;
        const hay = [div.name, div.tagline, o.name, o.outcome, (o.includes || []).join(' ')].join(' ').toLowerCase();
        return hay.indexOf(filter) >= 0;
      });

      if (filter && filteredOffers.length === 0) return '';

      const isExpanded = state.expandedDivisions.has(div.id) || !!filter;
      const offersHtml = filteredOffers.map(function (o) {
        return '<a href="#offer-' + o.id + '" class="offer-thumb" data-offer-id="' + o.id + '">' +
          '<span class="offer-thumb__name">' + highlightMatch(o.name, filter) + '</span>' +
          (o.turnaround ? '<span class="offer-thumb__turnaround">' + escapeHtml(o.turnaround) + '</span>' : '') +
          '</a>';
      }).join('');

      return '<div class="division-card" data-division-id="' + div.id + '">' +
        '<button type="button" class="division-card__head" aria-expanded="' + (isExpanded ? 'true' : 'false') + '" aria-controls="offers-' + div.id + '" id="head-' + div.id + '">' +
        '<div><h3 class="division-card__title">' + highlightMatch(div.name, filter) + '</h3>' + (div.tagline ? '<p class="division-card__tagline">' + escapeHtml(div.tagline) + '</p>' : '') + '</div>' +
        '<span aria-hidden="true">▼</span></button>' +
        '<div id="offers-' + div.id + '" class="division-card__offers"' + (isExpanded ? '' : ' hidden') + '>' + offersHtml + '</div></div>';
    }).join('');

    if (!list.innerHTML.trim()) {
      list.innerHTML = '<div class="block"><p class="block__content">No matches. Try a broader filter.</p></div>';
      return;
    }

    list.querySelectorAll('.division-card__head').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const id = btn.getAttribute('aria-controls');
        const panel = id ? document.getElementById(id) : null;
        const divisionId = (btn.closest('.division-card') || {}).dataset ? btn.closest('.division-card').dataset.divisionId : '';
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (panel) panel.hidden = expanded;
        if (divisionId) {
          if (expanded) state.expandedDivisions.delete(divisionId);
          else state.expandedDivisions.add(divisionId);
        }
      });
    });

    list.querySelectorAll('.offer-thumb').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        const id = a.getAttribute('data-offer-id');
        if (id) {
          window.location.hash = 'offer-' + id;
          showOfferDetail(id);
        }
      });
    });
  }

  function findOffer(offerId) {
    if (!data) return null;
    for (let i = 0; i < data.divisions.length; i++) {
      for (let j = 0; j < data.divisions[i].offers.length; j++) {
        if (data.divisions[i].offers[j].id === offerId) return { division: data.divisions[i], offer: data.divisions[i].offers[j] };
      }
    }
    return null;
  }

  function showOfferDetail(offerId) {
    const detail = $('offer-detail');
    const list = $('divisions-list');
    if (!detail || !list) return;
    const found = findOffer(offerId);
    if (!found) {
      detail.classList.add('offer-detail--hidden');
      return;
    }

    const o = found.offer;
    const d = found.division;
    state.expandedDivisions.add(d.id);
    renderDivisions();

    detail.classList.remove('offer-detail--hidden');
    detail.innerHTML =
      '<div class="offer-detail__back"><a href="#divisions" class="btn">← Back to divisions</a></div>' +
      '<h3>' + escapeHtml(o.name) + '</h3>' +
      (o.turnaround ? '<p class="offer-detail__meta">Turnaround: ' + escapeHtml(o.turnaround) + '</p>' : '') +
      (o.outcome ? '<div class="offer-detail__block"><h4>Outcome</h4><p>' + escapeHtml(o.outcome) + '</p></div>' : '') +
      (o.includes && o.includes.length ? '<div class="offer-detail__block"><h4>Includes</h4><ul><li>' + o.includes.map(escapeHtml).join('</li><li>') + '</li></ul></div>' : '') +
      (o.clientProvides && o.clientProvides.length ? '<div class="offer-detail__block"><h4>Client provides</h4><ul><li>' + o.clientProvides.map(escapeHtml).join('</li><li>') + '</li></ul></div>' : '') +
      (o.exclusions && o.exclusions.length ? '<div class="offer-detail__block"><h4>Exclusions</h4><ul><li>' + o.exclusions.map(escapeHtml).join('</li><li>') + '</li></ul></div>' : '') +
      (o.notes ? '<div class="offer-detail__block"><h4>Notes</h4><p>' + escapeHtml(o.notes) + '</p></div>' : '') +
      (o.upsells && o.upsells.length ? '<div class="offer-detail__block"><h4>Upsells</h4><ul><li>' + o.upsells.map(escapeHtml).join('</li><li>') + '</li></ul></div>' : '');

    const head = document.getElementById('head-' + d.id);
    const panel = document.getElementById('offers-' + d.id);
    if (head && panel) {
      head.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
    }

    const backLink = detail.querySelector('a');
    if (backLink) {
      backLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.hash = 'divisions';
        showView('divisions');
        detail.classList.add('offer-detail--hidden');
      });
    }

    detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', 'true');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (!ok) throw new Error('Copy failed');
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  function copyBlock(text, button) {
    if (!text) return;
    copyText(text).then(function () {
      showToast('Copied to clipboard');
      if (button) {
        const prev = button.textContent;
        button.textContent = 'Copied';
        button.classList.add('is-done');
        window.setTimeout(function () {
          button.textContent = prev;
          button.classList.remove('is-done');
        }, 900);
      }
    }).catch(function () {
      showToast('Clipboard blocked in this browser');
    });
  }

  function renderSales() {
    const el = $('sales-content');
    if (!el || !data || !data.sales) return;
    const s = data.sales;
    let html = '';
    if (s.pitch) {
      html += '<div class="block copy-wrap"><h3 class="block__title">30-second pitch</h3><p class="block__content">' + escapeHtml(s.pitch) + '</p><button type="button" class="copy-btn" data-copy="pitch">Copy</button></div>';
    }
    if (s.qualification && s.qualification.length) {
      html += '<div class="block copy-wrap"><h3 class="block__title">Qualification (5 questions)</h3><ol class="block__content"><li>' + s.qualification.map(escapeHtml).join('</li><li>') + '</li></ol><button type="button" class="copy-btn" data-copy="qual">Copy</button></div>';
    }
    if (s.objections && s.objections.length) {
      html += '<div class="block copy-wrap"><h3 class="block__title">Objection handlers</h3><ul class="block__content"><li>' + s.objections.map(escapeHtml).join('</li><li>') + '</li></ul><button type="button" class="copy-btn" data-copy="obj">Copy</button></div>';
    }
    if (s.closePattern && s.closePattern.length) {
      html += '<div class="block copy-wrap"><h3 class="block__title">Close pattern</h3><ul class="block__content"><li>' + s.closePattern.map(escapeHtml).join('</li><li>') + '</li></ul><button type="button" class="copy-btn" data-copy="close">Copy</button></div>';
    }
    if (s.followUp && s.followUp.length) {
      s.followUp.forEach(function (f, i) {
        html += '<div class="block copy-wrap"><h3 class="block__title">Follow-up: ' + escapeHtml(f.label) + '</h3><p class="block__content"><strong>Subject:</strong> ' + escapeHtml(f.subject) + '</p><p class="block__content"><strong>Body:</strong> ' + escapeHtml(f.body) + '</p><button type="button" class="copy-btn" data-copy="fu' + i + '">Copy</button></div>';
      });
    }

    el.innerHTML = html;
    el.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const key = btn.getAttribute('data-copy');
        let text = '';
        if (key === 'pitch') text = s.pitch;
        else if (key === 'qual') text = s.qualification.join('\n');
        else if (key === 'obj') text = s.objections.join('\n');
        else if (key === 'close') text = s.closePattern.join('\n');
        else if (key && key.startsWith('fu')) {
          const idx = parseInt(key.replace('fu', ''), 10);
          const fu = (s.followUp || [])[idx] || {};
          text = (fu.subject || '') + '\n\n' + (fu.body || '');
        }
        copyBlock(text, btn);
      });
    });
  }

  function loadQaState() {
    try {
      const raw = localStorage.getItem('offerpack-qa-checked');
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (e) {}
    return {};
  }

  function saveQaState() {
    try {
      localStorage.setItem('offerpack-qa-checked', JSON.stringify(state.qaChecked || {}));
    } catch (e) {}
  }

  function qaIsChecked(qaId, itemIdx) {
    const arr = (state.qaChecked || {})[qaId];
    return Array.isArray(arr) ? arr.indexOf(itemIdx) >= 0 : false;
  }

  function qaSetChecked(qaId, itemIdx, checked) {
    if (!state.qaChecked[qaId]) state.qaChecked[qaId] = [];
    const idx = state.qaChecked[qaId].indexOf(itemIdx);
    if (checked && idx < 0) state.qaChecked[qaId].push(itemIdx);
    if (!checked && idx >= 0) state.qaChecked[qaId].splice(idx, 1);
    saveQaState();
  }

  function loadOnboardingChecks() {
    try {
      const raw = localStorage.getItem('offerpack-onboarding-checks');
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (e) {}
    return {};
  }

  function saveOnboardingChecks() {
    try {
      localStorage.setItem('offerpack-onboarding-checks', JSON.stringify(state.onboardingChecks || {}));
    } catch (e) {}
  }

  function onboardingChecked(trackId, idx) {
    const arr = (state.onboardingChecks || {})[trackId];
    return Array.isArray(arr) ? arr.indexOf(idx) >= 0 : false;
  }

  function setOnboardingChecked(trackId, idx, checked) {
    if (!state.onboardingChecks[trackId]) state.onboardingChecks[trackId] = [];
    const arr = state.onboardingChecks[trackId];
    const pos = arr.indexOf(idx);
    if (checked && pos < 0) arr.push(idx);
    if (!checked && pos >= 0) arr.splice(pos, 1);
    saveOnboardingChecks();
  }

  function loadBytecastDone() {
    try {
      const raw = localStorage.getItem('offerpack-bytecasts-done');
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return [];
  }

  function saveBytecastDone() {
    try {
      localStorage.setItem('offerpack-bytecasts-done', JSON.stringify(state.bytecastsDone || []));
    } catch (e) {}
  }

  function toggleBytecastDone(id) {
    const idx = state.bytecastsDone.indexOf(id);
    if (idx >= 0) state.bytecastsDone.splice(idx, 1);
    else state.bytecastsDone.push(id);
    saveBytecastDone();
  }

  function loadSummitDone() {
    try {
      const raw = localStorage.getItem('offerpack-summit-done');
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return [];
  }

  function loadSummitCriteriaProgress() {
    try {
      const raw = localStorage.getItem('offerpack-summit-progress');
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (e) {}
    return {};
  }

  function loadSummitLevelFilter() {
    try {
      const raw = localStorage.getItem('offerpack-summit-level-filter');
      if (!raw) return 'all';
      if (raw === 'all') return raw;
      if (/^L\d+$/i.test(raw)) return raw.toUpperCase();
    } catch (e) {}
    return 'all';
  }

  function loadSummitSort() {
    const allowed = ['recommended', 'duration-asc', 'duration-desc', 'name-asc', 'name-desc', 'completion-desc', 'completion-asc'];
    try {
      const raw = localStorage.getItem('offerpack-summit-sort');
      if (raw && allowed.indexOf(raw) >= 0) return raw;
    } catch (e) {}
    return 'recommended';
  }

  function saveSummitViewPrefs() {
    try {
      localStorage.setItem('offerpack-summit-level-filter', state.summitLevelFilter || 'all');
      localStorage.setItem('offerpack-summit-sort', state.summitSort || 'recommended');
    } catch (e) {}
  }

  function loadLastRoute() {
    try {
      const raw = localStorage.getItem('offerpack-last-route');
      if (raw && views.indexOf(raw) >= 0 && raw !== 'home') return raw;
    } catch (e) {}
    return '';
  }

  function loadLastRouteAt() {
    try {
      const raw = localStorage.getItem('offerpack-last-route-at');
      const parsed = Number(raw);
      if (parsed > 0) return parsed;
    } catch (e) {}
    return 0;
  }

  function saveLastRoute(route) {
    if (!route || route === 'home' || views.indexOf(route) < 0) return;
    state.lastRoute = route;
    state.lastRouteAt = Date.now();
    try {
      localStorage.setItem('offerpack-last-route', route);
      localStorage.setItem('offerpack-last-route-at', String(state.lastRouteAt));
    } catch (e) {}
  }

  function saveSummitDone() {
    try {
      localStorage.setItem('offerpack-summit-done', JSON.stringify(state.summitDone || []));
    } catch (e) {}
  }

  function saveSummitCriteriaProgress() {
    try {
      localStorage.setItem('offerpack-summit-progress', JSON.stringify(state.summitCriteriaProgress || {}));
    } catch (e) {}
  }

  function getSummitCourseProgress(courseId, criteriaCount) {
    const raw = (state.summitCriteriaProgress || {})[courseId];
    if (!Array.isArray(raw)) return [];
    const normalized = [];
    raw.forEach(function (idx) {
      const n = Number(idx);
      if (Math.floor(n) === n && n >= 0 && n < criteriaCount && normalized.indexOf(n) < 0) {
        normalized.push(n);
      }
    });
    normalized.sort(function (a, b) { return a - b; });
    return normalized;
  }

  function setSummitCriterionChecked(courseId, criterionIdx, checked, criteriaCount) {
    const list = getSummitCourseProgress(courseId, criteriaCount);
    const pos = list.indexOf(criterionIdx);
    if (checked && pos < 0) list.push(criterionIdx);
    if (!checked && pos >= 0) list.splice(pos, 1);
    list.sort(function (a, b) { return a - b; });

    if (list.length) state.summitCriteriaProgress[courseId] = list;
    else delete state.summitCriteriaProgress[courseId];

    const doneIdx = state.summitDone.indexOf(courseId);
    if (criteriaCount > 0 && list.length === criteriaCount) {
      if (doneIdx < 0) state.summitDone.push(courseId);
    } else if (doneIdx >= 0) {
      state.summitDone.splice(doneIdx, 1);
    }

    saveSummitCriteriaProgress();
    saveSummitDone();
  }

  function toggleSummitDone(courseId, criteriaCount) {
    const idx = state.summitDone.indexOf(courseId);
    if (idx >= 0) {
      state.summitDone.splice(idx, 1);
      delete state.summitCriteriaProgress[courseId];
    } else {
      state.summitDone.push(courseId);
      if (criteriaCount > 0) {
        state.summitCriteriaProgress[courseId] = Array.from({ length: criteriaCount }, function (_, i) { return i; });
      }
    }
    saveSummitCriteriaProgress();
    saveSummitDone();
  }

  function getDefaultNoncoderData() {
    return {
      assumptions: [
        { label: 'Coding background', value: 'None or very limited' },
        { label: 'Time availability', value: '45-90 minutes per session' },
        { label: 'Device reality', value: 'Phone-first, laptop optional' },
      ],
      pathway: {
        title: 'Contributor Ladder for Non-Coders',
        steps: [
          { name: 'Level 0 - Scout', summary: 'Testing and bug reports' },
          { name: 'Level 1 - Scribe', summary: 'Docs and content updates' },
          { name: 'Level 2 - UX Helper', summary: 'Usability and accessibility improvements' },
        ],
      },
      tracks: [],
      bytecasts: [],
    };
  }

  function getDefaultSummitCoursesData() {
    return {
      schema: 'summit-courses-v1',
      levels: [
        { code: 'L0', label: 'Foundation' },
        { code: 'L1', label: 'No-code Contributor' },
        { code: 'L2', label: 'UI and QA Contributor' },
        { code: 'L3', label: 'Code Contributor' },
        { code: 'L4', label: 'Contributor Lead' }
      ],
      courses: []
    };
  }

  function renderDelivery() {
    const el = $('delivery-content');
    if (!el || !data || !data.delivery) return;
    const d = data.delivery;

    let html = '<div class="block"><h3 class="block__title">Fulfillment phases</h3><ol class="block__content"><li>' + (d.phases || []).map(escapeHtml).join('</li><li>') + '</li></ol></div>';
    html += '<div class="block"><h3 class="block__title">Revision policy</h3><ul class="block__content"><li>' + (d.revisionPolicy || []).map(escapeHtml).join('</li><li>') + '</li></ul></div>';
    html += '<div class="block"><h3 class="block__title">Standard handoff</h3><ul class="block__content"><li>' + (d.handoff || []).map(escapeHtml).join('</li><li>') + '</li></ul></div>';

    html += '<h3 style="margin-top:24px">QA Checklists</h3>';
    html += '<div class="qa-actions"><button type="button" class="btn" id="qa-reset">Reset checkboxes</button></div>';
    html += '<div class="qa-tabs" role="tablist" aria-label="QA checklist categories">';
    (d.qaChecklists || []).forEach(function (qa, i) {
      html += '<button type="button" class="qa-tab" role="tab" id="qa-tab-' + qa.id + '" aria-controls="qa-panel-' + qa.id + '" aria-selected="' + (i === 0 ? 'true' : 'false') + '" data-qa="' + qa.id + '">' + escapeHtml(qa.name) + '</button>';
    });
    html += '</div>';

    (d.qaChecklists || []).forEach(function (qa, i) {
      html += '<div class="qa-panel" role="tabpanel" id="qa-panel-' + qa.id + '" aria-labelledby="qa-tab-' + qa.id + '"' + (i > 0 ? ' hidden' : '') + '><ul class="qa-list">' + (qa.items || []).map(function (item, itemIdx) {
        const checked = qaIsChecked(qa.id, itemIdx) ? ' checked' : '';
        return '<li><input type="checkbox" data-qa-id="' + qa.id + '" data-qa-idx="' + itemIdx + '" aria-label="' + escapeHtml(item) + '"' + checked + '> ' + escapeHtml(item) + '</li>';
      }).join('') + '</ul></div>';
    });

    el.innerHTML = html;

    el.querySelectorAll('.qa-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        el.querySelectorAll('.qa-tab').forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
        tab.setAttribute('aria-selected', 'true');
        const id = tab.getAttribute('data-qa');
        el.querySelectorAll('.qa-panel').forEach(function (p) {
          p.hidden = p.getAttribute('id') !== 'qa-panel-' + id;
        });
      });
    });

    el.querySelectorAll('input[type="checkbox"][data-qa-id]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        qaSetChecked(cb.getAttribute('data-qa-id'), Number(cb.getAttribute('data-qa-idx')), cb.checked);
      });
    });

    const resetBtn = $('qa-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        state.qaChecked = {};
        saveQaState();
        renderDelivery();
        showToast('QA checklist state cleared');
      });
    }
  }

  function renderIntake() {
    const el = $('intake-content');
    if (!el || !data || !data.intake || !data.intake.sections) return;
    el.innerHTML = data.intake.sections.map(function (sec) {
      return '<div class="intake-section"><h3>' + escapeHtml(sec.title) + '</h3><ul><li>' + (sec.fields || []).map(escapeHtml).join('</li><li>') + '</li></ul></div>';
    }).join('');
  }

  function renderPricing() {
    const el = $('pricing-content');
    if (!el || !data || !data.pricing || !data.pricing.byDivision) return;
    const byDiv = data.pricing.byDivision;
    const divNames = { nexus: 'NeXuS TechWorks', skyforge: 'SkyForge', echoverse: 'EchoVerse', summit: 'Summit Learning', lumina: 'Lumina Creative', vespera: 'Vespera Publishing', horizon: 'Horizon Aerial & Visual' };
    let html = '';

    Object.keys(byDiv).forEach(function (divId) {
      if (divId === '_bundles') return;
      const grid = byDiv[divId];
      const name = divNames[divId] || divId;
      html += '<div class="pricing-division"><h3>' + escapeHtml(name) + '</h3><table class="pricing-table"><thead><tr><th>Offer</th><th class="pricing-tier">Good</th><th>Better</th><th>Best</th></tr></thead><tbody>';
      Object.keys(grid).forEach(function (offerKey) {
        const t = grid[offerKey];
        if (!t || typeof t !== 'object') return;
        const div = (data.divisions || []).find(function (d) { return d.id === divId; });
        const offer = div && (div.offers || []).find(function (o) {
          return o.key === offerKey || o.id === divId + '-' + offerKey || offerKey.indexOf(o.key) >= 0 || (o.name && o.name.toLowerCase().replace(/\s+/g, '-').indexOf(offerKey) >= 0);
        });
        const offerName = offer ? offer.name : offerKey.replace(/-/g, ' ');
        html += '<tr><td>' + escapeHtml(offerName) + '</td><td>' + escapeHtml(t.good || '') + '</td><td>' + escapeHtml(t.better || '') + '</td><td>' + escapeHtml(t.best || '') + '</td></tr>';
      });
      html += '</tbody></table></div>';
    });

    if (byDiv._bundles) {
      html += '<div class="pricing-division"><h3>Bundle anchors</h3><ul>';
      Object.keys(byDiv._bundles).forEach(function (k) {
        html += '<li><strong>' + escapeHtml(k) + '</strong>: ' + escapeHtml(JSON.stringify(byDiv._bundles[k])) + '</li>';
      });
      html += '</ul></div>';
    }
    el.innerHTML = html;
  }

  function renderBundles() {
    const el = $('bundles-content');
    if (!el || !data || !data.bundles) return;
    el.innerHTML = data.bundles.map(function (b) {
      return '<div class="bundle-card"><h3>' + escapeHtml(b.name) + '</h3><p class="bundle-card__includes">' + escapeHtml(b.includes) + '</p><p class="bundle-card__outcome">' + escapeHtml(b.outcome) + '</p></div>';
    }).join('');
  }

  function renderOnepager() {
    const el = $('onepager-content');
    if (!el || !data || !data.onePager) return;
    const p = data.onePager;
    let html = '<p class="onepager-intro">' + escapeHtml(p.intro) + '</p>';
    (p.divisions || []).forEach(function (div) {
      html += '<div class="onepager-division"><h3>' + escapeHtml(div.name) + '</h3><ul><li>' + (div.items || []).map(escapeHtml).join('</li><li>') + '</li></ul></div>';
    });
    if (p.popularBundles && p.popularBundles.length) {
      html += '<h3 style="margin-top:20px">Popular bundles</h3><ul><li>' + p.popularBundles.map(escapeHtml).join('</li><li>') + '</li></ul>';
    }
    html += '<p class="onepager-terms">' + escapeHtml(p.standardTerms || '') + '</p>';
    el.innerHTML = html;
  }

  function renderOnboarding() {
    const el = $('onboarding-content');
    if (!el) return;
    const src = noncoderData || getDefaultNoncoderData();
    const assumptions = src.assumptions || [];
    const pathway = src.pathway || { title: 'Contributor Ladder', steps: [] };
    const tracks = src.tracks || [];

    const assumptionsHtml = assumptions.map(function (a) {
      return '<div class="onboard-assumption"><strong>' + escapeHtml(a.label) + ':</strong> ' + escapeHtml(a.value) + '</div>';
    }).join('');

    const stepsHtml = (pathway.steps || []).map(function (s) {
      return '<li><strong>' + escapeHtml(s.name) + '</strong><span>' + escapeHtml(s.summary) + '</span></li>';
    }).join('');

    let totalTasks = 0;
    let totalDone = 0;

    const tracksHtml = tracks.map(function (t) {
      const tasks = t.tasks || [];
      const doneCount = tasks.filter(function (_, idx) { return onboardingChecked(t.id, idx); }).length;
      totalTasks += tasks.length;
      totalDone += doneCount;
      return '<article class="onboard-track">' +
        '<h3>' + escapeHtml(t.name) + '</h3>' +
        '<p class="onboard-focus"><strong>Focus:</strong> ' + escapeHtml(t.focus || '') + '</p>' +
        '<p class="onboard-why">' + escapeHtml(t.whyItMatters || '') + '</p>' +
        '<p class="onboard-progress">' + doneCount + '/' + tasks.length + ' tasks complete</p>' +
        '<ul class="onboard-task-list">' +
        tasks.map(function (task, idx) {
          const checked = onboardingChecked(t.id, idx) ? ' checked' : '';
          return '<li><label><input type="checkbox" data-track-id="' + escapeHtml(t.id) + '" data-task-idx="' + idx + '"' + checked + '> <span>' + escapeHtml(task) + '</span></label></li>';
        }).join('') +
        '</ul>' +
        '<p class="onboard-grad"><strong>Graduation signal:</strong> ' + escapeHtml(t.graduationSignal || '') + '</p>' +
        '</article>';
    }).join('');

    const helpTemplate = [
      'Hi team, I need help with this task:',
      '- Page/feature:',
      '- What I tried:',
      '- What happened:',
      '- Screenshot/video link:',
      '- Device/browser:'
    ].join('\n');

    el.innerHTML = '<div class="onboard-grid">' +
      '<section class="block onboard-start">' +
      '<h3 class="block__title">Start Here (No Tech Background)</h3>' +
      '<ol class="onboard-start-list">' +
      '<li>Open <strong>Home</strong> and click one section.</li>' +
      '<li>Run one simple test and write what happened.</li>' +
      '<li>Use the bug template in <code>CONTRIBUTING.md</code>.</li>' +
      '<li>Complete one task checkbox below.</li>' +
      '</ol>' +
      '<div class="onboard-start-actions">' +
      '<button type="button" class="btn" id="copy-help-template">Copy help request template</button>' +
      '<span class="onboard-total">' + totalDone + '/' + totalTasks + ' total onboarding tasks done</span>' +
      '</div>' +
      '</section>' +
      '<section class="block"><h3 class="block__title">Assumptions We Design For</h3>' + assumptionsHtml + '</section>' +
      '<section class="block"><h3 class="block__title">' + escapeHtml(pathway.title || 'Contributor Ladder') + '</h3><ol class="onboard-steps">' + stepsHtml + '</ol></section>' +
      '</div>' +
      '<section class="onboard-tracks">' + tracksHtml + '</section>';

    el.querySelectorAll('input[type="checkbox"][data-track-id]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        const trackId = cb.getAttribute('data-track-id');
        const idx = Number(cb.getAttribute('data-task-idx'));
        setOnboardingChecked(trackId, idx, cb.checked);
        renderOnboarding();
      });
    });

    const copyHelpBtn = $('copy-help-template');
    if (copyHelpBtn) {
      copyHelpBtn.addEventListener('click', function () {
        copyBlock(helpTemplate, copyHelpBtn);
      });
    }
  }

  function renderBytecasts() {
    const el = $('bytecasts-content');
    if (!el) return;
    const src = noncoderData || getDefaultNoncoderData();
    const casts = src.bytecasts || [];
    const doneSet = new Set(state.bytecastsDone || []);
    const completed = casts.filter(function (c) { return doneSet.has(c.id); }).length;

    const cards = casts.map(function (c) {
      const isDone = doneSet.has(c.id);
      return '<article class="bytecast-card' + (isDone ? ' is-done' : '') + '">' +
        '<div class="bytecast-meta"><span class="pill">' + escapeHtml(c.level || 'L0') + '</span><span>' + escapeHtml(c.duration || '') + '</span></div>' +
        '<h3>' + escapeHtml(c.title) + '</h3>' +
        '<p>' + escapeHtml(c.outcome || '') + '</p>' +
        '<p><strong>Action:</strong> ' + escapeHtml(c.action || '') + '</p>' +
        '<button type="button" class="btn bytecast-toggle" data-bytecast-id="' + escapeHtml(c.id) + '">' + (isDone ? 'Mark Incomplete' : 'Mark Complete') + '</button>' +
        '</article>';
    }).join('');

    el.innerHTML = '<div class="block"><h3 class="block__title">ByteCast Progress</h3><p class="block__content">' +
      completed + ' of ' + casts.length + ' completed. These episodes assume no coding background and focus on practical shipping behaviors.' +
      '</p></div>' +
      '<div class="bytecast-grid">' + cards + '</div>';

    el.querySelectorAll('.bytecast-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-bytecast-id');
        if (!id) return;
        toggleBytecastDone(id);
        renderBytecasts();
        showToast('ByteCast progress updated');
      });
    });
  }

  function renderSummitCourses() {
    const el = $('summit-content');
    if (!el) return;

    const src = summitCoursesData || getDefaultSummitCoursesData();
    const levels = src.levels || [];
    const courses = src.courses || [];
    const doneSet = new Set(state.summitDone || []);
    const hasLevel = levels.some(function (l) { return l.code === state.summitLevelFilter; });
    if (state.summitLevelFilter !== 'all' && !hasLevel) {
      state.summitLevelFilter = 'all';
      saveSummitViewPrefs();
    }
    const levelFilter = state.summitLevelFilter || 'all';
    const sortMode = state.summitSort || 'recommended';

    function normalizeKey(value) {
      return String(value || '').trim().toLowerCase();
    }

    function compareTitle(a, b) {
      return String(a || '').localeCompare(String(b || ''), undefined, { sensitivity: 'base' });
    }

    const levelOrder = {};
    levels.forEach(function (l, idx) {
      levelOrder[l.code] = idx;
    });

    const lookup = {};
    courses.forEach(function (c) {
      if (c && c.id) lookup[normalizeKey(c.id)] = c.id;
      if (c && c.title) lookup[normalizeKey(c.title)] = c.id;
    });

    const filterEl = $('summit-level-filter');
    if (filterEl) {
      filterEl.innerHTML = '<option value="all">All levels</option>' + levels.map(function (l) {
        return '<option value="' + escapeHtml(l.code) + '">' + escapeHtml(l.code + ' - ' + l.label) + '</option>';
      }).join('');
      filterEl.value = levelFilter;
    }

    const sortEl = $('summit-sort');
    if (sortEl) sortEl.value = sortMode;

    const listChanged = [];
    courses.forEach(function (course) {
      const criteria = course.completion_criteria || [];
      if (doneSet.has(course.id) && criteria.length > 0) {
        const current = getSummitCourseProgress(course.id, criteria.length);
        if (current.length !== criteria.length) {
          state.summitCriteriaProgress[course.id] = Array.from({ length: criteria.length }, function (_, i) { return i; });
          listChanged.push(course.id);
        }
      }
    });
    if (listChanged.length) saveSummitCriteriaProgress();

    function decorateCourse(course) {
      const duration = course.duration || {};
      const durationMin = Number(duration.minutes) || 0;
      const criteria = course.completion_criteria || [];
      const criteriaDone = getSummitCourseProgress(course.id, criteria.length);
      const isDone = doneSet.has(course.id);
      const criteriaTotal = criteria.length;
      const criteriaDoneCount = isDone && criteriaTotal > 0 ? criteriaTotal : criteriaDone.length;
      const completionPercent = criteriaTotal > 0 ? Math.round((criteriaDoneCount / criteriaTotal) * 100) : (isDone ? 100 : 0);

      const prereq = Array.isArray(course.prerequisites) ? course.prerequisites : [];
      const missingPrereq = [];
      let prereqDone = 0;
      prereq.forEach(function (p) {
        const pid = lookup[normalizeKey(p)] || null;
        const met = pid ? doneSet.has(pid) : false;
        if (met) prereqDone += 1;
        else missingPrereq.push(p);
      });
      const prereqPercent = prereq.length ? Math.round((prereqDone / prereq.length) * 100) : 100;

      let levelIdx = 99;
      if (Object.prototype.hasOwnProperty.call(levelOrder, course.level)) {
        levelIdx = levelOrder[course.level];
      } else {
        const m = /L(\d+)/i.exec(course.level || '');
        if (m) levelIdx = Number(m[1]);
      }

      let statusCode = 'ready';
      let statusLabel = 'Ready';
      if (isDone) {
        statusCode = 'done';
        statusLabel = 'Done';
      } else if (prereqPercent < 100) {
        statusCode = 'locked';
        statusLabel = 'Locked';
      } else if (criteriaDoneCount > 0) {
        statusCode = 'in-progress';
        statusLabel = 'In Progress';
      }

      return {
        course: course,
        durationMin: durationMin,
        criteria: criteria,
        criteriaDone: criteriaDone,
        criteriaDoneCount: criteriaDoneCount,
        criteriaTotal: criteriaTotal,
        completionPercent: completionPercent,
        prereqTotal: prereq.length,
        prereqDone: prereqDone,
        prereqPercent: prereqPercent,
        missingPrereq: missingPrereq,
        levelIdx: levelIdx,
        isDone: isDone,
        statusCode: statusCode,
        statusLabel: statusLabel
      };
    }

    function compareRecommended(a, b) {
      if (a.isDone !== b.isDone) return a.isDone ? 1 : -1;
      if (a.prereqPercent !== b.prereqPercent) return b.prereqPercent - a.prereqPercent;
      if (a.levelIdx !== b.levelIdx) return a.levelIdx - b.levelIdx;
      if (a.durationMin !== b.durationMin) return a.durationMin - b.durationMin;
      return compareTitle(a.course.title, b.course.title);
    }

    function sortDecorated(input) {
      const sorted = input.slice();
      sorted.sort(function (a, b) {
        if (sortMode === 'duration-asc') {
          if (a.durationMin !== b.durationMin) return a.durationMin - b.durationMin;
          return compareTitle(a.course.title, b.course.title);
        }
        if (sortMode === 'duration-desc') {
          if (a.durationMin !== b.durationMin) return b.durationMin - a.durationMin;
          return compareTitle(a.course.title, b.course.title);
        }
        if (sortMode === 'name-asc') {
          return compareTitle(a.course.title, b.course.title);
        }
        if (sortMode === 'name-desc') {
          return compareTitle(b.course.title, a.course.title);
        }
        if (sortMode === 'completion-desc') {
          if (a.completionPercent !== b.completionPercent) return b.completionPercent - a.completionPercent;
          return compareTitle(a.course.title, b.course.title);
        }
        if (sortMode === 'completion-asc') {
          if (a.completionPercent !== b.completionPercent) return a.completionPercent - b.completionPercent;
          return compareTitle(a.course.title, b.course.title);
        }
        return compareRecommended(a, b);
      });
      return sorted;
    }

    const allDecorated = courses.map(decorateCourse);
    const filteredDecorated = levelFilter === 'all'
      ? allDecorated.slice()
      : allDecorated.filter(function (dc) { return dc.course.level === levelFilter; });
    const sortedDecorated = sortDecorated(filteredDecorated);

    const completedAll = allDecorated.filter(function (dc) { return dc.isDone; }).length;
    const completedFiltered = filteredDecorated.filter(function (dc) { return dc.isDone; }).length;

    const nextCourse = allDecorated
      .filter(function (dc) { return !dc.isDone; })
      .sort(compareRecommended)[0] || null;

    const nextBanner = nextCourse
      ? '<div class="block summit-banner">' +
        '<p class="summit-banner__label">Next Recommended Course</p>' +
        '<h3 class="summit-banner__title">' + escapeHtml(nextCourse.course.title || '') + '</h3>' +
        '<p class="summit-banner__meta">' +
        escapeHtml(nextCourse.course.level || 'L0') + ' | ' + escapeHtml(nextCourse.durationMin + ' min') +
        ' | Prerequisites met: ' + nextCourse.prereqDone + '/' + nextCourse.prereqTotal +
        '</p>' +
        '<p class="block__content">' +
        (nextCourse.prereqPercent === 100
          ? 'Ready now. Start this course next to keep momentum.'
          : 'Complete prerequisites first: ' + escapeHtml(nextCourse.missingPrereq.join('; '))) +
        '</p>' +
        '<button type="button" class="btn summit-jump" data-jump-course-id="' + escapeHtml(nextCourse.course.id) + '">Jump to course</button>' +
        '</div>'
      : '<div class="block summit-banner">' +
        '<p class="summit-banner__label">Next Recommended Course</p>' +
        '<h3 class="summit-banner__title">All courses complete</h3>' +
        '<p class="block__content">You have completed every Summit course in this catalog.</p>' +
        '</div>';

    const cardsHtml = sortedDecorated.map(function (dc) {
      const course = dc.course;
      const duration = course.duration || {};
      const prereq = course.prerequisites || [];
      const criteriaItems = dc.criteria.length
        ? '<ul>' + dc.criteria.map(function (item, idx) {
          const checked = dc.criteriaDone.indexOf(idx) >= 0 ? ' checked' : '';
          return '<li><label><input type="checkbox" class="summit-criterion" data-course-id="' + escapeHtml(course.id) + '" data-criterion-idx="' + idx + '" data-criteria-total="' + dc.criteriaTotal + '"' + checked + '> <span>' + escapeHtml(item) + '</span></label></li>';
        }).join('') + '</ul>'
        : '<p class="block__content">No completion criteria listed.</p>';

      return '<article id="summit-course-' + escapeHtml(course.id || '') + '" class="summit-card' + (dc.isDone ? ' is-done' : '') + '">' +
        '<div class="summit-meta">' +
        '<span class="pill">' + escapeHtml(course.level || 'L0') + '</span>' +
        '<span class="pill">' + escapeHtml((duration.minutes || 0) + ' min') + '</span>' +
        '<span class="pill">' + escapeHtml(duration.format || 'self-paced') + '</span>' +
        '<span class="pill pill--status pill--status-' + escapeHtml(dc.statusCode) + '">' + escapeHtml(dc.statusLabel) + '</span>' +
        '<span class="pill">Completion ' + dc.completionPercent + '%</span>' +
        '</div>' +
        '<h3>' + escapeHtml(course.title || '') + '</h3>' +
        '<p class="summit-course-id">Course ID: ' + escapeHtml(course.id || '') + '</p>' +
        '<div class="summit-prereq"><strong>Prerequisites:</strong> ' + (prereq.length ? escapeHtml(prereq.join('; ')) : 'None') + '</div>' +
        '<p class="summit-progress">' + dc.criteriaDoneCount + ' of ' + dc.criteriaTotal + ' completion criteria complete</p>' +
        '<div class="summit-criteria"><strong>Completion criteria:</strong>' + criteriaItems + '</div>' +
        '<div class="summit-card-actions">' +
        '<button type="button" class="btn summit-toggle" data-course-id="' + escapeHtml(course.id) + '" data-criteria-total="' + dc.criteriaTotal + '">' + (dc.isDone ? 'Mark Incomplete' : 'Mark Complete') + '</button>' +
        '</div>' +
        '</article>';
    }).join('');

    el.innerHTML = nextBanner +
      '<div class="block">' +
      '<h3 class="block__title">Course Progress</h3>' +
      '<p class="block__content">' + completedAll + ' of ' + courses.length + ' total courses completed.</p>' +
      '<p class="block__content">' + completedFiltered + ' of ' + filteredDecorated.length + ' completed in current filter.</p>' +
      '</div>' +
      '<div class="summit-grid">' + (cardsHtml || '<div class="block"><p class="block__content">No courses match this level filter.</p></div>') + '</div>';

    const jumpBtn = qs('.summit-jump', el);
    if (jumpBtn) {
      jumpBtn.addEventListener('click', function () {
        const id = jumpBtn.getAttribute('data-jump-course-id');
        if (!id) return;
        const target = $('summit-course-' + id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    el.querySelectorAll('.summit-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-course-id');
        const total = Number(btn.getAttribute('data-criteria-total')) || 0;
        if (!id) return;
        toggleSummitDone(id, total);
        renderSummitCourses();
        showToast('Summit course progress updated');
      });
    });

    el.querySelectorAll('.summit-criterion').forEach(function (cb) {
      cb.addEventListener('change', function () {
        const id = cb.getAttribute('data-course-id');
        const idx = Number(cb.getAttribute('data-criterion-idx'));
        const total = Number(cb.getAttribute('data-criteria-total')) || 0;
        if (!id || Math.floor(idx) !== idx || idx < 0) return;
        setSummitCriterionChecked(id, idx, cb.checked, total);
        renderSummitCourses();
        showToast('Summit completion progress updated');
      });
    });
  }

  function buildSearchIndex() {
    if (!data) return [];
    const items = [];
    (data.divisions || []).forEach(function (div) {
      items.push({
        type: 'division',
        title: div.name,
        subtitle: div.tagline || 'Division',
        route: 'divisions',
        divisionId: div.id,
      });
      (div.offers || []).forEach(function (o) {
        items.push({
          type: 'offer',
          title: o.name,
          subtitle: div.name,
          route: 'divisions',
          offerId: o.id,
        });
      });
    });
    if (data.sales && data.sales.objections) {
      data.sales.objections.forEach(function (obj) {
        items.push({
          type: 'objection',
          title: obj.substring(0, 80),
          subtitle: 'Sales objection',
          route: 'sales',
        });
      });
    }
    if (noncoderData && Array.isArray(noncoderData.tracks)) {
      noncoderData.tracks.forEach(function (track) {
        items.push({
          type: 'onboarding',
          title: track.name || 'Onboarding track',
          subtitle: track.focus || 'Onboarding',
          route: 'onboarding',
        });
      });
    }
    if (noncoderData && Array.isArray(noncoderData.bytecasts)) {
      noncoderData.bytecasts.forEach(function (bc) {
        items.push({
          type: 'bytecast',
          title: bc.title || 'ByteCast',
          subtitle: (bc.level || '') + ' ' + (bc.duration || ''),
          route: 'bytecasts',
        });
      });
    }
    if (summitCoursesData && Array.isArray(summitCoursesData.courses)) {
      summitCoursesData.courses.forEach(function (course) {
        const duration = course.duration || {};
        items.push({
          type: 'summit-course',
          title: course.title || 'Summit course',
          subtitle: (course.level || 'L0') + ' ' + (duration.minutes ? duration.minutes + ' min' : ''),
          route: 'summit',
        });
      });
    }
    return items;
  }

  function renderSearchResults(items) {
    const results = $('search-results');
    if (!results) return;
    state.searchResults = items.slice(0, 20);
    if (state.searchResults.length === 0) {
      results.innerHTML = '<div class="search-result">No matches.</div>';
      state.searchCursor = -1;
      return;
    }

    if (state.searchCursor < 0 || state.searchCursor >= state.searchResults.length) state.searchCursor = 0;
    results.innerHTML = state.searchResults.map(function (item, idx) {
      const active = idx === state.searchCursor ? ' is-active' : '';
      return '<a href="#" class="search-result' + active + '" data-search-idx="' + idx + '">' +
        '<span class="search-result__breadcrumb">' + escapeHtml(item.subtitle || '') + '</span> ' + escapeHtml(item.title || '') +
        '</a>';
    }).join('');

    results.querySelectorAll('.search-result[data-search-idx]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        const idx = Number(a.getAttribute('data-search-idx'));
        openSearchItem(state.searchResults[idx]);
      });
    });
  }

  function openSearchItem(item) {
    if (!item) return;
    closeSearch();
    if (item.type === 'offer' && item.offerId) {
      window.location.hash = 'offer-' + item.offerId;
      showView('divisions');
      showOfferDetail(item.offerId);
      return;
    }
    showView(item.route || 'home');
    if (item.type === 'division' && item.divisionId) {
      state.expandedDivisions.add(item.divisionId);
      renderDivisions();
      const card = qs('.division-card[data-division-id="' + item.divisionId + '"]');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function runSearch(q) {
    const lower = (q || '').toLowerCase().trim();
    const index = state.searchIndex || [];
    const filtered = lower ? index.filter(function (item) {
      return (item.title && item.title.toLowerCase().indexOf(lower) >= 0) ||
        (item.subtitle && item.subtitle.toLowerCase().indexOf(lower) >= 0);
    }) : index.slice(0, 20);
    renderSearchResults(filtered);
  }

  function openSearch() {
    const overlay = $('search-overlay');
    const input = $('search-input');
    if (overlay) overlay.classList.remove('search-overlay--hidden');
    state.searchCursor = 0;
    if (input) {
      input.value = '';
      input.focus();
    }
    runSearch('');
  }

  function closeSearch() {
    const overlay = $('search-overlay');
    if (overlay) overlay.classList.add('search-overlay--hidden');
  }

  function moveSearchCursor(delta) {
    if (!state.searchResults.length) return;
    const max = state.searchResults.length - 1;
    state.searchCursor += delta;
    if (state.searchCursor < 0) state.searchCursor = max;
    if (state.searchCursor > max) state.searchCursor = 0;
    renderSearchResults(state.searchResults);
    const active = qs('.search-result.is-active');
    if (active) active.scrollIntoView({ block: 'nearest' });
  }

  function initTheme() {
    const root = document.documentElement;
    const btn = $('theme-toggle');
    let current = root.getAttribute('data-theme') || 'light';
    try {
      const saved = localStorage.getItem('offerpack-theme');
      if (saved === 'light' || saved === 'dark') current = saved;
    } catch (e) {}
    root.setAttribute('data-theme', current);

    if (btn) {
      btn.textContent = current === 'light' ? 'Dark' : 'Light';
      btn.addEventListener('click', function () {
        const now = root.getAttribute('data-theme') || 'light';
        const next = now === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        btn.textContent = next === 'light' ? 'Dark' : 'Light';
        try { localStorage.setItem('offerpack-theme', next); } catch (e) {}
      });
    }
  }

  function initNavLinks() {
    qsAll('a[data-route]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const route = a.getAttribute('data-route');
        if (route && a.getAttribute('href') === '#' + route) {
          e.preventDefault();
          showView(route);
        }
      });
    });
  }

  function initDivisionTools() {
    const filterInput = $('division-filter');
    const expandBtn = $('expand-all-divisions');
    const collapseBtn = $('collapse-all-divisions');

    if (filterInput) {
      filterInput.addEventListener('input', function () {
        state.divisionFilter = filterInput.value || '';
        renderDivisions();
      });
    }
    if (expandBtn) {
      expandBtn.addEventListener('click', function () {
        (data.divisions || []).forEach(function (d) { state.expandedDivisions.add(d.id); });
        renderDivisions();
      });
    }
    if (collapseBtn) {
      collapseBtn.addEventListener('click', function () {
        state.expandedDivisions.clear();
        renderDivisions();
      });
    }
  }

  function initSummitTools() {
    const levelFilter = $('summit-level-filter');
    const sortSelect = $('summit-sort');
    const resetBtn = $('summit-reset-progress');

    if (levelFilter) {
      levelFilter.addEventListener('change', function () {
        state.summitLevelFilter = levelFilter.value || 'all';
        saveSummitViewPrefs();
        renderSummitCourses();
      });
    }
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        state.summitSort = sortSelect.value || 'recommended';
        saveSummitViewPrefs();
        renderSummitCourses();
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        state.summitDone = [];
        state.summitCriteriaProgress = {};
        saveSummitDone();
        saveSummitCriteriaProgress();
        renderSummitCourses();
        showToast('Summit course completion reset');
      });
    }
  }

  function initPrint() {
    const btn = $('print-onepager');
    if (!btn) return;
    btn.addEventListener('click', function () {
      showView('onepager');
      window.setTimeout(function () { window.print(); }, 60);
    });
  }

  function loadData() {
    const base = document.querySelector('script[src$="app.js"]');
    const basePath = (base && base.getAttribute('src') ? base.getAttribute('src').replace('app.js', '') : '');
    const dataPath = basePath + 'data/offer-pack-data.json';
    const noncoderPath = basePath + 'data/noncoder-onboarding.json';
    const summitPath = basePath + 'data/summit_courses.json';

    Promise.all([
      fetch(dataPath).then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('Failed to load offer pack data')); }),
      fetch(noncoderPath).then(function (r) { return r.ok ? r.json() : getDefaultNoncoderData(); }).catch(function () { return getDefaultNoncoderData(); }),
      fetch(summitPath).then(function (r) { return r.ok ? r.json() : getDefaultSummitCoursesData(); }).catch(function () { return getDefaultSummitCoursesData(); })
    ])
      .then(function (results) {
        data = results[0];
        noncoderData = results[1] || getDefaultNoncoderData();
        summitCoursesData = results[2] || getDefaultSummitCoursesData();
        state.searchIndex = buildSearchIndex();
        renderHome();
        renderOnboarding();
        renderBytecasts();
        renderSummitCourses();
        renderDivisions();
        renderSales();
        renderDelivery();
        renderIntake();
        renderPricing();
        renderBundles();
        renderOnepager();
        initNavLinks();
        initDivisionTools();
        initSummitTools();
        initTheme();
        initPrint();
        applyRoute();
      })
      .catch(function (err) {
        const pitch = $('home-pitch');
        if (pitch) {
          pitch.textContent = 'Could not load offer pack data. Use a local server (e.g. python -m http.server 8080) and open this page.';
        }
        console.error(err);
      });
  }

  $('open-search') && $('open-search').addEventListener('click', openSearch);
  $('search-close') && $('search-close').addEventListener('click', closeSearch);
  $('search-input') && $('search-input').addEventListener('input', function () {
    state.searchCursor = 0;
    runSearch(this.value);
  });
  $('search-input') && $('search-input').addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSearch();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveSearchCursor(1);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveSearchCursor(-1);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (state.searchResults.length) {
        const idx = state.searchCursor >= 0 ? state.searchCursor : 0;
        openSearchItem(state.searchResults[idx]);
      }
    }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });
  $('search-overlay') && $('search-overlay').addEventListener('click', function (e) {
    if (e.target === $('search-overlay')) closeSearch();
  });

  loadData();
})();
