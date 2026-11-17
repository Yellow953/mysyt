#!/bin/bash
# parallel resumable downloader: bash dl3.sh <listfile> [P]
cd "$(dirname "$0")"
P=${2:-8}
one(){ n=$1; t=$2
  B=https://d8j0ntlcm91z4.cloudfront.net/user_3JhBD17Qpu6C9sMD36gZ3WpUgRB
  PY=../../../../.venv/bin/python
  for k in 1 2 3 4 5 6 7 8 9 10; do
    $PY -c "from PIL import Image;Image.open('raw/$n.png').load()" 2>/dev/null && { echo "ok $n"; return; }
    curl -s -C - -m 240 -o raw/$n.png "$B/hf_$t.png"
  done; echo "FAIL $n"; }
export -f one
grep -v '^$' "$1" | xargs -P $P -L 1 bash -c 'one $0 $1'
