import {
  detectLanguage,
  getFollowUpQuestions,
  normalizeIncident,
  DetectedLanguage,
} from './multilingualNlpService';

export interface ComplaintMetadata {
  incidentDate?: string;
  location?: string;
  category?: string;
  evidenceNames?: string[];
}

export interface LegalSection {
  act: string;
  section: string;
  title: string;
  description: string;
  relevance: string;
  ingredients: string[];
  punishment: string;
  bailable?: string;
  cognizable?: string;
  officialSource: string;
  status: 'possible' | 'requires-verification';
}

export interface ComplaintAnalysis {
  complaintTitle: string;
  incidentSummary: string;
  language: DetectedLanguage;
  normalizedInput: string;
  confidence: number;
  legalCategory: string;
  peopleInvolved: string[];
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  severityExplanation: string;
  importantFacts: string[];
  missingInformation: string[];
  followUpQuestions: string[];
  applicableSections: LegalSection[];
  problemAnalysis: {
    whatHappened: string;
    possibleLiability: string;
    rights: string[];
    supportingFacts: string[];
    alternativeInterpretations: string[];
  };
  evidenceChecklist: Array<{ item: string; reason: string }>;
  actionSteps: Array<{ step: number; title: string; action: string; timeline: string; authority: string }>;
  authorityGuidance: {
    name: string;
    why: string;
    online: string[];
    offline: string;
    escalation: string;
  };
  expectedOutcome: string;
  remedies: string[];
  precautions: string[];
  legalAid: string;
  disclaimer: string;
}

const INDIA_CODE = 'https://www.indiacode.nic.in/';
const CYBER_PORTAL = 'https://www.cybercrime.gov.in/';
const NCH = 'https://consumerhelpline.gov.in/';

function isAfterBnsCommencement(date?: string): boolean {
  if (!date) return true;
  const parsed = new Date(date);
  return !Number.isNaN(parsed.getTime()) && parsed >= new Date('2024-07-01T00:00:00Z');
}

function hasAny(text: string, terms: string[]): boolean {
  return terms.some(term => text.includes(term));
}

function section(
  act: string,
  sectionNumber: string,
  title: string,
  description: string,
  relevance: string,
  ingredients: string[],
  punishment: string,
  officialSource = INDIA_CODE,
): LegalSection {
  return {
    act,
    section: sectionNumber,
    title,
    description,
    relevance,
    ingredients,
    punishment,
    officialSource,
    status: 'possible',
  };
}

