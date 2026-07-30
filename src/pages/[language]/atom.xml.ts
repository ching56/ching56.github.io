import type { APIRoute, GetStaticPaths } from "astro";

import {
  SITE_LANGUAGES,
  type SiteLanguage,
} from "../../config/i18n";
import { buildAtomFeed } from "../../lib/atom";

export const getStaticPaths = (() =>
  SITE_LANGUAGES.map((language) => ({ params: { language } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) =>
  new Response(
    await buildAtomFeed(params.language as SiteLanguage),
    {
      headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
    },
  );
