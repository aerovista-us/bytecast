#!/usr/bin/env node
/**
 * Build offer-pack-data.json from aerovista_offer_pack markdown.
 * Run from repo root: node aerovista_offer_pack/scripts/build-offer-pack-data.js
 * Or from aerovista_offer_pack: node scripts/build-offer-pack-data.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_PATH = path.join(ROOT, 'app', 'data', 'offer-pack-data.json');
const OUT_DIR = path.join(ROOT, 'app', 'data');

function readFile(rel) {
  const p = path.join(ROOT, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

function parseSectionBasedMd(text, sectionHeading) {
  const sections = {};
  let current = null;
  let lines = [];
  const re = /^##\s+(.+)$/;
  for (const line of text.split('\n')) {
    const m = line.match(re);
    if (m) {
      if (current) sections[current] = lines.join('\n').trim();
      current = m[1].trim();
      lines = [];
    } else if (current) {
      lines.push(line);
    }
  }
  if (current) sections[current] = lines.join('\n').trim();
  return sections;
}

function parseListItems(block) {
  if (!block) return [];
  return block
    .split('\n')
    .map((l) => l.replace(/^-\s*/, '').replace(/\*\*([^*]+)\*\*:\s*/, '$1: ').trim())
    .filter(Boolean);
}

// Division folder -> { id, name } (from offer-pack order)
const DIVISION_ORDER = [
  { id: 'nexus', name: 'NeXuS TechWorks', tagline: 'Web + AI + Automation' },
  { id: 'skyforge', name: 'SkyForge Creative Studios', tagline: 'Interactive Web Experiences' },
  { id: 'echoverse', name: 'EchoVerse Audio', tagline: 'Music + Sound + Brand Audio' },
  { id: 'summit', name: 'Summit Learning', tagline: 'Training + SOP + Micro-Courses' },
  { id: 'lumina', name: 'Lumina Creative', tagline: 'Branding + Visual Kits' },
  { id: 'vespera', name: 'Vespera Publishing', tagline: 'Digital Products + Writing' },
  { id: 'horizon', name: 'Horizon Aerial & Visual', tagline: 'Drone + Photo + Property Media' },
];

// File base name (no .md) -> offer key for pricing/offer-pack alignment
const FILE_TO_OFFER_KEY = {
  launchpad: 'launchpad',
  'ops-dashboard-lite': 'ops-dashboard-lite',
  'automation-quickstart': 'automation-quickstart',
  'security-performance': 'security-performance',
  'quest-page': 'quest-page',
  'promo-minigame': 'promo-minigame',
  'event-booth-mode': 'event-booth-mode',
  'sonic-logo': 'sonic-logo',
  'podcast-pack': 'podcast-pack',
  'track-polish': 'track-polish',
  soundscapes: 'soundscapes',
  'sop-in-a-box': 'sop-in-a-box',
  'micro-training': 'micro-training',
  'ops-quality-pack': 'ops-quality-pack',
  'brand-kit-lite': 'brand-kit-lite',
  'social-drop-pack': 'social-drop-pack',
  'flyer-card-sprint': 'flyer-card-sprint',
  'lead-magnet-funnel': 'lead-magnet-funnel',
  'proposal-kit': 'proposal-kit',
  'newsletter-engine': 'newsletter-engine',
  'drone-mini': 'drone-mini',
  'progress-snapshot': 'progress-snapshot',
  'mapping-lite': 'mapping-lite',
};

