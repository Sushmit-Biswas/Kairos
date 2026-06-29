// Mock data for demo — simulates Google Calendar/Gmail/Tasks data

export const mockTasks = [
  {
    id: 't1',
    title: 'Submit Q3 Marketing Report',
    description: 'Finalize the quarterly marketing performance analysis with KPIs, campaign ROI breakdown, and recommendations for Q4.',
    deadline: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(), // 2.5 hours from now
    priority: 'critical',
    riskScore: 92,
    status: 'in_progress',
    source: 'gmail',
    sourceDetail: 'From: boss@company.com — "Need this by EOD"',
    subtasks: [
      { id: 's1', title: 'Pull campaign data from analytics', done: true },
      { id: 's2', title: 'Calculate ROI per channel', done: true },
      { id: 's3', title: 'Write executive summary', done: false },
      { id: 's4', title: 'Add data visualizations', done: false },
      { id: 's5', title: 'Final review & submit', done: false },
    ],
    estimatedMinutes: 120,
    category: 'Work',
  },
  {
    id: 't2',
    title: 'Prepare Client Pitch Deck',
    description: 'Design and finalize the sales presentation for the Acme Corp partnership meeting.',
    deadline: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // 18 hours
    priority: 'high',
    riskScore: 71,
    status: 'not_started',
    source: 'calendar',
    sourceDetail: 'Meeting: Acme Corp Partnership Call — Tomorrow 2:00 PM',
    subtasks: [
      { id: 's6', title: 'Research Acme Corp background', done: false },
      { id: 's7', title: 'Draft slide structure', done: false },
      { id: 's8', title: 'Design key slides', done: false },
      { id: 's9', title: 'Practice delivery', done: false },
    ],
    estimatedMinutes: 180,
    category: 'Work',
  },
  {
    id: 't3',
    title: 'Pay Credit Card Bill',
    description: 'HDFC credit card payment due. Late fee: ₹500 + interest charges.',
    deadline: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
    priority: 'high',
    riskScore: 65,
    status: 'not_started',
    source: 'gmail',
    sourceDetail: 'From: alerts@hdfcbank.com — "Payment reminder"',
    subtasks: [],
    estimatedMinutes: 5,
    category: 'Finance',
    procrastinationCost: '₹500 late fee + 3.5% monthly interest on outstanding balance',
  },
  {
    id: 't4',
    title: 'Complete Database Assignment',
    description: 'DBMS Lab Assignment 5: ER diagrams and normalization exercises.',
    deadline: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(), // 36 hours
    priority: 'medium',
    riskScore: 45,
    status: 'not_started',
    source: 'manual',
    sourceDetail: 'Added manually',
    subtasks: [
      { id: 's10', title: 'Draw ER diagram for library system', done: false },
      { id: 's11', title: 'Normalize to 3NF', done: false },
      { id: 's12', title: 'Write SQL queries', done: false },
    ],
    estimatedMinutes: 90,
    category: 'Academic',
  },
  {
    id: 't5',
    title: 'Renew Gym Membership',
    description: 'Annual membership expires in 3 days. Early renewal saves 15%.',
    deadline: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 3 days
    priority: 'low',
    riskScore: 20,
    status: 'not_started',
    source: 'manual',
    sourceDetail: 'Added manually',
    subtasks: [],
    estimatedMinutes: 10,
    category: 'Personal',
  },
];

export const mockAgents = [
  {
    id: 'scout',
    name: 'Scout',
    emoji: '🔍',
    role: 'Deadline Hunter',
    description: 'Scans Gmail, Calendar, and Tasks for approaching deadlines and hidden commitments.',
    status: 'active',
    color: '#00cec9',
    lastAction: 'Found implicit deadline in email from boss@company.com: "Need this by EOD"',
    lastActionTime: '2 min ago',
    actionsToday: 12,
  },
  {
    id: 'strategist',
    name: 'Strategist',
    emoji: '🧠',
    role: 'Task Decomposer',
    description: 'Breaks tasks into sub-tasks, schedules focus blocks, and optimizes your calendar.',
    status: 'working',
    color: '#6c5ce7',
    lastAction: 'Created 5 sub-tasks for "Submit Q3 Marketing Report" and blocked 2 hours at 1 PM',
    lastActionTime: '5 min ago',
    actionsToday: 8,
  },
  {
    id: 'negotiator',
    name: 'Negotiator',
    emoji: '📧',
    role: 'Stakeholder Manager',
    description: 'Drafts deadline extension emails, status updates, and manages communication.',
    status: 'idle',
    color: '#feca57',
    lastAction: 'Drafted extension request for Q3 Report — awaiting your approval',
    lastActionTime: '10 min ago',
    actionsToday: 3,
  },
  {
    id: 'guardian',
    name: 'Guardian',
    emoji: '🛡️',
    role: 'Focus Protector',
    description: 'Activates Ghost Mode, protects focus time, blocks distractions.',
    status: 'idle',
    color: '#ff6b6b',
    lastAction: 'Recommended activating Ghost Mode — deadline in 2.5 hours',
    lastActionTime: '1 min ago',
    actionsToday: 5,
  },
];

