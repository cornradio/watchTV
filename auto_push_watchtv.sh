#!/usr/bin/env bash
# */10 * * * * /bin/bash /home/kasusa/watchTV/auto_push_watchtv.sh >> /home/kasusa/auto_push_watchtv.log 2>&1 
set -e
cd /home/kasusa/watchTV

# 检查是否有改动
git add -A
if git diff --cached --quiet; then
  exit 0
fi

git commit -m "auto: sync"
git push
