import type { LawSection, LawSectionWithAct } from '../types/law.types';
import ipcData from '../data/ipc.json';
import itActData from '../data/it_act.json';
import consumerActData from '../data/consumer_act.json';
import evidenceActData from '../data/evidence_act.json';
import crpcData from '../data/crpc.json';
import contractActData from '../data/contract_act.json';
import rtiActData from '../data/rti_act.json';
import motorVehiclesActData from '../data/motor_vehicles_act.json';

/**
 * Load and merge all law datasets into a single array
 */
export function loadAllLaws(): LawSectionWithAct[] {
  const allLaws: LawSectionWithAct[] = [];

  // Load IPC sections
  (ipcData as LawSection[]).forEach(law => {
    allLaws.push({
      ...law,
      act_name: 'Indian Penal Code, 1860'
    });
  });

  // Load CrPC sections
  (crpcData as LawSection[]).forEach(law => {
    allLaws.push({
      ...law,
      act_name: 'Code of Criminal Procedure, 1973'
    });
  });

  // Load IT Act sections
  (itActData as LawSection[]).forEach(law => {
    allLaws.push({
      ...law,
      act_name: 'Information Technology Act, 2000'
    });
  });

  // Load Consumer Protection Act sections
  (consumerActData as LawSection[]).forEach(law => {
    allLaws.push({
      ...law,
      act_name: 'Consumer Protection Act, 2019'
    });
  });

  // Load Evidence Act sections
  (evidenceActData as LawSection[]).forEach(law => {
    allLaws.push({
      ...law,
      act_name: 'Indian Evidence Act, 1872'
    });
  });

  // Load Contract Act sections
  (contractActData as LawSection[]).forEach(law => {
    allLaws.push({
      ...law,
      act_name: 'Indian Contract Act, 1872'
    });
  });

  // Load RTI Act sections
  (rtiActData as LawSection[]).forEach(law => {
    allLaws.push({
      ...law,
      act_name: 'Right to Information Act, 2005'
    });
  });

  // Load Motor Vehicles Act sections
  (motorVehiclesActData as LawSection[]).forEach(law => {
    allLaws.push({
      ...law,
      act_name: 'Motor Vehicles Act, 1988'
    });
  });

  return allLaws;
}

/**
 * Get count of laws by act
 */
export function getLawStats() {
  const laws = loadAllLaws();
  const stats = {
    total: laws.length,
    byAct: {} as Record<string, number>
  };

  laws.forEach(law => {
    stats.byAct[law.act_name] = (stats.byAct[law.act_name] || 0) + 1;
  });

  return stats;
}

/**
 * Search laws by section number (exact match)
 */
export function findBySection(sectionNumber: string): LawSectionWithAct | null {
  const laws = loadAllLaws();
  const normalized = sectionNumber.trim().toLowerCase();
  
  return laws.find(law => 
    law.section_number.toLowerCase() === normalized
  ) || null;
}
