const offerCatalog = {
  dispatchflow: {
    name: 'DispatchFlow',
    lane: 'Field Service / Mobile Ops',
    tagline: 'Intake, assign, track, and close field work in one cleaner flow.'
  },
  visibility: {
    name: 'Visibility Layer',
    lane: 'Ops / Leadership Reporting',
    tagline: 'Executive and manager visibility across performance, bottlenecks, and trends.'
  },
  training: {
    name: 'Training Hub',
    lane: 'Onboarding / Enablement',
    tagline: 'Turn tribal knowledge into a cleaner onboarding and training system.'
  },
  brandweb: {
    name: 'Brand Presence Refresh',
    lane: 'Web / Brand Upgrade',
    tagline: 'Upgrade how the business looks online so capability is easier to trust.'
  },
  projectflow: {
    name: 'ProjectFlow',
    lane: 'Project / Install Visibility',
    tagline: 'Track milestones, handoffs, and install progress for longer-running work.'
  }
};

const fitStatements = [
  'They dispatch real field work.',
  'They likely use phone, text, email, or paper for status updates.',
  'They probably have an office/admin person coordinating work.',
  'Speed and missed updates matter to revenue or customer experience.',
  'A mobile-friendly workflow would clearly help them.',
  'They are small enough that a practical tool is easier to sell than enterprise software.'
];

const questionBank = [
  'How are you currently tracking jobs once they come in?',
  'Where does job status usually live today — software, text threads, whiteboards, or a mix?',
  'What tends to fall through the cracks most often: scheduling, updates, notes, or follow-through?',
  'If you could clean up one part of the dispatch process first, what would it be?',
  'Do your techs update job status from the field in a consistent way today?',
  'How often does the office have to call or text techs just to get a status update?',
  'What happens when updates are late or missing?',
  'How much does dispatch confusion affect customers or repeat business?',
  'When you look at software, what usually worries you most: cost, rollout effort, training, or complexity?',
  'Who usually assigns work each morning?',
  'Do you have after-hours or emergency calls that are harder to track?',
  'How do notes and photos make their way back to the office today?'
];