export function analyzeComplaint(complaint: string, metadata: ComplaintMetadata = {}): ComplaintAnalysis {
  const normalized = normalizeIncident(complaint);
  const language = detectLanguage(complaint);
  const bnsApplies = isAfterBnsCommencement(metadata.incidentDate);
  const evidence = metadata.evidenceNames || [];
  const sections: LegalSection[] = [];
  const facts: string[] = [];
  const missing: string[] = [];
  const followUp = getFollowUpQuestions(normalized);
  let legalCategory = metadata.category || 'General legal issue';
  let severity: ComplaintAnalysis['severity'] = 'Medium';
  let severityExplanation = 'The available facts need verification before severity can be assessed confidently.';
  let authority = 'Appropriate authority requires verification';
  let authorityWhy = 'The correct authority depends on the verified facts, location and incident date.';
  let title = 'Legal complaint analysis';

  const assault = hasAny(normalized, ['hit', 'assault', 'injur', 'beat', 'punch', 'slap']);
  const seriousInjury = hasAny(normalized, ['fracture', 'broken', 'grievous', 'hospital', 'weapon', 'knife']);
  const threat = hasAny(normalized, ['threat', 'intimidat', 'miratt']);
  const online = hasAny(normalized, ['online', 'website', 'cyber', 'upi', 'payment', 'e-commerce']);
  const nonDelivery = hasAny(normalized, ['not delivered', 'never delivered', 'no refund', 'refund refused', 'product not delivered']);
  const theft = hasAny(normalized, ['theft', 'steal', 'stole', 'stolen', 'thirud']);
  const domestic = hasAny(normalized, ['husband', 'wife', 'spouse', 'domestic', 'in-laws', 'in laws', 'dowry']);

  if (assault) {
    legalCategory = domestic ? 'Domestic violence and physical abuse' : 'Physical assault and hurt';
    title = seriousInjury ? 'Possible grievous hurt / assault complaint' : 'Possible voluntarily causing hurt complaint';
    severity = seriousInjury ? 'High' : 'Medium';
    severityExplanation = seriousInjury
      ? 'The description mentions a potentially serious injury, weapon or hospital treatment. A medical opinion is essential.'
      : 'The description indicates physical contact or injury, but the legal classification depends on the medical report and exact facts.';
    authority = domestic ? 'Protection Officer / Local police station' : 'Local police station';
    authorityWhy = domestic
      ? 'A Protection Officer or police can help document abuse and connect the affected person with safety, medical and legal support.'
      : 'Police can record the complaint, arrange investigation and refer the injured person for medical examination.';
    facts.push('The complaint describes physical contact or bodily injury.');
    if (bnsApplies) {
      sections.push(section(
        'Bharatiya Nyaya Sanhita, 2023',
        seriousInjury ? '115(2)' : '115(1)',
        seriousInjury ? 'Voluntarily causing grievous hurt' : 'Voluntarily causing hurt',
        seriousInjury ? 'A provision concerning voluntarily causing grievous hurt.' : 'A provision concerning voluntarily causing hurt.',
        'This may apply if the required intention, act and legally recognized injury are established.',
        ['An act causing bodily pain, disease or infirmity', 'Voluntary or intentional conduct', seriousInjury ? 'Medical evidence showing grievous hurt' : 'Evidence of hurt'],
        seriousInjury ? 'Punishment must be verified against the current statutory text and facts; imprisonment and fine may apply.' : 'Punishment must be verified against the current statutory text and facts; imprisonment, fine or both may apply.',
      ));
    } else {
      sections.push(section(
        'Indian Penal Code, 1860',
        seriousInjury ? '325' : '323',
        seriousInjury ? 'Voluntarily causing grievous hurt' : 'Voluntarily causing hurt',
        'The pre-1 July 2024 law may apply subject to transitional provisions.',
        'The incident date suggests the older penal law may be relevant; a lawyer or police officer must verify the applicable transition rule.',
        ['Voluntary act', 'Bodily pain or legally recognized hurt', seriousInjury ? 'Medical evidence of grievous hurt' : 'Evidence of hurt'],
        seriousInjury ? 'Up to 7 years and fine under the legacy provision; verify.' : 'Up to 1 year, fine or both under the legacy provision; verify.',
      ));
    }
    if (!hasAny(normalized, ['medical', 'doctor', 'hospital', 'treatment'])) missing.push('Medical examination or treatment details');
    if (!hasAny(normalized, ['witness', 'cctv', 'video', 'photo'])) missing.push('Witnesses, CCTV or other supporting evidence');
  }

  if (domestic && !assault) {
    legalCategory = 'Domestic violence and abuse';
    title = 'Possible domestic violence or abuse complaint';
    severity = 'High';
    severityExplanation = 'The description indicates possible abuse within a domestic relationship. The type, frequency and immediate safety risk require sensitive fact-finding.';
    authority = 'Protection Officer / Local police station';
    authorityWhy = 'A Protection Officer, police station or legal-aid service can help assess safety and available remedies under the applicable domestic-violence framework.';
    facts.push('The complaint refers to possible abuse within a domestic relationship.');
    missing.push('Type, frequency and immediate safety risk of the abuse');
    missing.push('Any medical, communication or financial evidence');
  }

  if (threat) {
    legalCategory = assault ? 'Assault with possible criminal intimidation' : 'Possible criminal intimidation';
    sections.push(section(
      bnsApplies ? 'Bharatiya Nyaya Sanhita, 2023' : 'Indian Penal Code, 1860',
      bnsApplies ? '351' : '506',
      'Criminal intimidation',
      'A provision concerning threats intended to cause alarm or compel an act or omission.',
      'It may apply if the words, conduct, intention and resulting alarm satisfy the statutory ingredients.',
      ['A threat to person, reputation or property', 'Intention to cause alarm or compel conduct', 'Reliable evidence of the threat'],
      'Punishment and classification require verification against the applicable statute and exact threat.',
    ));
    missing.push('Exact words or conduct used in the threat and how it was communicated');
    authority = 'Local police station';
  }

  if (online && nonDelivery) {
    legalCategory = 'Online purchase dispute / possible cheating';
    title = 'Online purchase, non-delivery or refund complaint';
    severity = 'High';
    severityExplanation = 'Money loss and possible dishonest conduct are indicated, but a criminal offence cannot be concluded from non-delivery alone.';
    authority = 'Seller/platform grievance officer and Consumer Commission';
    authorityWhy = 'Consumer remedies address non-delivery or deficient service; police or the cyber portal may be appropriate only where facts indicate fraud or cybercrime.';
    facts.push('The complaint indicates an online transaction and non-delivery or refund issue.');
    sections.push(section(
      'Consumer Protection Act, 2019',
      '2(11), 2(47)',
      'Deficiency in service / unfair trade practice',
      'Consumer law addresses deficient service and deceptive or unfair trade practices.',
      'This may apply if a consumer transaction, payment and service failure are established.',
      ['Consumer transaction', 'Payment or contractual obligation', 'Deficiency, fault or unfair practice'],
      'Refund, replacement, compensation and costs may be ordered; outcome depends on evidence and forum findings.',
      'https://www.indiacode.nic.in/handle/123456789/15256',
    ));
    if (hasAny(normalized, ['cheat', 'fraud', 'scam', 'fake'])) {
      sections.push(section(
        bnsApplies ? 'Bharatiya Nyaya Sanhita, 2023' : 'Indian Penal Code, 1860',
        bnsApplies ? '318' : '420',
        'Cheating',
        'A provision concerning deception and dishonest inducement to deliver property.',
        'Non-delivery alone is not enough; dishonest intention at the relevant time must be proved.',
        ['Deception', 'Dishonest inducement', 'Delivery of property or loss'],
        'Punishment must be verified against the applicable statute and proven ingredients.',
      ));
    }
    missing.push('Order, payment, seller communication and refund request details');
  }

  if (theft) {
    legalCategory = 'Possible theft';
    title = 'Possible theft complaint';
    severity = 'High';
    severityExplanation = 'The complaint indicates property may have been taken without consent; ownership, possession and circumstances require verification.';
    authority = 'Local police station';
    authorityWhy = 'Police can record the complaint and investigate the missing property.';
    sections.push(section(
      bnsApplies ? 'Bharatiya Nyaya Sanhita, 2023' : 'Indian Penal Code, 1860',
      bnsApplies ? '303' : '379',
      'Theft',
      'A provision concerning dishonest moving of movable property out of another person’s possession without consent.',
      'It may apply if the property, possession, lack of consent and dishonest intention are established.',
      ['Movable property', 'Taken from another’s possession', 'Without consent', 'Dishonest intention'],
      'Punishment and classification require verification against the applicable statute and facts.',
    ));
    missing.push('Description, value and ownership proof for the missing property');
  }

  if (!sections.length) {
    missing.push('Clear description of the act, date, place, people involved and loss or injury');
  }
  const uniqueMissing = [...new Set(missing)];
  const generatedQuestions = [...new Set([...followUp, ...uniqueMissing.map(item => `Please provide: ${item.toLowerCase()}.`)])].slice(0, 6);
  const actionSteps = buildActionSteps(legalCategory, authority, online);

  return {
    complaintTitle: title,
    incidentSummary: complaint.trim(),
    language,
    normalizedInput: normalized,
    confidence: sections.length ? (uniqueMissing.length ? 0.62 : 0.78) : 0.2,
    legalCategory,
    peopleInvolved: ['Affected person / complainant', 'Other person or organization described in the complaint'],
    severity,
    severityExplanation,
    importantFacts: facts.length ? facts : ['The complaint was received, but no fact has been independently verified.'],
    missingInformation: uniqueMissing,
    followUpQuestions: generatedQuestions,
    applicableSections: sections.length ? sections : [{
      ...section('Requires legal verification', 'Not identified', 'No provision safely identified', 'The available facts are not sufficient to select a legal provision.', 'Additional facts and authoritative verification are required before relying on a section.', [], 'Requires legal verification.'),
      status: 'requires-verification',
    }],
    problemAnalysis: {
      whatHappened: 'The system has summarized the user’s description; it has not independently established that the incident occurred.',
      possibleLiability: sections.length ? 'The described conduct may create civil or criminal liability if the statutory ingredients are proved.' : 'Liability cannot be assessed safely from the current information.',
      rights: ['Right to make a complaint to the appropriate authority', 'Right to preserve evidence and seek legal advice', 'Right to emergency assistance where safety is at risk'],
      supportingFacts: facts,
      alternativeInterpretations: ['The facts may support a civil, consumer or criminal remedy depending on evidence and intent.', 'The incident date may change the applicable statute.'],
    },
    evidenceChecklist: buildEvidenceChecklist(legalCategory, evidence),
    actionSteps,
    authorityGuidance: {
      name: authority,
      why: authorityWhy,
      online: online ? [CYBER_PORTAL, NCH] : ['https://digitalpolice.gov.in/'],
      offline: 'Carry identity proof, a written complaint, relevant documents and copies. Ask for an acknowledgement or reference number.',
      escalation: 'If there is no response, preserve the acknowledgement and seek advice from the senior officer, relevant regulator or a District Legal Services Authority.',
    },
    expectedOutcome: 'Possible outcomes include investigation, mediation, refund, compensation or prosecution depending on the verified facts. No outcome, arrest or compensation is guaranteed.',
    remedies: ['Police complaint or FIR where the facts disclose a cognizable offence', 'Consumer or civil remedy where there is loss, deficiency or breach', 'Free or low-cost legal aid assessment through the District Legal Services Authority'],
    precautions: ['Do not confront a threatening person alone.', 'Do not delete original messages, files or medical records.', 'Do not treat this informational analysis as a final legal opinion.'],
    legalAid: 'Contact the nearest District Legal Services Authority or visit https://nalsa.gov.in/ to check eligibility for legal aid.',
    disclaimer: 'This is AI-assisted legal information, not a final legal opinion. Statutory text, amendments, jurisdiction and facts must be verified by a qualified advocate or competent authority.',
  };
}

