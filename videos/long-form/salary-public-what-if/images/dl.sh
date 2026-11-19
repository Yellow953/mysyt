#!/bin/bash
# usage: dl.sh name ts_id [name ts_id ...]
cd "$(dirname "$0")/raw"
P=https://d8j0ntlcm91z4.cloudfront.net/user_3JhBD17Qpu6C9sMD36gZ3WpUgRB/hf_20261118_
while [ $# -ge 2 ]; do curl -s --max-time 40 --retry 2 -o "$1.png" "${P}$2.png"; python3 -c "from PIL import Image;im=Image.open('$1.png');print('$1',im.size)" || echo BAD $1; shift 2; done
