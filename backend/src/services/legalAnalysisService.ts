/**
 * Legal Analysis Service
 * Analyzes complaints and provides structured legal guidance
 */

interface LegalAnalysis {
  caseClassification: {
    primaryCategory: string;
    subcategory: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    jurisdiction: string;
  };
  applicableSections: Array<{
    act: string;
    section: string;
    title: string;
    description: string;
    relevance: string;
  }>;
  punishmentDetails: {
    criminal?: string;
    civil?: string;
    compensation?: string;
  };
  actionSteps: Array<{
    step: number;
    action: string;
    timeline: string;
    authority: string;
  }>;
  expectedOutcome: {
    bestCase: string;
    worstCase: string;
    timeline: string;
    successProbability: string;
  };
  additionalNotes?: string;
}

class LegalAnalysisService {
  /**
   * Analyze a complaint and provide structured legal analysis
   */
  analyzeComplaint(complaint: string): LegalAnalysis {
    const lowerComplaint = complaint.toLowerCase();

    // Detect complaint type
    const complaintType = this.classifyComplaint(lowerComplaint);

    // Get applicable sections
    const sections = this.getApplicableSections(complaintType, lowerComplaint);

    // Get punishment details
    const punishment = this.getPunishmentDetails(sections);

    // Get action steps
    const actionSteps = this.getActionSteps(complaintType);

    // Get expected outcome
    const outcome = this.getExpectedOutcome(complaintType);

    return {
      caseClassification: complaintType,
      applicableSections: sections,
      punishmentDetails: punishment,
      actionSteps,
      expectedOutcome: outcome,
      additionalNotes: this.getAdditionalNotes(complaintType)
    };
  }

  /**
   * Classify the complaint
   */
  private classifyComplaint(complaint: string): LegalAnalysis['caseClassification'] {
    // E-commerce fraud patterns
    if (complaint.includes('e-commerce') || complaint.includes('online') || complaint.includes('website')) {
      if (complaint.includes('not delivered') || complaint.includes('no refund')) {
        return {
          primaryCategory: 'E-Commerce Fraud',
          subcategory: 'Non-Delivery of Goods & Refund Denial',
          severity: 'High',
          jurisdiction: 'Consumer Court / Cyber Crime Cell'
        };
      }
    }

    // Cheating/fraud patterns
    if (complaint.includes('cheat') || complaint.includes('fraud')) {
      return {
        primaryCategory: 'Fraud & Cheating',
        subcategory: 'Criminal Breach of Trust',
        severity: 'High',
        jurisdiction: 'Criminal Court'
      };
    }

    // Default classification
    return {
      primaryCategory: 'Civil Dispute',
      subcategory: 'Contract Breach',
      severity: 'Medium',
      jurisdiction: 'Civil Court'
    };
  }

