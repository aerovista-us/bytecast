const game = {
  selectedProspect: '',
  selectedOffer: '',
  fitChecks: new Set(),
  chosenQuestions: new Set(),
  foundClues: [],
  chosenObjections: new Set(),
  revealedRebuttals: [],
  xp: 0,
  coins: 0,
  streak: 0,
  badges: new Set(),
  stageFlags: {
    prospect: false,
    offer: false,
    fit: false,
    clues: false,
    objections: false,
    plan: false
  }
};

function xp(delta) {
  game.xp = Math.max(0, game.xp + delta);
  game.coins = Math.max(0, game.coins + Math.max(1, Math.floor(delta / 2)));
  renderHUD();
}

function rankFromScore(score) {
  if (score >= 95) return 'S';
  if (score >= 85) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}

function renderHUD() {
  const finalScore = totalScore();
  document.getElementById('xpValue').textContent = game.xp;
  document.getElementById('clueValue').textContent = game.foundClues.length;
  document.getElementById('objValue').textContent = game.revealedRebuttals.length;
  document.getElementById('rankValue').textContent = rankFromScore(finalScore);
  document.getElementById('coinValue').textContent = game.coins;
  document.getElementById('streakValue').textContent = game.streak;
  document.getElementById('badgeValue').textContent = game.badges.size;
  document.getElementById('mainBar').style.width = `${finalScore}%`;
  document.getElementById('scoreBar').style.width = `${finalScore}%`;
  renderScoreboard();
}

function renderTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => openTab(btn.dataset.tab));
  });
}

function openTab(name) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === name));
  document.querySelectorAll('.panel').forEach(panel => panel.classList.toggle('active', panel.id === 'panel-' + name));
}

function renderProspects() {
  const grid = document.getElementById('prospectGrid');
  grid.innerHTML = Object.entries(prospects).map(([name, p]) => {
    const fitClass = p.fit === 'strong' ? 'green' : p.fit === 'maybe' ? 'amber' : 'red';
    const label = p.fit === 'strong' ? 'Strong fit' : p.fit === 'maybe' ? 'Maybe fit' : p.fit === 'weak' ? 'Weak fit' : 'Poor fit';
    return `<div class="prospect-card ${game.selectedProspect === name ? 'selected' : ''}" onclick="selectProspect('${name.replace(/'/g, "\\'")}')">
      <div class="mini">Practice prospect</div>
      <h3>${name}</h3>
      <p class="muted">${p.summary}</p>
      <span class="tag ${fitClass}">${label}</span>
    </div>`;
  }).join('');
}

function selectProspect(name) {
  const changed = game.selectedProspect !== name;
  game.selectedProspect = name;
  game.selectedOffer = '';
  game.fitChecks.clear();
  game.chosenQuestions.clear();
  game.foundClues = [];
  game.chosenObjections.clear();
  game.revealedRebuttals = [];
  renderProspects();
  renderBrief();
  renderOfferDeck();
  renderOfferList();
  renderFitChecks();
  renderQuestions();
  renderObjections();
  resetDiscoveryOutputs();
  resetRebuttalOutputs();
  document.getElementById('offerReason').value = '';
  document.getElementById('fitReason').value = '';
  document.getElementById('offerFeedback').textContent = 'Choose one lead offer and lock it in.';
  document.getElementById('outreachName').value = name;
  if (changed) {
    xp(8);
    game.streak += 1;
  }
  game.stageFlags.prospect = true;
  renderHUD();
}

function renderBrief() {
  if (!game.selectedProspect) return;
  const p = prospects[game.selectedProspect];
  document.getElementById('briefName').textContent = game.selectedProspect;
  document.getElementById('briefSummary').textContent = p.summary;
  document.getElementById('briefTags').innerHTML = p.tags.map((t, i) => {
    let cls = 'green';
    if (i === 0 && p.fit === 'maybe') cls = 'amber';
    if (i === 0 && (p.fit === 'weak' || p.fit === 'poor')) cls = 'red';
    return `<span class="tag ${cls}">${t}</span>`;
  }).join('');
}

