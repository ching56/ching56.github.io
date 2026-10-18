# Personal Blog

The publishing language for 李至青’s bilingual personal blog.

## Language

**Garden entrance**:
The zh-TW homepage, read in order as bio → now → cards. None of these names appears on screen as a heading.
_Avoid_: Landing page, dashboard

**Bio**:
The author's three-paragraph self-introduction that opens the entrance, closed by the mail link. Its source is still `about.md` and its anchor is still `#about` for legacy URLs.
_Avoid_: About page

**Now**:
A short, author-written note on what the author is doing these days, shown with its last-updated date. It appears only once `now.md` exists.
_Avoid_: Status, bio

**Card**:
The concept of one post as a unit on the entrance, not a framed box. Every published post is a card.
_Avoid_: Tile, topic bed

**Last updated**:
The last time the author tended a post (`updated`, or `date` if never revised). Cards are ordered by it and show it; it is never earlier than the publish date. From 2026-10-18 on, the pre-commit hook writes it into frontmatter whenever a post's body changes; history before that is deliberately not backfilled, and it is never computed from git at build time.
_Avoid_: Growth stage, git commit date

**Music link card**:
A quiet, blog-owned, text-only citation placed between an article’s metadata and body. An article has at most one card, which lets the reader choose an authorized music provider without loading a player or displaying cover artwork.
_Avoid_: Song embed, music embed, music player, smart link

**Music citation line**:
A standalone body line containing only a musical work’s name and performer. A music link card replaces this line rather than duplicating it; prose that discusses the work remains article content.
_Avoid_: Duplicate card caption

**Authorized source**:
The artist, label, distributor, or a licensed music service presenting the recording through its intended sharing mechanism.
_Avoid_: Reuploads, ripped audio, copied album artwork or lyrics

**Embedded work**:
The musical release a post identifies and presents through a music link card. It is classified as either an album, such as 《一切不滅定律》 by 昏鴉, or an individual track, such as 〈進入下一層新的夢之前〉 by 椅子樂團, while visibly showing only its name and performer.
_Avoid_: Song when the cited work is an album

**Provider chooser**:
The blog-owned list of verified official destinations available for an embedded work. Each provider name carries a uniform external-link icon and opens that platform directly in a new tab rather than loading its player inside the article.
_Avoid_: Smart-link service, default provider, permanent provider

**Verified destination**:
An authorized, work-specific provider page confirmed by the author before publication. A music link card lists only the destinations available for that work rather than filling a fixed provider roster with searches or guesses.
_Avoid_: Search results, inferred URLs, unavailable provider