function parseOfferCardMd(content, divisionId, offerKey) {
  const sections = parseSectionBasedMd(content, '##');
  const getList = (name) => parseListItems(sections[name] || '');
  const getText = (name) => (sections[name] || '').trim();
  const titleMatch = content.match(/^#\s+(.+?)(?:\s+—\s+Offer Card)?$/m);
  const title = titleMatch ? titleMatch[1].replace(/^[^—]+—\s*/, '').trim() : offerKey;
  return {
    id: `${divisionId}-${offerKey}`,
    key: offerKey,
    name: title,
    outcome: getText('Outcome'),
    includes: getList('Includes'),
    clientProvides: getList('Client provides'),
    exclusions: getList('Exclusions (unless quoted)').length ? getList('Exclusions (unless quoted)') : getList('Exclusions'),
    notes: getText('Notes'),
    upsells: getList('Upsells'),
    turnaround: '', // filled from offer-pack if needed
  };
}

function parseOfferPack() {
  const text = readFile('offer-pack.md');
  const divisions = [];
  let currentDiv = null;
  let currentOffers = [];
  const divRe = /^##\s+\d+\)\s+(.+?)\s+[—\-]\s+(.+)$/;
  const offerRe = /^###\s+[A-D]\)\s+(.+)$/;
  const lineRe = /^-\s+\*\*(.+?):\*\*\s*(.+)$/;

  for (const line of text.split('\n')) {
    const dm = line.match(divRe);
    if (dm) {
      if (currentDiv) {
        currentDiv.offersSummary = currentOffers;
        divisions.push(currentDiv);
      }
      const fullName = dm[1].trim();
      const divMeta = DIVISION_ORDER.find((d) => fullName.startsWith(d.name));
      currentDiv = divMeta ? { ...divMeta, offersSummary: [] } : { id: fullName.toLowerCase().replace(/\s+/g, '-'), name: fullName, tagline: dm[2].trim(), offersSummary: [] };
      currentOffers = [];
      continue;
    }
    const om = line.match(offerRe);
    if (om && currentDiv) {
      currentOffers.push({ name: om[1].trim(), includes: [], turnaround: '', clientProvides: [], upsells: [] });
      continue;
    }
    if (currentOffers.length && currentDiv) {
      const lm = line.match(lineRe);
      if (lm) {
        const key = lm[1].toLowerCase();
        const val = lm[2].trim();
        const o = currentOffers[currentOffers.length - 1];
        if (key === 'includes') o.includes = val.split(',').map((s) => s.trim());
        else if (key === 'turnaround') o.turnaround = val;
        else if (key === 'client provides') o.clientProvides = val.split(',').map((s) => s.trim());
        else if (key === 'upsells') o.upsells = val.split(',').map((s) => s.trim());
      }
    }
  }
  if (currentDiv) {
    currentDiv.offersSummary = currentOffers;
    divisions.push(currentDiv);
  }
  return divisions;
}

function loadDivisionCards() {
  const cards = {};
  for (const div of DIVISION_ORDER) {
    const dir = path.join(ROOT, 'divisions', div.id);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
    for (const f of files) {
      const offerKey = FILE_TO_OFFER_KEY[path.basename(f, '.md')] || path.basename(f, '.md').replace(/-/g, '_');
      const content = readFile(path.join('divisions', div.id, f));
      cards[`${div.id}-${offerKey}`] = parseOfferCardMd(content, div.id, offerKey);
    }
  }
  return cards;
}

// Offer name (from offer-pack) -> offer key for card lookup
const OFFER_NAME_TO_KEY = {
  nexus: {
    'LaunchPad Website (1-Page)': 'launchpad',
    'Business Ops Dashboard "Lite"': 'ops-dashboard-lite',
    'Automation QuickStart (n8n)': 'automation-quickstart',
    'Security & Performance Tune-Up': 'security-performance',
  },
  skyforge: {
    'Interactive Landing "Quest Page"': 'quest-page',
    'Promo Mini-Game (Web)': 'promo-minigame',
    'Event Booth Mode': 'event-booth-mode',
  },
  echoverse: {
    'Brand Sonic Logo (5–8 sec)': 'sonic-logo',
    'Podcast/YouTube Starter Audio Pack': 'podcast-pack',
    'Track Polish "Radio Clean"': 'track-polish',
    'Ambient Soundscapes for Spaces': 'soundscapes',
  },
  summit: {
    'SOP in a Box': 'sop-in-a-box',
    'Micro-Training Module (10–15 min)': 'micro-training',
    'Call Center / Ops Quality Pack': 'ops-quality-pack',
  },
  lumina: {
    'Brand Kit Lite': 'brand-kit-lite',
    'Social Drop Pack (30 posts)': 'social-drop-pack',
    'Flyer + Business Card Sprint': 'flyer-card-sprint',
  },
  vespera: {
    'Lead Magnet + Funnel Copy': 'lead-magnet-funnel',
    'Client-Facing Proposal Kit': 'proposal-kit',
    'Newsletter Engine (Monthly)': 'newsletter-engine',
  },
  horizon: {
    'Real Estate Drone Mini': 'drone-mini',
    'Property Progress Snapshot': 'progress-snapshot',
    'Mapping Lite': 'mapping-lite',
  },
};

function mergeOfferPackWithCards(offerPackDivs, cards) {
  const divisions = [];
  for (const div of offerPackDivs) {
    const offers = [];
    const nameToKey = OFFER_NAME_TO_KEY[div.id] || {};
    for (const sum of div.offersSummary || []) {
      let offerKey = nameToKey[sum.name];
      if (!offerKey) {
        const fk = Object.keys(FILE_TO_OFFER_KEY).find((k) => sum.name.toLowerCase().includes(k.replace(/-/g, ' ')));
        if (fk) offerKey = FILE_TO_OFFER_KEY[fk];
      }
      const offerId = offerKey ? `${div.id}-${offerKey}` : `${div.id}-${sum.name.toLowerCase().replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, '-').replace(/[""]/g, '')}`;
      let card = cards[offerId];
      if (!card) {
        card = {
          id: offerId,
          key: offerKey || offerId.replace(div.id + '-', ''),
          name: sum.name,
          outcome: '',
          includes: sum.includes || [],
          clientProvides: sum.clientProvides || [],
          exclusions: [],
          notes: '',
          upsells: sum.upsells || [],
          turnaround: sum.turnaround || '',
        };
      } else {
        if (sum.turnaround && !card.turnaround) card.turnaround = sum.turnaround;
        if (sum.includes && sum.includes.length && !card.includes.length) card.includes = sum.includes;
        if (sum.upsells && sum.upsells.length && !card.upsells.length) card.upsells = sum.upsells;
        if (sum.clientProvides && sum.clientProvides.length && !card.clientProvides.length) card.clientProvides = sum.clientProvides;
      }
      offers.push(card);
    }
    divisions.push({ id: div.id, name: div.name, tagline: div.tagline || '', offers });
  }
  return divisions;
}

function parsePricingGrid() {
  const text = readFile('pricing-grid.md');
  const byDivision = {};
  let currentDiv = null;
  let currentOffer = null;
  let currentTiers = null;
  const divRe = /^##\s+(.+)$/;
  const offerRe = /^-\s+\*\*(.+)\*\*$/;
  const tierRe = /^\s+-\s+(Good|Better|Best):\s*(.+)$/;

  for (const line of text.split('\n')) {
    const dm = line.match(divRe);
    if (dm && !line.includes('Pricing Grid')) {
      const title = dm[1].trim();
      if (title === 'Bundle Anchors') {
        currentDiv = '_bundles';
        currentOffer = null;
        byDivision[currentDiv] = {};
        continue;
      }
      const divMeta = DIVISION_ORDER.find((d) => title.startsWith(d.name));
      currentDiv = divMeta ? divMeta.id : title.toLowerCase().replace(/\s+/g, '-');
      if (!byDivision[currentDiv]) byDivision[currentDiv] = {};
      currentOffer = null;
      continue;
    }
    const om = line.match(offerRe);
    if (om && currentDiv) {
      currentOffer = om[1].trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      if (currentOffer.length > 40) currentOffer = currentOffer.slice(0, 40);
      currentTiers = { good: '', better: '', best: '' };
      byDivision[currentDiv][currentOffer] = currentTiers;
      continue;
    }
    const tm = line.match(tierRe);
    if (tm && currentTiers) {
      const tier = tm[1].toLowerCase();
      const desc = tm[2].trim();
      if (tier === 'good') currentTiers.good = desc;
      else if (tier === 'better') currentTiers.better = desc;
      else if (tier === 'best') currentTiers.best = desc;
    }
  }
  return byDivision;
}

function buildPricingForOffers(divisions, pricingByDivision) {
  const offerToPricing = {};
  for (const div of divisions) {
    const grid = pricingByDivision[div.id] || {};
    for (const offer of div.offers) {
      const key = offer.key || offer.id.replace(`${div.id}-`, '');
      let tiers = grid[key];
      if (!tiers) {
        const alt = Object.keys(grid).find((k) => offer.name.toLowerCase().includes(k.replace(/-/g, ' ')));
        if (alt) tiers = grid[alt];
      }
      if (tiers) offerToPricing[offer.id] = { good: tiers.good || '', better: tiers.better || '', best: tiers.best || '' };
    }
  }
  return { byDivision: pricingByDivision, byOfferId: offerToPricing };
}

function parseSalesPlaybook() {
  const text = readFile('sales/sales-playbook.md');
  const sections = parseSectionBasedMd(text, '##');
  const getList = (name) => parseListItems(sections[name] || '');
  const getText = (name) => (sections[name] || '').trim();
  const followUpRaw = sections['Follow-up templates'] || '';
  const followUps = [];
  const sameDay = followUpRaw.match(/### Follow-up \(same day\)\s*([\s\S]*?)(?=###|$)/);
  const twoDay = followUpRaw.match(/### Follow-up \(48 hours\)\s*([\s\S]*?)(?=###|$)/);
  if (sameDay) {
    const subj = sameDay[1].match(/Subject:\s*(.+?)(?:\n|$)/);
    const body = sameDay[1].match(/Body:\s*([\s\S]+?)(?=\n\n|$)/);
    followUps.push({ label: 'Same day', subject: subj ? subj[1].trim() : '', body: body ? body[1].trim() : '' });
  }
  if (twoDay) {
    const subj = twoDay[1].match(/Subject:\s*(.+?)(?:\n|$)/);
    const body = twoDay[1].match(/Body:\s*([\s\S]+?)(?=\n\n|$)/);
    followUps.push({ label: '48 hours', subject: subj ? subj[1].trim() : '', body: body ? body[1].trim() : '' });
  }
  return {
    pitch: getText('30-second baseline pitch'),
    qualification: getList('Qualification (5 questions)'),
    objections: getList('Objection handlers (short)'),
    closePattern: getList('Close pattern (simple)'),
    followUp: followUps,
  };
}

function parseDelivery() {
  const sopText = readFile('delivery/fulfillment-sop.md');
  const qaText = readFile('delivery/qa-checklists.md');
  const sopSections = parseSectionBasedMd(sopText, '##');
  const qaSections = parseSectionBasedMd(qaText, '##');
  return {
    phases: parseListItems(sopSections['Standard phases'] || ''),
    revisionPolicy: (sopSections['Revision policy (default)'] || '').trim().split('\n').map((l) => l.trim()).filter(Boolean),
    handoff: (sopSections['Standard handoff'] || '').trim().split('\n').map((l) => l.replace(/^-\s*/, '').trim()).filter(Boolean),
    qaChecklists: [
      { id: 'web', name: 'Web (LaunchPad / Quest Page / Mini-Game)', items: parseListItems(qaSections['Web (LaunchPad / Quest Page / Mini-Game)'] || '') },
      { id: 'audio', name: 'Audio (Sonic Logo / Podcast Pack / Track Polish)', items: parseListItems(qaSections['Audio (Sonic Logo / Podcast Pack / Track Polish)'] || '') },
      { id: 'design', name: 'Design (Brand Kit / Social Pack / Print)', items: parseListItems(qaSections['Design (Brand Kit / Social Pack / Print)'] || '') },
      { id: 'drone', name: 'Drone (Weather dependent)', items: parseListItems(qaSections['Drone (Weather dependent)'] || '') },
    ],
  };
}

function parseIntake() {
  const text = readFile('intake/client-intake-form.md');
  const sections = parseSectionBasedMd(text, '##');
  const formSections = [];
  for (const [title, body] of Object.entries(sections)) {
    if (title.startsWith('Contact') || title.startsWith('Project') || title.startsWith('Audience') || title.startsWith('Brand') || title.startsWith('Call') || title.startsWith('Constraints') || title.startsWith('Access') || title.startsWith('Notes')) {
      const fields = body.split('\n').map((l) => l.replace(/^-\s*/, '').trim()).filter(Boolean);
      formSections.push({ id: title.toLowerCase().replace(/\s+/g, '-'), title, fields });
    }
  }
  return { sections: formSections };
}

function parseBundles() {
  const text = readFile('bundles/bundles.md');
  const sections = parseSectionBasedMd(text, '##');
  const bundles = [];
  const b1 = sections['Bundle 1: New Business Launch'];
  const b2 = sections['Bundle 2: Creator/Podcast Starter'];
  const b3 = sections['Bundle 3: Real Estate Pro Kit'];
  if (b1) {
    const incl = b1.match(/\*\*Includes:\*\*\s*(.+?)(?=\s*\*\*|$)/s);
    const out = b1.match(/\*\*Outcome:\*\*\s*(.+?)$/s);
    bundles.push({ id: 'new-business-launch', name: 'New Business Launch', includes: incl ? incl[1].trim() : '', outcome: out ? out[1].trim() : '' });
  }
  if (b2) {
    const incl = b2.match(/\*\*Includes:\*\*\s*(.+?)(?=\s*\*\*|$)/s);
    const out = b2.match(/\*\*Outcome:\*\*\s*(.+?)$/s);
    bundles.push({ id: 'creator-podcast-starter', name: 'Creator/Podcast Starter', includes: incl ? incl[1].trim() : '', outcome: out ? out[1].trim() : '' });
  }
  if (b3) {
    const incl = b3.match(/\*\*Includes:\*\*\s*(.+?)(?=\s*\*\*|$)/s);
    const out = b3.match(/\*\*Outcome:\*\*\s*(.+?)$/s);
    bundles.push({ id: 'real-estate-pro-kit', name: 'Real Estate Pro Kit', includes: incl ? incl[1].trim() : '', outcome: out ? out[1].trim() : '' });
  }
  return bundles;
}

function parseOnePager() {
  const text = readFile('one-pager.md');
  const intro = text.match(/\*\*(.+?)\*\*/s);
  const terms = text.match(/\*\*Standard terms:\*\*\s*(.+?)$/m);
  const divBlocks = text.split(/(?=^##\s+)/m).filter((b) => b.trim().startsWith('##'));
  const divisions = divBlocks.map((b) => {
    const lines = b.trim().split('\n');
    const name = lines[0].replace(/^##\s+/, '').trim();
    const items = lines.slice(1).map((l) => l.replace(/^-\s*\*\*(.+?):\*\*\s*/, '$1: ').trim()).filter(Boolean);
    return { name, items };
  });
  const popularMatch = text.match(/### Popular bundles\s*([\s\S]+?)(?=\*\*Standard|$)/);
  const popularBundles = popularMatch ? parseListItems(popularMatch[1]) : [];
  return {
    intro: intro ? intro[1].trim() : 'Fast, clean, profitable work.',
    divisions,
    popularBundles,
    standardTerms: terms ? terms[1].trim() : '50% to schedule · two revision rounds · clear client-provided asset list.',
  };
}

function main() {
  try {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const offerPackDivs = parseOfferPack();
    const cards = loadDivisionCards();
    const divisions = mergeOfferPackWithCards(offerPackDivs, cards);
    const pricingByDivision = parsePricingGrid();
    const pricing = buildPricingForOffers(divisions, pricingByDivision);

    const data = {
      schema: 'offer-pack-v1',
      divisions,
      sales: parseSalesPlaybook(),
      delivery: parseDelivery(),
      intake: parseIntake(),
      pricing,
      bundles: parseBundles(),
      onePager: parseOnePager(),
      fulfillmentRules: [
        'Standard Intake Form for all divisions (goal, audience, assets, deadline)',
        'Two revision rounds included (protects margin)',
        'Clear "Client Provides" list per offer',
        'Fast close: 50% deposit to schedule, remainder on delivery',
      ],
    };

    const outDir = path.dirname(OUT_PATH);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(OUT_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log('Wrote', OUT_PATH);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
