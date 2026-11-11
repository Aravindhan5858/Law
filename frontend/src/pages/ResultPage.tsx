import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

type Section = {
  act: string;
  section: string;
  title: string;
  description: string;
  relevance: string;
  ingredients?: string[];
  punishment: string;
  officialSource?: string;
  status?: string;
};

type Action = {
  step: number;
  title: string;
  action: string;
  timeline: string;
  authority: string;
};

type Analysis = {
  complaintTitle?: string;
  incidentSummary?: string;
  legalCategory?: string;
  severity?: string;
  severityExplanation?: string;
  importantFacts?: string[];
  missingInformation?: string[];
  followUpQuestions?: string[];
  applicableSections?: Section[];
  problemAnalysis?: {
    whatHappened?: string;
    possibleLiability?: string;
    rights?: string[];
    supportingFacts?: string[];
    alternativeInterpretations?: string[];
  };
  evidenceChecklist?: Array<{ item: string; reason: string }>;
  actionSteps?: Action[];
  authorityGuidance?: {
    name?: string;
    why?: string;
    online?: string[];
    offline?: string;
    escalation?: string;
  };
  expectedOutcome?: string;
  remedies?: string[];
  precautions?: string[];
  legalAid?: string;
  disclaimer?: string;
};

function List({ items }: { items?: string[] }) {
  if (!items?.length) return <p>None identified.</p>;
  return <ul>{items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>;
}

function SectionCard({ section }: { section: Section }) {
  return (
    <article className="structured-section">
      <div className="section-content">
        <h3>{section.act} — Section {section.section}</h3>
        <h4>{section.title}</h4>
        <p>{section.description}</p>
        <p><strong>Why it may apply:</strong> {section.relevance}</p>
        <p><strong>Punishment:</strong> {section.punishment}</p>
        {section.ingredients?.length ? <><strong>Required facts</strong><List items={section.ingredients} /></> : null}
        {section.status ? <small>Classification: {section.status}</small> : null}
        {section.officialSource ? (
          <p><a href={section.officialSource} target="_blank" rel="noopener noreferrer">Official source</a></p>
        ) : null}
      </div>
    </article>
  );
}

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { result?: Analysis; originalComplaint?: string } | null;
  const result = state?.result;

  if (!result) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <div className="no-result-card">
            <h2>No Analysis Available</h2>
            <p>Analyze a complaint first to see the complete solution.</p>
            <button className="primary-btn" onClick={() => navigate('/analyze')}>Go to Analyze</button>
          </div>
        </div>
      </div>
    );
  }

  const problem = result.problemAnalysis;
  const authority = result.authorityGuidance;

  return (
    <div className="page-container">
      <motion.div className="content-wrapper" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-header">
          <h1>{result.complaintTitle || 'Analysis Result'}</h1>
          <p>{result.legalCategory || 'Legal complaint analysis'}</p>
        </div>

        <section className="structured-section complaint-display">
          <div className="section-content">
            <h3>Complaint Summary</h3>
            <p className="complaint-text">{state?.originalComplaint || result.incidentSummary || 'No complaint summary returned.'}</p>
            {result.severity ? <p><strong>Severity:</strong> {result.severity}. {result.severityExplanation}</p> : null}
          </div>
        </section>

        <section className="structured-section">
          <div className="section-content">
            <h3>Problem Analysis</h3>
            <p>{problem?.whatHappened || 'No problem analysis returned.'}</p>
            <p>{problem?.possibleLiability || ''}</p>
            <h4>Important facts</h4>
            <List items={result.importantFacts} />
            <h4>Rights and possible interpretations</h4>
            <List items={[...(problem?.rights || []), ...(problem?.alternativeInterpretations || [])]} />
          </div>
        </section>

        <section>
          <h2>Applicable Law Sections</h2>
          {result.applicableSections?.length
            ? result.applicableSections.map((section, index) => <SectionCard key={`${section.act}-${section.section}-${index}`} section={section} />)
            : <div className="structured-section"><p>Unable to identify a verified legal section from the available facts.</p></div>}
        </section>

        <section className="structured-section">
          <div className="section-content">
            <h3>Missing Information</h3>
            <List items={result.missingInformation} />
            {result.followUpQuestions?.length ? <><h4>Questions to clarify</h4><List items={result.followUpQuestions} /></> : null}
          </div>
        </section>

        <section className="structured-section">
          <div className="section-content">
            <h3>Evidence Checklist</h3>
            {result.evidenceChecklist?.length ? result.evidenceChecklist.map((item, index) => (
              <p key={`${item.item}-${index}`}><strong>{item.item}</strong> — {item.reason}</p>
            )) : <p>No evidence checklist returned.</p>}
          </div>
        </section>

        <section className="structured-section">
          <div className="section-content">
            <h3>Step-by-Step Solution</h3>
            {result.actionSteps?.length ? result.actionSteps.map(step => (
              <div className="step-item" key={step.step}>
                <span className="step-num">{step.step}</span>
                <p><strong>{step.title}</strong><br />{step.action}<br /><small>{step.timeline} · {step.authority}</small></p>
              </div>
            )) : <p>No action steps returned.</p>}
          </div>
        </section>

        <section className="structured-section">
          <div className="section-content">
            <h3>Authority Guidance</h3>
            <p><strong>{authority?.name || 'Relevant authority'}</strong></p>
            <p>{authority?.why}</p>
            <p>{authority?.offline}</p>
            <p>{authority?.escalation}</p>
            <List items={authority?.online} />
          </div>
        </section>

        <section className="structured-section">
          <div className="section-content">
            <h3>Legal Remedies</h3>
            <List items={result.remedies} />
            <h3>Precautions</h3>
            <List items={result.precautions} />
            {result.expectedOutcome ? <><h3>Expected Outcome</h3><p>{result.expectedOutcome}</p></> : null}
            {result.legalAid ? <p><strong>Legal aid:</strong> {result.legalAid}</p> : null}
          </div>
        </section>

        {result.disclaimer ? <div className="disclaimer-box"><p>{result.disclaimer}</p></div> : null}

        <div className="action-buttons">
          <button className="secondary-btn" onClick={() => navigate('/analyze')}>Analyze New Case</button>
        </div>
      </motion.div>
    </div>
  );
}
