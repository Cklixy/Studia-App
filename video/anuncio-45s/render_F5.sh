#!/bin/bash
cd "$(dirname "$0")"
cp renders/newF.mp4 renders/prev/newF_v4.mp4
npx hyperframes render -c act-F.html --quality draft --fps 30 --workers 4 --output renders/newF.mp4 --quiet > renders/logF5.txt 2>&1; echo "F5 done $(date)" >> renders/progress.txt
