#!/bin/bash
cd "$(dirname "$0")"; mkdir -p renders
for a in A B C D E F G H; do npx hyperframes render -c act-$a.html --quality draft --fps 30 --workers 3 --output renders/new$a.mp4 --quiet > renders/log$a.txt 2>&1; echo "$a done $(date)" >> renders/progress.txt; done