function renderOfferDeck() {
  const deck = document.getElementById('offerDeck');
  deck.innerHTML = Object.entries(offerCatalog).map(([key, offer]) => `
    <div class="card soft" style="margin-bottom:10px; ${game.selectedOffer === key ? 'border-color: var(--cyan);' : ''}">
      <div class="mini">${offer.lane}</div>
      <h3>${offer.name}</h3>
      <p class="muted">${offer.tagline}</p>
    </div>
  `).join('');
}

function renderOfferList() {
  const list = document.getElementById('offerList');
  list.innerHTML = Object.entries(offerCatalog).map(([key, offer]) => `
    <label class="check"><input type="radio" name="offerChoice" ${game.selectedOffer === key ? 'checked' : ''} onchange="selectOffer('${key}')" /> <div><strong>${offer.name}</strong><br><span class="muted">${offer.tagline}</span></div></label>
  `).join('');
}

function selectOffer(key) {
  game.selectedOffer = key;
  renderOfferDeck();
}

function scoreOfferMatch() {
  if (!game.selectedProspect || !game.selectedOffer) {
    document.getElementById('offerFeedback').innerHTML = '<span class="danger">Select a prospect and one offer first.</span>';
    return;
  }
  const p = prospects[game.selectedProspect];
  const reason = document.getElementById('offerReason').value.trim();
  if (game.selectedOffer === p.bestOffer) {
    document.getElementById('offerFeedback').innerHTML = `<span class="success">Correct lead offer: ${offerCatalog[p.bestOffer].name}.</span><p class="muted">Good match. ${reason ? 'Your reasoning is saved.' : 'Add a short reason to strengthen the exercise.'}</p>`;
    xp(14);
    game.coins += 5;
    game.badges.add('Offer Match');
    game.stageFlags.offer = true;
  } else {
    document.getElementById('offerFeedback').innerHTML = `<span class="warn">Not the best first offer.</span><p class="muted">Better fit: ${offerCatalog[p.bestOffer].name}. This prospect is signaling a pivot.</p>`;
    xp(4);
    game.stageFlags.offer = true;
  }
  renderHUD();
}

function resetOfferMatch() {
  game.selectedOffer = '';
  document.getElementById('offerReason').value = '';
  document.getElementById('offerFeedback').textContent = 'Choose one lead offer and lock it in.';
  renderOfferDeck();
  renderOfferList();
  renderHUD();
}

function renderFitChecks() {
  const box = document.getElementById('fitChecklist');
  box.innerHTML = fitStatements.map((text, idx) => `
    <label class="check"><input type="checkbox" ${game.fitChecks.has(idx) ? 'checked' : ''} onchange="toggleFit(${idx}, this.checked)" /> <div>${text}</div></label>
  `).join('');
  updateFitScore();
}

function toggleFit(idx, checked) {
  if (checked) {
    game.fitChecks.add(idx);
    xp(2);
  } else {
    game.fitChecks.delete(idx);
  }
  updateFitScore();
}

function updateFitScore() {
  const score = game.fitChecks.size;
  document.getElementById('fitScore').textContent = `${score} / 6`;
  const verdict = document.getElementById('fitVerdict');
  if (!game.selectedProspect) {
    verdict.textContent = 'No prospect selected';
    verdict.className = 'danger';
  } else if (score >= 5) {
    verdict.textContent = 'Strong practical fit';
    verdict.className = 'success';
    game.stageFlags.fit = true;
  } else if (score >= 4) {
    verdict.textContent = 'Usable fit, but verify need';
    verdict.className = 'warn';
    game.stageFlags.fit = true;
  } else {
    verdict.textContent = 'Weak first target for this offer';
    verdict.className = 'danger';
    game.stageFlags.fit = score > 0;
  }
  renderHUD();
}

function renderQuestions() {
  const list = document.getElementById('questionList');
  list.innerHTML = questionBank.map(q => {
    const checked = game.chosenQuestions.has(q);
    const locked = !checked && game.chosenQuestions.size >= 3;
    return `<label class="question-card ${locked ? 'locked' : ''}">
      <input type="checkbox" ${checked ? 'checked' : ''} ${locked ? 'disabled' : ''} onchange="toggleQuestion('${q.replace(/'/g, "\\'")}', this.checked)" />
      <div>${q}</div>
    </label>`;
  }).join('');
  document.getElementById('questionCount').textContent = `${game.chosenQuestions.size} / 3 selected`;
}

