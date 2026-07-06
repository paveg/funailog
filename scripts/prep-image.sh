#!/bin/bash
# 記事用画像の事前圧縮: 長辺 2000px に縮小して src/assets/blog/<year>/ へ配置する。
# 写真は JPEG 品質 80、スクショ等の UI 画像は PNG のまま寸法だけ調整される。
# 使い方: scripts/prep-image.sh <入力ファイル>... [--year 2026]
set -euo pipefail
year=$(date +%Y)
args=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --year) year="$2"; shift 2 ;;
    *) args+=("$1"); shift ;;
  esac
done
dest="src/assets/blog/${year}"
mkdir -p "$dest"
for src in "${args[@]}"; do
  base=$(basename "$src")
  name="${base%.*}"; ext="${base##*.}"
  case "$(echo "$ext" | tr '[:upper:]' '[:lower:]')" in
    jpg|jpeg|heic)
      out="${dest}/${name}.jpg"
      sips -Z 2000 -s format jpeg -s formatOptions 80 "$src" --out "$out" >/dev/null ;;
    *)
      out="${dest}/${base}"
      sips -Z 2000 "$src" --out "$out" >/dev/null ;;
  esac
  echo "$(du -h "$out" | cut -f1)  $out"
done
