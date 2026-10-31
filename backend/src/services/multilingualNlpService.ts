export type DetectedLanguage = 'english' | 'tamil' | 'tanglish' | 'mixed';

const TANGLISH_NORMALIZATION: Array<[RegExp, string]> = [
  [/adich(?:it|anga|an|en|aanga)/gi, ' hit '],
  [/thirud(?:ittanga|itanga|ina|ichanga)/gi, ' stole '],
  [/miratt(?:uranga|inanga|unaanga)/gi, ' threaten '],
  [/panam\s+vang(?:itanga|inanga)/gi, ' took money '],
  [/porul\s+kudukk?ala/gi, ' product not delivered '],
  [/money\s+transfer\s+pann(?:en|anga)/gi, ' money transfer '],
  [/online\s+la/gi, ' online '],
  [/phone\s+la/gi, ' phone '],
  [/enna/gi, ' me '],
  [/oruth(?:anga|an|ar)/gi, ' person '],
  [/pann(?:en|anga|una)/gi, ' paid '],
  [/product\s+(?:varala|varavillai)/gi, ' product not delivered '],
  [/அடித்துவிட்டார்|அடித்துவிட்டார்கள்|அடித்தனர்/gu, ' hit '],
  [/திருடிவிட்டார்கள்|திருடிவிட்டனர்/gu, ' stole '],
  [/மிரட்டுகிறார்கள்|மிரட்டுகின்றனர்/gu, ' threaten '],
  [/என்னை/gu, ' me '],
  [/ஒருவர்/gu, ' person '],
  [/கடையில்/gu, ' shop '],
];

function containsTamil(text: string): boolean {
  return /[\u0B80-\u0BFF]/u.test(text);
}

function containsLatinWords(text: string): boolean {
  return /[A-Za-z]/u.test(text);
}

export function detectLanguage(text: string): DetectedLanguage {
  const hasTamil = containsTamil(text);
  const hasLatin = containsLatinWords(text);

  if (hasTamil && hasLatin) return 'mixed';
  if (hasTamil) return 'tamil';

  const tanglishMarkers = /\b(oru|enna|la|ah|pann|anga|adich|thirud|miratt|kudukk?ala|vangit)\w*/i;
  return tanglishMarkers.test(text) ? 'tanglish' : 'english';
}

export function normalizeIncident(text: string): string {
  return TANGLISH_NORMALIZATION.reduce(
    (normalized, [pattern, replacement]) => normalized.replace(pattern, replacement),
    text.toLowerCase(),
  )
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getFollowUpQuestions(normalizedText: string): string[] {
  const questions: string[] = [];

  if (/hit|assault|injur/.test(normalizedText)) {
    questions.push('What injury occurred, and did you receive medical treatment?');
    questions.push('Was a weapon used, and were there any witnesses or CCTV footage?');
  }

  if (/threat|miratt/.test(normalizedText)) {
    questions.push('What exactly was threatened, and do you have call recordings or messages?');
  }

  if (/online|money transfer|product not delivered|fraud|cheat/.test(normalizedText)) {
    questions.push('When did the incident happen, and do you have payment, order, or communication records?');
  }

  if (!/\b(when|date|yesterday|today|last|month|year)\b/.test(normalizedText)) {
    questions.push('When and where did the incident happen?');
  }

  return questions.slice(0, 4);
}
