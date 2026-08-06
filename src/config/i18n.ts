import { SITE } from "./site.js";

export const UI = {
  "zh-TW": {
    homePath: "/zh-TW/",
    navigationLabel: "主要導覽",
    skipContentLabel: "跳到主要內容",
    postsLabel: "文章",
    emptyPostsMessage: "目前沒有文章。",
    aboutLabel: "關於",
    aboutCtaPrompt: "如果有一段文字讓你想起自己，歡迎寫信告訴我。",
    responsePrompt: "讀完有想說的嗎？",
    responseLinkLabel: "寫信給我",
    languageSwitch: {
      href: "/en/",
      label: "English",
    },
  },
  en: {
    homePath: "/en/",
    navigationLabel: "Primary navigation",
    skipContentLabel: "Skip to content",
    postsLabel: "Posts",
    emptyPostsMessage: "No English posts yet.",
    aboutLabel: null,
    aboutCtaPrompt: "If something here reminds you of your own story, write to me.",
    responsePrompt: "Have something to share?",
    responseLinkLabel: "Email me",
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