function buildEvidenceChecklist(category: string, evidenceNames: string[]): Array<{ item: string; reason: string }> {
  const items = category.includes('Domestic')
    ? [['Medical records or photographs', 'May document injury or health impact.'], ['Messages, call records or diary', 'May preserve a chronology of abuse.'], ['Trusted witness or support-service details', 'May help with safety planning and corroboration.']]
    : category.includes('Assault') || category.includes('hurt')
    ? [['Medical report or prescription', 'Documents the injury and treatment.'], ['Photographs or video', 'May show injuries, location or events.'], ['Witness and CCTV details', 'May support the account of the incident.']]
    : category.includes('Online') || category.includes('Consumer')
      ? [['Order confirmation and invoice', 'Shows the transaction and promised service.'], ['Payment or bank record', 'Shows payment and amount.'], ['Messages and refund requests', 'Shows communication and attempts to resolve the issue.']]
      : [['Identity proof', 'May be needed by the receiving authority.'], ['Photos, videos or documents', 'May support the complaint.'], ['Witness details and chronology', 'Helps preserve the sequence of events.']];
  const existing = new Set(evidenceNames.map(name => name.toLowerCase()));
  return items.map(([item, reason]) => ({ item: existing.has(item.toLowerCase()) ? `${item} (provided)` : item, reason }));
}

