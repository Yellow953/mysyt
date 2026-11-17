# usage: bash dl.sh  (reads dl_list.txt: "row tail")
cd "$(dirname "$0")"
B=https://d8j0ntlcm91z4.cloudfront.net/user_3JhBD17Qpu6C9sMD36gZ3WpUgRB
while read r t; do [ -z "$r" ] && continue; curl -s --max-time 40 --retry 2 -o clips/$(printf %02d $r).mp3 "$B/hf_$t.mp3"; done < dl_list.txt
