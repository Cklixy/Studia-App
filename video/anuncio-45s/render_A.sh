#!/bin/bash
cd "$(dirname "$0")"
npx hyperframes render -c act-A.html --quality draft --fps 30 --workers 2 --output renders/actA.mp4 --quiet > renders/logA2.txt 2>&1; echo "A3 done $(date)" >> renders/progress.txt