const prospects = {
  'North Pine Heating & Air': {
    fit: 'strong',
    bestOffer: 'dispatchflow',
    summary: 'Local HVAC company with 8 field techs, 2 office staff, emergency calls, maintenance visits, and install follow-ups.',
    tags: ['Strong fit', 'HVAC', '8 techs', 'Office + field'],
    hidden: [
      { topic: 'Current workflow', trigger: ['How are you currently tracking jobs once they come in?','Where does job status usually live today — software, text threads, whiteboards, or a mix?'], text: 'They use a basic invoicing tool, but real status updates still happen through calls, memory, and text threads.' },
      { topic: 'Biggest pain', trigger: ['What tends to fall through the cracks most often: scheduling, updates, notes, or follow-through?','If you could clean up one part of the dispatch process first, what would it be?'], text: 'The office often knows a tech was assigned, but not whether the job is actually on site, delayed, waiting on parts, or done.' },
      { topic: 'Mobile need', trigger: ['Do your techs update job status from the field in a consistent way today?','How often does the office have to call or text techs just to get a status update?'], text: 'Techs do not have a standard mobile update flow. The office spends a lot of time chasing simple status confirmations.' },
      { topic: 'Buyer concern', trigger: ['When you look at software, what usually worries you most: cost, rollout effort, training, or complexity?'], text: 'The owner is worried about adding something too complicated for a small team.' },
      { topic: 'Urgency', trigger: ['What happens when updates are late or missing?','How much does dispatch confusion affect customers or repeat business?'], text: 'Missed or delayed updates make the company look disorganized and create avoidable customer frustration.' }
    ],
    objections: [
      { objection: 'We already have a system.', good: 'A lot of teams have a core system, but still manage live job status through calls and texts. The question is whether the current setup gives a clean real-time workflow view for office and field together.' },
      { objection: 'We’re too small for something complicated.', good: 'Small teams are exactly why this should stay simple. The goal is not heavy software. It is one cleaner operating flow for intake, assignment, and status updates.' },
      { objection: 'My techs won’t use it.', good: 'The field side has to be simple enough that a tech can update status in seconds, not stop and type a report every time.' },
      { objection: 'We do fine with text messages.', good: 'Texting works until the office needs one shared view. The issue is not whether texting works at all. It is whether it gives leadership clean visibility without constant chasing.' }
    ]
  },
  'Lake City Electric': {
    fit: 'strong',
    bestOffer: 'dispatchflow',
    summary: 'Small electrical contractor with service calls, estimate visits, install jobs, and a supervisor assigning work each morning.',
    tags: ['Strong fit', 'Electrical', 'Service calls', 'Manual assign'],
    hidden: [
      { topic: 'Current workflow', trigger: ['How are you currently tracking jobs once they come in?','Who usually assigns work each morning?'], text: 'The supervisor assigns work manually every morning, and the day gets messy once changes start happening in real time.' },
      { topic: 'Biggest pain', trigger: ['What tends to fall through the cracks most often: scheduling, updates, notes, or follow-through?','How do notes and photos make their way back to the office today?'], text: 'Notes from the field often come back late, which affects invoicing and follow-up scheduling.' },
      { topic: 'Mobile need', trigger: ['Do your techs update job status from the field in a consistent way today?'], text: 'Some techs text updates, some call, and some wait until the end of the day.' },
      { topic: 'Buyer concern', trigger: ['When you look at software, what usually worries you most: cost, rollout effort, training, or complexity?'], text: 'The owner does not want a long rollout or anything that feels like enterprise software.' },
      { topic: 'Urgency', trigger: ['What happens when updates are late or missing?'], text: 'The office sometimes cannot tell if a job is running long until the customer calls asking for an ETA.' }
    ],
    objections: [
      { objection: 'We already have a system.', good: 'The real question is whether it covers the live handoff between office and field cleanly, or whether updates still depend on texting and memory.' },
      { objection: 'We’re too busy to change anything.', good: 'Keep the first phase narrow. The idea is to solve one part of the workflow, not force a big process change all at once.' },
      { objection: 'We can just text each other.', good: 'Text threads are hard to search, hard to standardize, and hard for the office to turn into a clear operating view.' },
      { objection: 'We don’t need another tool.', good: 'If leadership still has weak visibility today, there may be a gap worth solving.' }
    ]
  },
  'Timberline Plumbing': {
    fit: 'strong',
    bestOffer: 'dispatchflow',
    summary: 'Regional plumbing business with mixed residential and commercial calls, 5 vans, after-hours service, and scattered text updates.',
    tags: ['Strong fit', 'Plumbing', '5 vans', 'After-hours'],
    hidden: [
      { topic: 'Current workflow', trigger: ['Where does job status usually live today — software, text threads, whiteboards, or a mix?','Do you have after-hours or emergency calls that are harder to track?'], text: 'They use a mix of whiteboard planning, phone calls, and texts, especially after-hours.' },
      { topic: 'Biggest pain', trigger: ['What tends to fall through the cracks most often: scheduling, updates, notes, or follow-through?'], text: 'After-hours and follow-up jobs are the easiest to lose track of.' },
      { topic: 'Mobile need', trigger: ['How often does the office have to call or text techs just to get a status update?'], text: 'The office spends too much time checking whether a van is still on a job or heading to the next one.' },
      { topic: 'Buyer concern', trigger: ['When you look at software, what usually worries you most: cost, rollout effort, training, or complexity?'], text: 'They are interested in better visibility but skeptical of paying for features they will never use.' },
      { topic: 'Urgency', trigger: ['How much does dispatch confusion affect customers or repeat business?'], text: 'They have had a few customer complaints tied directly to unclear arrival windows and weak follow-up communication.' }
    ],
    objections: [
      { objection: 'It sounds expensive.', good: 'The first pass should solve a visible pain without forcing a huge system. The value comes from reducing missed updates and wasted coordination time.' },
      { objection: 'We’ve made it this far without it.', good: 'The question is whether a cleaner workflow would save enough time and frustration to be worth it.' },
      { objection: 'My guys are not going to type a bunch of notes.', good: 'A good field flow keeps updates simple: status change, short note if needed, and done.' },
      { objection: 'We only need this for emergencies.', good: 'Emergency visibility is a valid starting point. Once a team sees the benefit there, it often makes sense to extend the same clarity to standard service work too.' }
    ]
  },
  'CDA Custom Cabinets': {
    fit: 'maybe',
    bestOffer: 'projectflow',
    summary: 'Small shop doing design, fabrication, and scheduled installs. Some field activity, but most work happens in-shop and project timelines are longer.',
    tags: ['Maybe fit', 'Custom work', 'Project-based', 'Install coordination'],
    hidden: [
      { topic: 'Current workflow', trigger: ['How are you currently tracking jobs once they come in?'], text: 'Their process is more project-based than service-call based, with long lead times and fewer same-day dispatch decisions.' },
      { topic: 'Biggest pain', trigger: ['What tends to fall through the cracks most often: scheduling, updates, notes, or follow-through?'], text: 'Install coordination can get messy, but the bigger pain is often project visibility and milestone tracking rather than live dispatch.' },
      { topic: 'Offer fit', trigger: ['If you could clean up one part of the dispatch process first, what would it be?'], text: 'They may not even describe their work as dispatch, which is a clue this is not the perfect first offer.' }
    ],
    objections: [
      { objection: 'This doesn’t really sound like us.', good: 'If your work is more project-based than field-dispatch based, a visibility or project flow might be a better fit than DispatchFlow specifically.' },
      { objection: 'Our jobs run for weeks, not hours.', good: 'A service-call workflow would be the wrong shape. Milestone visibility is the better conversation.' },
      { objection: 'We don’t need dispatch software.', good: 'Then the right starting point is probably project visibility or install coordination.' }
    ]
  },
  'Evergreen Dental Group': {
    fit: 'weak',
    bestOffer: 'training',
    summary: 'Dental office with scheduling, front desk, and patient coordination pain, but no field technicians or dispatch-style mobile workflow.',
    tags: ['Weak fit', 'Office workflow', 'No field techs', 'Wrong lead offer'],
    hidden: [
      { topic: 'Current workflow', trigger: ['How are you currently tracking jobs once they come in?'], text: 'They have coordination pain, but it is front-desk and patient-flow related, not field dispatch.' },
      { topic: 'Better offer', trigger: ['If you could clean up one part of the dispatch process first, what would it be?'], text: 'A training workflow or support-ops dashboard would fit much better than DispatchFlow.' }
    ],
    objections: [
      { objection: 'We don’t dispatch field work.', good: 'Right, so DispatchFlow is not the right lead offer here. A workflow or training tool for patient coordination would make more sense.' },
      { objection: 'This sounds built for service trucks, not us.', good: 'Exactly. The right fit sounds closer to scheduling, front-desk process, or training consistency.' }
    ]
  },
  'North Ridge Boutique': {
    fit: 'poor',
    bestOffer: 'brandweb',
    summary: 'Retail clothing shop with 4 employees, no field crews, no dispatch, and no mobile service workflow.',
    tags: ['Poor fit', 'Retail', 'No field crew', 'Brand/web opportunity'],
    hidden: [
      { topic: 'Current workflow', trigger: ['How are you currently tracking jobs once they come in?'], text: 'There is no real dispatch-like process here. This is the wrong offer for this type of business.' },
      { topic: 'Better offer', trigger: ['What tends to fall through the cracks most often: scheduling, updates, notes, or follow-through?'], text: 'This is more likely a web presence or marketing clarity opportunity than an operations workflow sale.' }
    ],
    objections: [
      { objection: 'I don’t think this applies to us.', good: 'I agree. DispatchFlow would not be the right starting point for your business model.' },
      { objection: 'We don’t have field technicians.', good: 'Right, which means we should not pitch a field-service workflow here at all.' }
    ]
  }
};

const flavorLines = [
  'Signal found. Prospect lock acquired. Sell with discipline.',
  'Less spray-and-pray. More clean target selection.',
  'You are not chasing leads. You are qualifying truth.',
  'A good question is worth more than ten bad features.',
  'Operator mode: calm voice, sharp fit, no fluff.'
];

const coachTaunts = [
  'If you pitch DispatchFlow to a boutique again, I am revoking your coffee privileges.',
  'You do not need 14 questions. You need 3 good ones and a pulse.',
  'Remember: the goal is not to sound fancy. The goal is to sound useful.',
  'A bad-fit prospect is not a failure. It is a pivot opportunity.',
  'Sell the pain, not the platform cosplay.'
];