export const mockActivityFeed = [
  { icon: '🔍', agent: 'Scout', text: 'Discovered <strong>implicit deadline</strong> in email from boss@company.com: "Need the Q3 report by end of day"', time: '2m ago', type: 'discovery' },
  { icon: '🧠', agent: 'Strategist', text: 'Decomposed "Submit Q3 Marketing Report" into <strong>5 actionable sub-tasks</strong>', time: '5m ago', type: 'action' },
  { icon: '🧠', agent: 'Strategist', text: 'Blocked <strong>2 hours (1:00–3:00 PM)</strong> on your Google Calendar for report work', time: '5m ago', type: 'action' },
  { icon: '📧', agent: 'Negotiator', text: 'Drafted deadline extension email for Q3 Report → <strong>Awaiting your approval</strong>', time: '10m ago', type: 'pending' },
  { icon: '🛡️', agent: 'Guardian', text: 'Risk Level CRITICAL for "Q3 Marketing Report" — recommending <strong>Ghost Mode</strong>', time: '1m ago', type: 'alert' },
  { icon: '🔍', agent: 'Scout', text: 'Scanned 24 emails, found <strong>3 implicit commitments</strong> with upcoming deadlines', time: '15m ago', type: 'discovery' },
  { icon: '🧠', agent: 'Strategist', text: 'Rescheduled "Team Standup" to create a <strong>focus block</strong> before the client pitch', time: '20m ago', type: 'action' },
  { icon: '🛡️', agent: 'Guardian', text: 'Detected 45 minutes spent on social media — <strong>nudge sent</strong>', time: '30m ago', type: 'alert' },
  { icon: '📧', agent: 'Negotiator', text: 'Sent status update to Acme Corp: <strong>"Pitch deck in progress, will share draft tonight"</strong>', time: '45m ago', type: 'sent' },
  { icon: '🔍', agent: 'Scout', text: 'Found calendar event requiring preparation: <strong>Acme Corp Partnership Call tomorrow at 2 PM</strong>', time: '1h ago', type: 'discovery' },
];

export const mockApprovals = [
  {
    id: 'a1',
    agent: 'Negotiator',
    agentEmoji: '📧',
    type: 'email_draft',
    title: 'Deadline Extension Request',
    description: 'The Negotiator has drafted an email to your manager requesting a 24-hour extension for the Q3 Marketing Report, citing the need for additional data validation.',
    preview: `Subject: Request for Extension — Q3 Marketing Report\n\nHi Sarah,\n\nI wanted to give you a heads-up that I'm working through the Q3 Marketing Report and want to ensure the data accuracy is top-notch. Would it be possible to extend the deadline by 24 hours to tomorrow EOD?\n\nI've completed the campaign analysis and ROI calculations — just need additional time for the executive summary and final data validation.\n\nBest regards`,
    recipient: 'sarah.manager@company.com',
    createdAt: '10 min ago',
  },
  {
    id: 'a2',
    agent: 'Strategist',
    agentEmoji: '🧠',
    type: 'calendar_change',
    title: 'Reschedule Team Standup',
    description: 'The Strategist wants to move your "Team Standup" from 2:00 PM to 4:30 PM to create a 2-hour uninterrupted focus block for the client pitch preparation.',
    createdAt: '20 min ago',
  },
];

export const mockBriefing = {
  greeting: "Good morning! Here's your crisis report for today.",
  kairosScore: 58,
  criticalItems: [
    {
      icon: '🚨',
      title: 'CRITICAL: Q3 Marketing Report',
      body: 'Due in 2.5 hours. You\'ve completed 2 of 5 sub-tasks. I\'ve blocked your calendar from 1–3 PM. The Negotiator has a backup extension email ready if needed.',
    },
    {
      icon: '💳',
      title: 'Payment Due: HDFC Credit Card',
      body: 'Due tonight. Missing this will cost you ₹500 in late fees plus 3.5% monthly interest. This takes 5 minutes — I recommend doing it right now.',
    },
  ],
  upcoming: [
    {
      icon: '📊',
      title: 'Client Pitch Deck — Tomorrow 2 PM',
      body: 'Acme Corp partnership meeting. You haven\'t started the pitch deck yet. I\'ve scheduled a 3-hour research and design block for tonight at 8 PM.',
    },
    {
      icon: '📚',
      title: 'Database Assignment — Due in 36 hours',
      body: 'DBMS Lab Assignment 5. Moderate complexity. I\'ve slotted 90 minutes tomorrow morning for this.',
    },
  ],
  recommendation: 'Today is high-pressure. I recommend activating Ghost Mode immediately to focus on the Q3 report. Pay your credit card bill during a 5-minute break. Tonight, tackle the pitch deck.',
};

export function getTimeRemaining(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;

  if (diff <= 0) return { text: 'OVERDUE', urgent: true, hours: 0, minutes: 0 };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let text = '';
  if (days > 0) text = `${days}d ${hours}h`;
  else if (hours > 0) text = `${hours}h ${minutes}m`;
  else text = `${minutes}m`;

  return { text, urgent: diff < 3 * 60 * 60 * 1000, hours: days * 24 + hours, minutes };
}
