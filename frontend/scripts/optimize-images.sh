#!/bin/bash
# Web-optimize the raw Fossey's photos (resize + recompress with macOS sips).
# Run: bash frontend/scripts/optimize-images.sh
cd "$(dirname "$0")/../public/img" || exit 1
optimize () {  # $1 = basename, $2 = max long-edge px, $3 = jpeg quality
  local f="$1"
  [ -f "$f.jpg" ] || { echo "skip $f.jpg (not found)"; return; }
  local before; before=$(du -h "$f.jpg" | cut -f1)
  sips -Z "$2" -s format jpeg -s formatOptions "$3" "$f.jpg" --out "$f.jpg" >/dev/null 2>&1
  echo "  $f.jpg  $before -> $(du -h "$f.jpg" | cut -f1)"
}
echo "Optimizing Fossey's photos..."
optimize fosseys_bar          2200 80   # hero / venue (larger)
optimize fosseys_pour         1800 80
optimize fosseys_still_elsie  1800 80
optimize fosseys_still        1800 80
echo "Done."
