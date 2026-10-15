#!/bin/bash
cd "$(dirname "$0")"
for a in D F; do npx hyperframes render -c act-$a.html --quality draft --fps 30 --workers 3 --output renders/new$a.mp4 --quiet > renders/log${a}4.txt 2>&1; echo "${a}4 done $(date)" >> renders/progress.txt; done
