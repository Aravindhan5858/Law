import dotenv from 'dotenv';

dotenv.config();

// This is a minimal LLM stub. Replace with real OpenAI/LLM calls.
export async function llmAnalyze(_text: string) {
  // Return a safe stub response. Real implementation should call OpenAI/other provider
  return {
    recommendations: [
      {
        ipc_section: 0,
        title: 'LLM fallback not configured',
        punishment: 'N/A',
        rationale: 'LLM not configured. Set OPENAI_API_KEY and implement llmService.',
        confidence: 0.0
      }
    ]
  };
}
