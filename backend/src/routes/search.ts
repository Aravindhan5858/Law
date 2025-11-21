/**
 * Search API Routes
 * Endpoint: /api/search?query=xxx
 * Returns only matched sections/cases
 */

import { Router, Request, Response } from 'express';
import { vectorSearchService } from '../services/vectorSearchService';

const router = Router();

/**
 * GET /api/search?query=xxx
 * Search across all legal acts
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { query, limit } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        error: 'Query parameter is required',
        example: '/api/search?query=378'
      });
    }

    const maxResults = limit ? parseInt(limit as string) : 5;
    const results = vectorSearchService.search(query, maxResults);

    return res.json({
      query,
      count: results.length,
      results: results.map(r => ({
        section_number: r.section_number,
        act: r.act_name || 'Indian Penal Code, 1860',
        title: r.title,
        description: r.text || r.definition || '',
        punishment: r.punishment,
        example_case: r.example_case || r.example || '',
        related_cases: r.related_cases || [],
        match_score: r.score,
        match_type: r.match_type
      }))
    });
  } catch (error: any) {
    console.error('[Search API Error]', error);
    return res.status(500).json({
      error: 'Search failed',
      message: error.message
    });
  }
});

/**
 * GET /api/search/stats
 * Get search engine statistics
 */
router.get('/stats', (_req: Request, res: Response) => {
  try {
    const stats = vectorSearchService.getStats();
    return res.json(stats);
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to get stats',
      message: error.message
    });
  }
});

export default router;
