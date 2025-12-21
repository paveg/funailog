/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  // CV Export - Private data (server-side only, no PUBLIC_ prefix)
  readonly CV_ADDRESS?: string;
  readonly CV_PHONE?: string;
  readonly CV_EMAIL?: string;
  readonly CV_BIRTH_DATE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
