#!/bin/bash
cd "$(dirname "$0")"
for a in C E; do cp renders/new$a.mp4 renders/prev/new${a}_v5.mp4; npx hyperframes render -c act-$a.html --quality draft --fps 30 --workers 4 --output renders/new$a.mp4 --quiet > renders/log${a}6.txt 2>&1; echo "${a}6 done $(date)" >> renders/progress.txt; done
