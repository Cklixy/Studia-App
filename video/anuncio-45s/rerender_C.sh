#!/bin/bash
cd "$(dirname "$0")"
until grep -q "^H done" renders/progress.txt; do sleep 20; done
npx hyperframes render -c act-C.html --quality draft --fps 30 --workers 3 --output renders/actC.mp4 --quiet > renders/logC2.txt 2>&1; echo "C2 done $(date)" >> renders/progress.txt
