#!/bin/bash
cd "$(dirname "$0")"
until grep -q "^C2 done" renders/progress.txt; do sleep 20; done
npx hyperframes render -c act-F.html --quality draft --fps 30 --workers 3 --output renders/actF.mp4 --quiet > renders/logF2.txt 2>&1; echo "F2 done $(date)" >> renders/progress.txt