function toggleQuestion(q, checked) {
  if (checked) {
    if (game.chosenQuestions.size >= 3) return;
    game.chosenQuestions.add(q);
  } else {
    game.chosenQuestions.delete(q);
  }
  renderQuestions();
}

function resetQuestions() {
  game.chosenQuestions.clear();
  game.foundClues = [];
  renderQuestions();
  resetDiscoveryOutputs();
  renderHUD();
}

function resetDiscoveryOutputs() {
  document.getElementById('clueResults').innerHTML = '<span class="muted">Select a prospect and ask up to 3 questions to reveal hidden details.</span>';
  document.getElementById('coachLog').textContent = 'No questions asked yet.';
}

function revealClues() {
  if (!game.selectedProspect) {
    document.getElementById('clueResults').innerHTML = '<p class="danger">Pick a prospect first.</p>';
    return;
  }
  const p = prospects[game.selectedProspect];
  const chosen = [...game.chosenQuestions];
  if (!chosen.length) {
    document.getElementById('clueResults').innerHTML = '<p class="danger">Choose at least 1 question first.</p>';
    return;
  }
  game.foundClues = p.hidden.filter(item => item.trigger.some(t => chosen.includes(t)));
  let html = `<div class="call-script"><strong>Questions asked:</strong>\n- ${chosen.join('\n- ')}</div>`;
  if (game.foundClues.length) {
    html += `<div class="card soft" style="margin-top:12px;"><div class="mini">Hidden info uncovered</div>${game.foundClues.map(f => `<p><strong>${f.topic}:</strong> ${f.text}</p>`).join('')}</div>`;
    xp(game.foundClues.length * 8);
    game.coins += game.foundClues.length * 2;
    if (game.foundClues.length >= 3) game.badges.add('Sharp Questions');
    game.stageFlags.clues = true;
  } else {
    html += `<div class="card soft" style="margin-top:12px;"><p class="danger">No high-value clues uncovered. Aim harder at workflow, urgency, and buyer concern.</p></div>`;
  }
  const missed = p.hidden.length - game.foundClues.length;
  document.getElementById('clueResults').innerHTML = html;
  document.getElementById('coachLog').textContent = `You uncovered ${game.foundClues.length} clue(s) and missed ${missed}. Better question discipline usually beats asking more.`;
  renderHUD();
}

function renderObjections() {
  const list = document.getElementById('objectionList');
  if (!game.selectedProspect) {
    list.innerHTML = '<p class="muted">Pick a prospect first.</p>';
    return;
  }
  const p = prospects[game.selectedProspect];
  list.innerHTML = p.objections.map((o, idx) => {
    const checked = game.chosenObjections.has(idx);
    const locked = !checked && game.chosenObjections.size >= 3;
    return `<label class="objection-card ${locked ? 'locked' : ''}">
      <input type="checkbox" ${checked ? 'checked' : ''} ${locked ? 'disabled' : ''} onchange="toggleObjection(${idx}, this.checked)" />
      <div>${o.objection}</div>
    </label>`;
  }).join('');
  document.getElementById('objectionCount').textContent = `${game.chosenObjections.size} / 3 selected`;
}

function toggleObjection(idx, checked) {
  if (checked) {
    if (game.chosenObjections.size >= 3) return;
    game.chosenObjections.add(idx);
  } else {
    game.chosenObjections.delete(idx);
  }
  renderObjections();
}

function resetObjections() {
  game.chosenObjections.clear();
  game.revealedRebuttals = [];
  renderObjections();
  resetRebuttalOutputs();
  renderHUD();
}

function resetRebuttalOutputs() {
  document.getElementById('rebuttalResults').innerHTML = '<span class="muted">Pick objections to build your rebuttal pack.</span>';
}

function revealRebuttals() {
  if (!game.selectedProspect) return;
  const p = prospects[game.selectedProspect];
  const chosen = [...game.chosenObjections];
  if (!chosen.length) {
    document.getElementById('rebuttalResults').innerHTML = '<p class="danger">Choose at least 1 objection first.</p>';
    return;
  }
  game.revealedRebuttals = chosen.map(i => p.objections[i]);
  document.getElementById('rebuttalResults').innerHTML = `<div class="card soft"><div class="mini">Prepared rebuttal pack</div>${game.revealedRebuttals.map(item => `<p><strong>Objection:</strong> ${item.objection}<br><strong>Good response:</strong> ${item.good}</p>`).join('')}</div>`;
  xp(game.revealedRebuttals.length * 6);
  if (game.revealedRebuttals.length >= 3) game.badges.add('Rebuttal Ready');
  game.stageFlags.objections = true;
  renderHUD();
}

