#!/bin/bash
cd "$(dirname "$0")"
for a in C D E; do cp renders/act$a.mp4 renders/act${a}_prev.mp4; npx hyperframes render -c act-$a.html --quality draft --fps 30 --workers 3 --output renders/act$a.mp4 --quiet > renders/log${a}3.txt 2>&1; echo "${a}3 done $(date)" >> renders/progress.txt; done
