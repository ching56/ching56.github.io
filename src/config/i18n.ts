import { SITE } from "./site.js";

export const UI = {
  "zh-TW": {
    homePath: "/zh-TW/",
    skipContentLabel: "跳到主要內容",
    backToTopLabel: "回到頂端",
    postsLabel: "文章",
    emptyPostsMessage: "目前沒有文章。",
    aboutLabel: "關於",
    nowLabel: "現在",
    responsePrompt: "讀完有想說的嗎？",
    responseLinkLabel: "寫信給我",
    threadsPrompt: "同步發佈在 Threads",
    threadsLinkLabel: "在上面和我互動",
    newTabLabel: "（另開新分頁）",
  },
  en: {
    homePath: "/en/",
    skipContentLabel: "Skip to content",
    backToTopLabel: "Back to top",
    postsLabel: "Posts",
    emptyPostsMessage: "No English posts yet.",
    aboutLabel: null,
    nowLabel: "Now",
    responsePrompt: "Have something to share?",
    responseLinkLabel: "Email me",
    threadsPrompt: "Also posted on Threads",
    threadsLinkLabel: "Talk with me there",
    newTabLabel: " (opens in a new tab)",
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