function generateOutreach() {
  const prospect = document.getElementById('outreachName').value || game.selectedProspect || 'your team';
  const oneLine = document.getElementById('oneLine').value || 'We help teams clean up how work gets seen and moved.';
  const pain = document.getElementById('leadPain').value || 'key updates get scattered';
  const angle = document.getElementById('openingAngle').value || 'how your team handles work coordination today';
  const cta = document.getElementById('ctaText').value || 'If helpful, I can show you a short example and see whether it maps to your workflow.';
  document.getElementById('outreachDraft').textContent = `Hi ${prospect},\n\nI’m reaching out because I’ve been thinking about ${angle}. For teams in your position, ${pain}.\n\nWe’ve been building a practical offer around this. ${oneLine}\n\n${cta}\n\nBest,`;
  game.stageFlags.plan = true;
  xp(10);
  game.badges.add('Contact Draft');
  renderHUD();
}

function generateCallScript() {
  const buyerRole = document.getElementById('buyerRole').value || 'owner or office manager';
  const pain = document.getElementById('leadPain').value || 'status updates get scattered';
  const value = document.getElementById('leadValue').value || 'a cleaner shared view of work';
  document.getElementById('callPath').textContent = `1. Start with the pain.\n"I work with teams where ${pain}."\n\n2. Anchor to buyer.\n"Usually that hits the ${buyerRole} first because they lose visibility."\n\n3. State value simply.\n"The goal is ${value}."\n\n4. Ask one strong discovery question.\n"Where does that usually break down today?"\n\n5. Close lightly.\n"If useful, I can show you a 2-minute example and you can tell me if it maps to your team."`;
  game.stageFlags.plan = true;
  xp(10);
  renderHUD();
}

function spinFlavorText() {
  const line = flavorLines[Math.floor(Math.random() * flavorLines.length)];
  document.getElementById('arcadeFlavor').textContent = line;
  xp(1);
}

function playCoachTaunt() {
  const line = coachTaunts[Math.floor(Math.random() * coachTaunts.length)];
  document.getElementById('arcadeFlavor').textContent = line;
}

function prospectScoreValue() { return game.selectedProspect ? 12 : 0; }
function offerScoreValue() {
  if (!game.selectedProspect || !game.selectedOffer) return 0;
  return prospects[game.selectedProspect].bestOffer === game.selectedOffer ? 18 : 6;
}
function fitScoreValue() { return Math.min(18, game.fitChecks.size * 3); }
function clueScoreValue() { return Math.min(24, game.foundClues.length * 6); }
function prepScoreValue() {
  let score = Math.min(12, game.revealedRebuttals.length * 4);
  const fields = ['oneLine','leadPain','leadValue','openingAngle','ctaText'];
  score += Math.min(12, fields.filter(id => document.getElementById(id).value.trim()).length * 2.4);
  return Math.round(score);
}
function bonusScoreValue() {
  let bonus = Math.min(8, game.badges.size * 2);
  if (game.streak >= 2) bonus += 2;
  return Math.min(10, bonus);
}
function totalScore() {
  return Math.min(100, prospectScoreValue() + offerScoreValue() + fitScoreValue() + clueScoreValue() + prepScoreValue() + bonusScoreValue());
}

