#!/bin/bash
# resumable downloader: bash dl2.sh <listfile>   (lines: "name tail"); skips files that already load as images
cd "$(dirname "$0")"
B=https://d8j0ntlcm91z4.cloudfront.net/user_3JhBD17Qpu6C9sMD36gZ3WpUgRB
PY=../../../../.venv/bin/python
while read n t; do
  [ -z "$n" ] && continue
  for k in 1 2 3 4 5 6 7 8; do
    $PY -c "from PIL import Image;Image.open('raw/$n.png').load()" 2>/dev/null && break
    curl -s -C - -m 300 -o raw/$n.png "$B/hf_$t.png"
  done
  $PY -c "from PIL import Image;Image.open('raw/$n.png').load()" 2>/dev/null && echo "ok $n" || echo "FAIL $n"
done < "$1"