function buildActionSteps(category: string, authority: string, online: boolean): ComplaintAnalysis['actionSteps'] {
  const steps: ComplaintAnalysis['actionSteps'] = [
    { step: 1, title: 'Immediate safety', action: 'Move to a safe place and contact emergency services if there is immediate danger or serious injury.', timeline: 'Immediately', authority: 'Emergency services / trusted person' },
    { step: 2, title: 'Preserve evidence', action: 'Keep original files, messages, photographs, medical records, receipts and a dated chronology. Do not edit or delete originals.', timeline: 'Immediately', authority: 'Complainant' },
    { step: 3, title: 'Contact the authority', action: `Approach ${authority} with a written complaint and supporting documents.`, timeline: 'As soon as possible', authority },
    { step: 4, title: 'Obtain acknowledgement', action: 'Ask for the complaint, FIR, CSR or reference number and keep a copy of everything submitted.', timeline: 'At filing', authority },
    { step: 5, title: 'Follow up or escalate', action: 'Use the reference number to follow up. If there is no response, escalate through the competent senior authority or seek legal aid.', timeline: 'After filing', authority },
  ];
  if (online) steps.splice(3, 0, { step: 4, title: 'Notify the transaction provider', action: 'Inform the bank, payment provider, platform or grievance officer promptly and preserve the ticket number.', timeline: 'As soon as possible', authority: 'Bank / platform grievance officer' });
  return steps.map((step, index) => ({ ...step, step: index + 1 }));
}