  /**
   * Get applicable legal sections
   */
  private getApplicableSections(
    classification: LegalAnalysis['caseClassification'],
    complaint: string
  ): LegalAnalysis['applicableSections'] {
    const sections: LegalAnalysis['applicableSections'] = [];

    // E-commerce fraud sections
    if (classification.primaryCategory === 'E-Commerce Fraud') {
      sections.push({
        act: 'Indian Penal Code, 1860',
        section: '420',
        title: 'Cheating and dishonestly inducing delivery of property',
        description: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, shall be punished with imprisonment up to 7 years and fine.',
        relevance: 'Applicable when seller takes payment but intentionally fails to deliver product and refuses refund, showing dishonest intention from the beginning.'
      });

      sections.push({
        act: 'Indian Penal Code, 1860',
        section: '406',
        title: 'Criminal breach of trust',
        description: 'Whoever commits criminal breach of trust shall be punished with imprisonment up to 3 years, or fine, or both.',
        relevance: 'Money was entrusted to seller for delivery of goods. Failure to deliver or return money constitutes breach of trust.'
      });

      sections.push({
        act: 'Information Technology Act, 2000',
        section: '66D',
        title: 'Punishment for cheating by personation using computer resource',
        description: 'Whoever cheats by personation using computer resource shall be punished with imprisonment up to 3 years and fine up to Rs. 1 lakh.',
        relevance: 'E-commerce platform used as computer resource to commit fraud. Applicable if site misrepresented itself or used fake identity.'
      });

      sections.push({
        act: 'Consumer Protection Act, 2019',
        section: '2(7) - Deficiency in Service',
        title: 'Deficiency in service',
        description: 'Any fault, imperfection, shortcoming or inadequacy in the quality, nature and manner of performance required to be maintained by law.',
        relevance: 'Complete failure to deliver product after payment is gross deficiency in service. Entitles consumer to compensation.'
      });

      sections.push({
        act: 'Consumer Protection Act, 2019',
        section: '2(47) - Unfair Trade Practice',
        title: 'Unfair trade practice',
        description: 'A trade practice which adopts unfair methods or deceptive practices including non-performance of promise.',
        relevance: 'Taking payment without delivering goods is unfair trade practice. Consumer forum can order refund with interest and compensation.'
      });

      sections.push({
        act: 'Indian Contract Act, 1872',
        section: '73',
        title: 'Compensation for loss or damage caused by breach of contract',
        description: 'Party breaking contract must compensate other party for any loss or damage caused which naturally arose in usual course of things from such breach.',
        relevance: 'Breach of contract by non-delivery. Buyer entitled to refund plus compensation for loss suffered.'
      });
    }

    return sections;
  }

  /**
   * Get punishment details
   */
  private getPunishmentDetails(sections: LegalAnalysis['applicableSections']): LegalAnalysis['punishmentDetails'] {
    return {
      criminal: 'Section 420 IPC: Imprisonment up to 7 years + Fine\nSection 406 IPC: Imprisonment up to 3 years + Fine\nSection 66D IT Act: Imprisonment up to 3 years + Fine up to Rs. 1 lakh\n\nNote: These are criminal charges that can lead to arrest and prosecution of the seller/company officials.',
      civil: 'Consumer Protection Act: Consumer forum can order full refund with interest, compensation for mental harassment (typically Rs. 10,000 - Rs. 50,000), and litigation costs.',
      compensation: '1. Full refund of amount paid\n2. Interest @ 9-12% per annum from date of payment\n3. Compensation for mental agony: Rs. 10,000 - Rs. 50,000\n4. Litigation costs: Rs. 5,000 - Rs. 25,000\n5. Punitive damages (in severe cases): Up to 2x the transaction amount'
    };
  }

  /**
   * Get recommended action steps
   */
  private getActionSteps(classification: LegalAnalysis['caseClassification']): LegalAnalysis['actionSteps'] {
    if (classification.primaryCategory === 'E-Commerce Fraud') {
      return [
        {
          step: 1,
          action: 'Preserve All Evidence: Take screenshots of order confirmation, payment receipt, website, emails, chat conversations, terms & conditions. Save all communication.',
          timeline: 'Immediately',
          authority: 'Self'
        },
        {
          step: 2,
          action: 'Send Legal Notice: Send formal legal notice via registered post and email demanding refund within 15 days, failing which legal action will be initiated.',
          timeline: '0-3 days',
          authority: 'Lawyer (optional but recommended)'
        },
        {
          step: 3,
          action: 'File Consumer Complaint: File complaint in District Consumer Disputes Redressal Commission if amount is up to Rs. 1 crore. Can be filed online at edaakhil.nic.in',
          timeline: '3-7 days (if no response to notice)',
          authority: 'Consumer Court'
        },
        {
          step: 4,
          action: 'File Cyber Crime Complaint: Register FIR/complaint at National Cyber Crime Reporting Portal (cybercrime.gov.in) and local cyber cell.',
          timeline: 'Simultaneously with consumer complaint',
          authority: 'Cyber Crime Cell / Police'
        },
        {
          step: 5,
          action: 'Report to Payment Gateway: If payment made via credit card/UPI, raise chargeback dispute with bank/payment provider within 60-90 days.',
          timeline: 'Within 7 days',
          authority: 'Bank / Payment Gateway'
        },
        {
          step: 6,
          action: 'Report to Platform: If purchased via marketplace (Amazon, Flipkart), file complaint with platform\'s grievance officer and escalate to Consumer Helpline (1915).',
          timeline: 'Within 3 days',
          authority: 'E-commerce Platform / National Consumer Helpline'
        },
        {
          step: 7,
          action: 'Attend Hearings: Attend consumer court hearings (usually 3-6 hearings). Can appear in person or through lawyer.',
          timeline: '30-180 days after filing',
          authority: 'Consumer Court'
        }
      ];
    }

    return [];
  }

