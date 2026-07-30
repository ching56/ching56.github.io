import { SITE } from "./site.js";

export const UI = {
  "zh-TW": {
    homePath: "/zh-TW/",
    navigationLabel: "主要導覽",
    postsLabel: "文章",
    emptyPostsMessage: "目前沒有文章。",
    aboutLabel: "關於",
    emailLabel: "寄信",
    languageSwitch: {
      href: "/en/",
      label: "English",
    },
  },
  en: {
    homePath: "/en/",
    navigationLabel: "Primary navigation",
    postsLabel: "Posts",
    emptyPostsMessage: "No English posts yet.",
    aboutLabel: null,
    emailLabel: "Email",
    languageSwitch: {
      href: "/zh-TW/",
      label: "Traditional Chinese",
    },
  },
} as const;

export type SiteLanguage = keyof typeof UI;

export const SITE_LANGUAGES = Object.keys(UI) as SiteLanguage[];

export function getAtomFeedUrl(language: SiteLanguage) {
  return new URL(`${UI[language].homePath}atom.xml`, SITE.url);
}

export const EDITION_HOME_ALTERNATES = [
  { language: "zh-TW", path: "/zh-TW/" },
  { language: "en", path: "/en/" },
] as const;
