#!/bin/bash
# Ensambla los 8 actos + audio en un MP4 final de 45 s (1080x1920, 30 fps).
cd "$(dirname "$0")/.."
: > renders/list.txt; for a in A B C D E F G H; do echo "file 'new$a.mp4'" >> renders/list.txt; done
ffmpeg -v error -y -f concat -safe 0 -i renders/list.txt -i audio/mix.wav \
  -map 0:v -map 1:a -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" -movflags +faststart -shortest renders/studia-anuncio-45s.mp4
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,nb_frames,duration -of default=nw=1 renders/studia-anuncio-45s.mp4
