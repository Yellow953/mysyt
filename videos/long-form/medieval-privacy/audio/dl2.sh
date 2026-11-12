#!/bin/bash
# usage: dl2.sh dest/name  stamp_jobid  (one per line on stdin: "dest stamp_jobid")
while read d sj; do
  curl -s -m 120 -o "$d.tmp" "https://d8j0ntlcm91z4.cloudfront.net/user_3JhBD17Qpu6C9sMD36gZ3WpUgRB/hf_$sj.png"
  python3 -c "from PIL import Image;Image.open('$d.tmp').load()" 2>/dev/null && mv "$d.tmp" "$d" || echo "BAD $d"
done