function renderScoreboard() {
  document.getElementById('scoreProspect').textContent = prospectScoreValue();
  document.getElementById('scoreOffer').textContent = offerScoreValue();
  document.getElementById('scoreFit').textContent = fitScoreValue();
  document.getElementById('scoreClues').textContent = clueScoreValue();
  document.getElementById('scorePrep').textContent = prepScoreValue();
  document.getElementById('scoreBonus').textContent = bonusScoreValue();
  const total = totalScore();
  const rank = rankFromScore(total);
  document.getElementById('finalRank').textContent = rank;
  document.getElementById('finalRankText').textContent = {
    S: 'Elite. You matched the right offer and handled the scenario like a disciplined operator.',
    A: 'Strong. You are qualifying well and selling with good control.',
    B: 'Solid. Good foundation, but tighten either fit, clues, or plan quality.',
    C: 'Usable. Better than guessing, but still needs sharpening before live outreach.',
    D: 'Early stage. You need stronger fit discipline and offer matching.'
  }[rank];
  const summary = [];
  summary.push(`Prospect: ${game.selectedProspect || 'None selected'}`);
  if (game.selectedProspect) summary.push(`Best offer: ${offerCatalog[prospects[game.selectedProspect].bestOffer].name}`);
  if (game.selectedOffer) summary.push(`Your chosen offer: ${offerCatalog[game.selectedOffer].name}`);
  summary.push(`Clues uncovered: ${game.foundClues.length}`);
  summary.push(`Objections prepared: ${game.revealedRebuttals.length}`);
  summary.push(`Badges earned: ${[...game.badges].join(', ') || 'None yet'}`);
  document.getElementById('coachSummary').textContent = summary.join('\n');
}

function startQuest() {
  game.selectedProspect = '';
  game.selectedOffer = '';
  game.fitChecks.clear();
  game.chosenQuestions.clear();
  game.foundClues = [];
  game.chosenObjections.clear();
  game.revealedRebuttals = [];
  game.xp = 0;
  game.coins = 0;
  game.streak = 0;
  game.badges.clear();
  game.stageFlags = { prospect:false, offer:false, fit:false, clues:false, objections:false, plan:false };
  document.querySelectorAll('textarea, input').forEach(el => el.value = '');
  renderProspects();
  renderOfferDeck();
  renderOfferList();
  renderFitChecks();
  renderQuestions();
  renderObjections();
  document.getElementById('briefName').textContent = 'Select a prospect';
  document.getElementById('briefSummary').textContent = 'Once you select a prospect, the mission briefing will appear here.';
  document.getElementById('briefTags').innerHTML = '';
  document.getElementById('offerFeedback').textContent = 'Choose one lead offer and lock it in.';
  resetDiscoveryOutputs();
  resetRebuttalOutputs();
  document.getElementById('outreachDraft').textContent = 'Generate a draft after filling in the plan.';
  document.getElementById('callPath').textContent = 'Generate a call path when ready.';
  document.getElementById('arcadeFlavor').textContent = 'Hit “Spin hype line” for a little chaos.';
  openTab('choose');
  renderHUD();
}

function loadDemoState() {
  startQuest();
  selectProspect('North Pine Heating & Air');
  selectOffer('dispatchflow');
  document.getElementById('offerReason').value = 'This is a true field-service prospect with office-to-tech visibility pain.';
  scoreOfferMatch();
  [0,1,2,3,4].forEach(i => game.fitChecks.add(i));
  renderFitChecks();
  ['Where does job status usually live today — software, text threads, whiteboards, or a mix?','How often does the office have to call or text techs just to get a status update?','When you look at software, what usually worries you most: cost, rollout effort, training, or complexity?'].forEach(q => game.chosenQuestions.add(q));
  renderQuestions();
  revealClues();
  [0,1,2].forEach(i => game.chosenObjections.add(i));
  renderObjections();
  revealRebuttals();
  document.getElementById('oneLine').value = 'DispatchFlow gives small HVAC teams one clean place to intake jobs, assign techs, track status, and close work without spreadsheet chaos.';
  document.getElementById('leadPain').value = 'the office often cannot see whether a job is truly on site, delayed, waiting, or done without chasing techs';
  document.getElementById('leadValue').value = 'one shared office-to-field view of jobs in motion';
  document.getElementById('openingAngle').value = 'how your team handles live field status and office visibility';
  document.getElementById('ctaText').value = 'If helpful, I can show you a 2-minute example and see whether it maps to your workflow.';
  document.getElementById('outreachName').value = 'North Pine Heating & Air';
  document.getElementById('buyerRole').value = 'owner or office manager';
  generateOutreach();
  generateCallScript();
  openTab('score');
}

