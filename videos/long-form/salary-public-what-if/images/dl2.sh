#!/bin/bash
# sequential, long-timeout downloader: name ts_id ...
cd "$(dirname "$0")/raw"
P=https://d8j0ntlcm91z4.cloudfront.net/user_3JhBD17Qpu6C9sMD36gZ3WpUgRB/hf_20261118_
while [ $# -ge 2 ]; do
  for try in 1 2 3; do curl -s --max-time 240 -o "$1.png" "${P}$2.png"; python3 -c "from PIL import Image;Image.open('$1.png').load()" 2>/dev/null && { echo "ok $1"; break; }; done
  shift 2
done
echo DONE
