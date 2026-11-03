import { SITE } from "./site.js";

export const UI = {
  "zh-TW": {
    homePath: "/zh-TW/",
    navigationLabel: "主要導覽",
    skipContentLabel: "跳到主要內容",
    postsLabel: "文章",
    emptyPostsMessage: "目前沒有文章。",
    aboutLabel: "關於",
    nowLabel: "現在",
    responseLinkLabel: "寫信給我",
    threadsLinkLabel: "在 Threads 和我互動",
    newTabLabel: "（另開新分頁）",
    motionPauseLabel: "暫停",
    motionPlayLabel: "播放",
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
    nowLabel: "Now",
    responseLinkLabel: "Email me",
    threadsLinkLabel: "Talk with me on Threads",
    newTabLabel: " (opens in a new tab)",
    motionPauseLabel: "Pause",
    motionPlayLabel: "Play",
    languageSwitch: {
      href: "/zh-TW/",
      label: "繁體中文",
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
