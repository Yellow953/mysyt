#!/bin/bash
# usage: dl.sh stamp  then lines "NN jobid" on stdin
cd "$(dirname "$0")/clips"
while read n id; do
 for s in "$@"; do
  curl -s -m 90 -o $n.mp3.tmp "https://d8j0ntlcm91z4.cloudfront.net/user_3JhBD17Qpu6C9sMD36gZ3WpUgRB/hf_${s}_${id}.mp3"
  if [ $(stat -f%z $n.mp3.tmp) -gt 2000 ]; then mv $n.mp3.tmp $n.mp3; break; fi
 done
 [ -f $n.mp3.tmp ] && echo "fail $n" && rm -f $n.mp3.tmp
done
