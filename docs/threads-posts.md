# Posts mirrored from Threads

Some posts are copied from https://www.threads.com/@ching56. They are imported by hand: the author supplies each post's text, date, Threads link, and any video files. Threads posts have no title: the homepage list previews the post's own text (one line, cut off with 「…」), the article opens straight into the text, and the browser tab and feed use its first 40 characters.

## Add a post

1. Create `src/content/posts/zh-TW/<slug>.md`. The slug uses lowercase letters, digits, and hyphens.

   ```markdown
   ---
   date: 2026-03-14
   language: zh-TW
   threadsUrl: "https://www.threads.com/@ching56/post/<id>"
   ---

   Post text, one paragraph per Threads paragraph.
   ```

   `threadsUrl` replaces the email ending with 「同步發佈在 Threads」 and a link 「在上面和我互動」 to the original post. The build rejects anything that is not an `https://www.threads.com/@handle/post/<id>` permalink.

2. For each video, run the encoder from the repo root:

   ```sh
   corepack yarn video:encode ~/Downloads/clip.mov <slug> <name>
   ```

   It writes `public/media/<slug>/<name>.mp4` and a poster `<name>.jpg`, then prints a `<video>` block. Paste that block into the post where the video belongs, with a blank line above and below, and replace `描述影片內容` with a short description.

3. Add `/zh-TW/blog/<slug>/` to `KNOWN_POST_PATHS` in `worker/index.js`, or the likes button rejects the post.

4. Run `corepack yarn run check` and `corepack yarn test`.

## Video encoding

The encoder makes H.264 MP4 at 1080p on the short side, never upscaling, with AAC audio and fast start so playback begins before the download finishes. Cloudflare Pages rejects any file over 25 MiB, so the encoder lowers the bitrate for long clips and fails if the result is still too large. Clips longer than about a minute look softer; trim them or host them elsewhere.

Videos use `preload="none"` with a poster, so readers on slow connections download nothing until they press play. Built-site tests enforce the 25 MiB limit for every file and check each article video's attributes, poster, and source file.
