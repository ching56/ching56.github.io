#!/usr/bin/env bash
# Encode a video for an article: 1080p H.264 MP4 plus a poster frame,
# written to public/media/<post-slug>/ and kept under Cloudflare Pages'
# 25 MiB per-file limit. Prints the HTML to paste into the post.
#
# Usage: scripts/encode-video.sh <input-video> <post-slug> <name>
# Example: scripts/encode-video.sh ~/Downloads/clip.mov teapot-2026 throwing
set -euo pipefail

if [[ $# -ne 3 ]]; then
  echo "Usage: $0 <input-video> <post-slug> <name>" >&2
  exit 64
fi

input=$1
slug=$2
name=$3

if [[ ! "$slug$name" =~ ^[a-z0-9-]+$ ]]; then
  echo "post-slug and name may only use lowercase letters, digits, and hyphens" >&2
  exit 64
fi

out_dir="public/media/$slug"
video="$out_dir/$name.mp4"
poster="$out_dir/$name.jpg"
mkdir -p "$out_dir"

limit_bytes=$((25 * 1024 * 1024))
# Aim 8% under the limit to leave room for container overhead and VBV slack.
budget_bytes=$((limit_bytes * 92 / 100))
audio_kbps=128
max_video_kbps=8000

duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$input")
video_kbps=$(python3 -c "
budget = $budget_bytes * 8 / 1000 / float('$duration') - $audio_kbps
print(int(min($max_video_kbps, budget)))
")

if (( video_kbps < 1500 )); then
  echo "warning: this clip is long; 1080p at ${video_kbps} kbps will look soft." >&2
  echo "         Consider trimming it or hosting it outside the repo." >&2
fi

# Short side at most 1080 px (never upscaled); ffmpeg applies phone
# rotation metadata before scaling. -2 keeps the other side even.
ffmpeg -hide_banner -loglevel error -y -i "$input" \
  -map 0:v:0 -map '0:a:0?' \
  -vf "scale='if(gt(iw,ih),-2,min(1080,iw))':'if(gt(iw,ih),min(1080,ih),-2)'" \
  -c:v libx264 -preset slow -crf 23 -profile:v high -pix_fmt yuv420p \
  -maxrate "${video_kbps}k" -bufsize "$((video_kbps * 2))k" \
  -c:a aac -b:a "${audio_kbps}k" -ac 2 \
  -movflags +faststart \
  "$video"

ffmpeg -hide_banner -loglevel error -y -ss 0.5 -i "$video" \
  -frames:v 1 -q:v 4 "$poster"

size=$(wc -c < "$video" | tr -d ' ')
if (( size >= limit_bytes )); then
  echo "error: $video is $size bytes, over Cloudflare Pages' 25 MiB limit" >&2
  exit 1
fi

dimensions=$(
  ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height -of csv=p=0:s=x "$video"
)
width=${dimensions%x*}
height=${dimensions#*x}

cat <<HTML
Wrote $video ($((size / 1024)) KiB, ${width}x${height}) and $poster

Paste into the post, with a blank line above and below:

<video controls playsinline preload="none" width="$width" height="$height" poster="/media/$slug/$name.jpg" aria-label="描述影片內容">
  <source src="/media/$slug/$name.mp4" type="video/mp4" />
</video>
HTML
