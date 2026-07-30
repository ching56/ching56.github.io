import type { APIRoute, GetStaticPaths } from "astro";

import type { SiteLanguage } from "../../config/i18n";
import { buildAtomFeed } from "../../lib/atom";

export const getStaticPaths = (() => [
  { params: { language: "zh-TW" } },
  { params: { language: "en" } },
]) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) =>
  new Response(
    await buildAtomFeed(params.language as SiteLanguage),
    {
      headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
    },
  );