  /**
   * Get expected outcome
   */
  private getExpectedOutcome(classification: LegalAnalysis['caseClassification']): LegalAnalysis['expectedOutcome'] {
    if (classification.primaryCategory === 'E-Commerce Fraud') {
      return {
        bestCase: 'Full refund of paid amount + 12% annual interest + Rs. 25,000-50,000 compensation for mental harassment + Rs. 10,000-25,000 litigation costs. Total recovery: 150-200% of paid amount. Criminal case against seller may result in arrest and conviction.',
        worstCase: 'If seller/company has shut down or is untraceable, recovery becomes difficult. May get favorable order but enforcement challenging. Recovery: 0-50% of paid amount.',
        timeline: 'Consumer Court: 3-12 months\nCyber Crime Case: 6-18 months\nChargeback (if eligible): 30-90 days\n\nNote: Consumer court cases usually resolve faster (6-9 months average) compared to criminal cases.',
        successProbability: 'High (75-85%) in consumer court if evidence is strong (payment proof + order confirmation + communication). Lower (40-60%) in criminal court due to burden of proof beyond reasonable doubt. Chargeback success: 60-70% if raised within timeline.'
      };
    }

    return {
      bestCase: 'Favorable judgment with compensation',
      worstCase: 'Case dismissed or minimal recovery',
      timeline: '6-18 months',
      successProbability: 'Medium (50-60%)'
    };
  }

  /**
   * Get additional notes
   */
  private getAdditionalNotes(classification: LegalAnalysis['caseClassification']): string {
    if (classification.primaryCategory === 'E-Commerce Fraud') {
      return `IMPORTANT TIPS:

1. EVIDENCE IS CRUCIAL: Without payment proof and order confirmation, case becomes weak. Save everything.

2. MULTIPLE REMEDIES: You can pursue consumer complaint AND cyber crime case simultaneously. One is civil (for refund), other is criminal (for punishment).

3. CONSUMER COURT ADVANTAGE: 
   - No court fee if claim is under Rs. 5 lakhs
   - Simple procedure, can file online
   - Faster than civil courts (6-12 months vs 3-5 years)
   - High success rate for genuine cases

4. CHARGEBACK OPTION: Credit card holders have strong protection. File chargeback immediately - don't wait for court.

5. LIMITATION PERIOD: 
   - Consumer complaint: 2 years from cause of action
   - IPC offences: 3 years from fraud discovery
   - Act immediately!

6. LAWYER: Not mandatory in consumer court but helpful for drafting and arguments. Consumer court fees are minimal.

7. PRECEDENTS: Courts have consistently ruled in favor of consumers in online shopping fraud cases. Recent cases show compensation of Rs. 25,000-1,00,000 for similar issues.

8. WEBSITE DETAILS: Check website's registered address, grievance officer details. If no proper details, stronger case for fraud.

REMEMBER: Even if company shuts down, you can pursue directors/owners personally under Section 420 IPC and Consumer Protection Act.`;
    }

    return '';
  }
}

export const legalAnalysisService = new LegalAnalysisService();
export default LegalAnalysisService;
