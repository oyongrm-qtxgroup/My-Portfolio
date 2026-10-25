#!/bin/sh
# Cuts the fonts down to what the site uses: the axis ranges below
# and Latin text with typographic punctuation and arrows. Needs fonttools + brotli
# (pip install fonttools brotli). Rerun after changing weights, widths or scripts.
set -eu
cd "$(dirname "$0")/.."
OUT=src/assets/fonts
TMP=$(mktemp -d)
UNICODES="U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DC,U+2009,U+2010-2027,U+2030-203A,U+2044,U+20AC,U+2122,U+2190-2193,U+21C4,U+2212"

# Archivo: headings at widths 72–85% and weights 500–700.
fonttools varLib.instancer node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2 \
  wght=500:700 wdth=72:85 -o "$TMP/archivo.ttf"
pyftsubset "$TMP/archivo.ttf" --unicodes="$UNICODES" --layout-features='*' --flavor=woff2 \
  --output-file="$OUT/archivo-subset.woff2"

# Source Serif 4: body text at weights 400–600; optical size pinned at 20 (body text).
fonttools varLib.instancer node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-opsz-normal.woff2 \
  wght=400:600 opsz=20 -o "$TMP/serif.ttf"
pyftsubset "$TMP/serif.ttf" --unicodes="$UNICODES" --layout-features='*' --flavor=woff2 \
  --output-file="$OUT/source-serif-4-subset.woff2"

# IBM Plex Mono: labels and meta at 400 and 500 (static), same characters.
for w in 400 500; do
  pyftsubset node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-$w-normal.woff2 \
    --unicodes="$UNICODES" --layout-features='*' --flavor=woff2 \
    --output-file="$OUT/plex-mono-$w-subset.woff2"
done

rm -rf "$TMP"
ls -l "$OUT"
