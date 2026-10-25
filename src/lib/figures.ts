// Figure specs that more than one place draws: each project's figure on its page,
// and the same spec as a small glyph in the work rows, the case-study hero, the
// next-project panel and the share card (DESIGN_PLAN Step 11). Facts only from
// each case study's own text.
import type { FigSpec } from './figure';

export const figures: Record<string, FigSpec> = {
  'jayne-bandy-ai': {
    nodes: [
      { id: 'caller', title: 'Caller', note: 'rings the practice’s own number (Twilio)', at: [0, 0] },
      { id: 'voice', title: 'Voice layer', note: 'ElevenLabs: speech to text, turn-taking, the practice’s voice', n: 1, at: [1, 0] },
      { id: 'agent', title: 'Agent', note: 'GPT-5.5 following the reviewed script', kind: 'model', at: [2, 0] },
      { id: 'tools', title: 'Tools', note: 'find patient · find free slots · book, move or cancel · request callback', n: 2, at: [3, 0] },
      { id: 'practice', title: 'Practice system', note: 'CareStack · Core Practice · Dentally', at: [4, 0] },
      { id: 'sorry', title: 'Agent', note: 'apologises and says the team will call back', kind: 'model', at: [2, 1] },
      { id: 'callback', title: 'Callback request', note: 'logged for the practice team', at: [1, 1] },
    ],
    edges: [
      { from: 'caller', to: 'voice' },
      { from: 'voice', to: 'agent' },
      { from: 'agent', to: 'tools', kind: 'two' },
      { from: 'tools', to: 'practice', kind: 'two' },
      { from: 'tools', to: 'sorry', kind: 'fail', label: 'system down or slot just taken' },
      { from: 'sorry', to: 'callback', kind: 'fail' },
    ],
  },
  'sap-automation': {
    nodes: [
      { id: 'entries', title: 'Entries', note: 'invoices, reversals, contract locks', at: [0, 0] },
      { id: 'bot', title: 'Desktop bot', note: 'Power Automate Desktop', n: 1, at: [1, 0] },
      { id: 'sap', title: 'SAP', note: 'entered in the desktop client', at: [2, 0] },
      { id: 'person', title: 'Left for a person', note: 'logged, not guessed', kind: 'person', at: [1, 1] },
    ],
    edges: [
      { from: 'entries', to: 'bot' },
      { from: 'bot', to: 'sap' },
      { from: 'bot', to: 'person', kind: 'fail', label: 'unexpected screen' },
    ],
  },
  'ziaris': {
    nodes: [
      { id: 'roster', title: 'Roster', note: 'worker, participant, site', at: [0, 0] },
      { id: 'timesheet', title: 'Timesheet', note: 'approved hours', at: [1, 0] },
      { id: 'rules', title: 'Award rules', note: 'SCHADS rates and penalties, configured by admins', n: 1, at: [2, 0] },
      { id: 'pay', title: 'Pay and invoice', note: 'invoice by funding type', at: [3, 0] },
      { id: 'myob', title: 'MYOB', note: 'payroll and sales-journal export', at: [4, 0] },
    ],
    edges: [
      { from: 'roster', to: 'timesheet' },
      { from: 'timesheet', to: 'rules' },
      { from: 'rules', to: 'pay' },
      { from: 'pay', to: 'myob' },
    ],
  },
  'ziaris-reconciliation': {
    nodes: [
      { id: 'bank', title: 'Bank file', note: 'uploaded by Finance', at: [0, 0] },
      { id: 'match', title: 'Suggested match', note: 'each line to an invoice', at: [1, 0] },
      { id: 'finance', title: 'Finance approves', note: 'one line at a time', kind: 'person', n: 2, at: [2, 0] },
      { id: 'closed', title: 'Invoice closed', note: 'with the approval recorded', at: [3, 0] },
      { id: 'open', title: 'Stays open', note: 'for Finance to resolve', kind: 'person', at: [1, 1] },
    ],
    edges: [
      { from: 'bank', to: 'match' },
      { from: 'match', to: 'finance' },
      { from: 'finance', to: 'closed' },
      { from: 'match', to: 'open', kind: 'fail', label: 'no clear match' },
    ],
  },
};

/** The figure each project is recognised by, drawn small. */
export const glyphFor: Record<string, string> = {
  'jayne-bandy-ai': 'jayne-bandy-ai',
  ziaris: 'ziaris-reconciliation',
  'sap-automation': 'sap-automation',
};

/** A short fingerprint of a spec, so a test can match a glyph to its figure. */
export const specKey = (spec: FigSpec) => {
  let h = 0;
  for (const c of JSON.stringify(spec)) h = (h * 31 + c.charCodeAt(0)) | 0;
  return (h >>> 0).toString(36);
};