function saveSession() {
  const session = {
    game: {
      selectedProspect: game.selectedProspect,
      selectedOffer: game.selectedOffer,
      fitChecks: [...game.fitChecks],
      chosenQuestions: [...game.chosenQuestions],
      foundClues: game.foundClues,
      chosenObjections: [...game.chosenObjections],
      revealedRebuttals: game.revealedRebuttals,
      xp: game.xp,
      coins: game.coins,
      streak: game.streak,
      badges: [...game.badges]
    },
    fields: {
      offerReason: document.getElementById('offerReason').value,
      fitReason: document.getElementById('fitReason').value,
      oneLine: document.getElementById('oneLine').value,
      leadPain: document.getElementById('leadPain').value,
      leadValue: document.getElementById('leadValue').value,
      openingAngle: document.getElementById('openingAngle').value,
      ctaText: document.getElementById('ctaText').value,
      outreachName: document.getElementById('outreachName').value,
      buyerRole: document.getElementById('buyerRole').value,
      arcadeFlavor: document.getElementById('arcadeFlavor').textContent,
      outreachDraft: document.getElementById('outreachDraft').textContent,
      callPath: document.getElementById('callPath').textContent
    }
  };
  localStorage.setItem('sales_quest_arcade_v1', JSON.stringify(session));
  alert('Progress saved on this device.');
}

function restoreSession() {
  const raw = localStorage.getItem('sales_quest_arcade_v1');
  if (!raw) { alert('No saved session found.'); return; }
  const session = JSON.parse(raw);
  startQuest();
  game.selectedProspect = session.game.selectedProspect || '';
  game.selectedOffer = session.game.selectedOffer || '';
  game.fitChecks = new Set(session.game.fitChecks || []);
  game.chosenQuestions = new Set(session.game.chosenQuestions || []);
  game.foundClues = session.game.foundClues || [];
  game.chosenObjections = new Set(session.game.chosenObjections || []);
  game.revealedRebuttals = session.game.revealedRebuttals || [];
  game.xp = session.game.xp || 0;
  game.coins = session.game.coins || 0;
  game.streak = session.game.streak || 0;
  game.badges = new Set(session.game.badges || []);
  renderProspects();
  if (game.selectedProspect) renderBrief();
  renderOfferDeck();
  renderOfferList();
  renderFitChecks();
  renderQuestions();
  renderObjections();
  document.getElementById('offerReason').value = session.fields.offerReason || '';
  document.getElementById('fitReason').value = session.fields.fitReason || '';
  document.getElementById('oneLine').value = session.fields.oneLine || '';
  document.getElementById('leadPain').value = session.fields.leadPain || '';
  document.getElementById('leadValue').value = session.fields.leadValue || '';
  document.getElementById('openingAngle').value = session.fields.openingAngle || '';
  document.getElementById('ctaText').value = session.fields.ctaText || '';
  document.getElementById('outreachName').value = session.fields.outreachName || '';
  document.getElementById('buyerRole').value = session.fields.buyerRole || '';
  document.getElementById('arcadeFlavor').textContent = session.fields.arcadeFlavor || 'Hit “Spin hype line” for a little chaos.';
  document.getElementById('outreachDraft').textContent = session.fields.outreachDraft || 'Generate a draft after filling in the plan.';
  document.getElementById('callPath').textContent = session.fields.callPath || 'Generate a call path when ready.';
  renderHUD();
}

function downloadSession() {
  const lines = [];
  lines.push('AeroVista Sales Quest Arcade Session');
  lines.push('');
  lines.push(`Prospect: ${game.selectedProspect || ''}`);
  lines.push(`Chosen Offer: ${game.selectedOffer ? offerCatalog[game.selectedOffer].name : ''}`);
  lines.push(`Best Offer: ${game.selectedProspect ? offerCatalog[prospects[game.selectedProspect].bestOffer].name : ''}`);
  lines.push(`XP: ${game.xp}`);
  lines.push(`Coins: ${game.coins}`);
  lines.push(`Rank: ${rankFromScore(totalScore())}`);
  lines.push(`Badges: ${[...game.badges].join(', ')}`);
  lines.push('');
  lines.push('Outreach Draft:');
  lines.push(document.getElementById('outreachDraft').textContent || '');
  lines.push('');
  lines.push('Call Path:');
  lines.push(document.getElementById('callPath').textContent || '');
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sales_quest_arcade_session.txt';
  a.click();
  URL.revokeObjectURL(a.href);
}

renderTabs();
startQuest();
