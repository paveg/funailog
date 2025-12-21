// This file is kept for reference but the actual CV generation
// is done via CLI script: pnpm cv
// See scripts/generate-cv.ts

import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response('CV generation is only available via CLI: pnpm cv', {
    status: 501,
  });
};
