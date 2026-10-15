#!/bin/bash
cd "$(dirname "$0")"
until grep -q "^F2 done" renders/progress.txt; do sleep 20; done
npx hyperframes render -c act-D.html --quality draft --fps 30 --workers 3 --output renders/actD.mp4 --quiet > renders/logD2.txt 2>&1; echo "D2 done $(date)" >> renders/progress.txt
