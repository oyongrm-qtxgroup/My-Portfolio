"""Writes public/favicon.svg: "RO" as outlined Archivo (bold, 72% width, as the
headings) beside the red margin rule, on whole pixels, Paper and Night by the
browser's colour scheme. Outlines, not text, so every tab draws the same letters.
Needs fonttools + brotli (pip install fonttools brotli), like subset-fonts.sh.
Then `npm run icons` rasterises it to favicon.ico and apple-touch-icon.png.
"""
import sys
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2'
OUT = ROOT / 'public/favicon.svg'

TILE = 32
RULE_X = 6  # the rule's centre: 2 units wide, so it covers x 5–7 (whole pixels)
LEFT, RIGHT = 9, 30  # the letters' ink box: from 9 to 30 across (21 of 32, two units clear of each side)
BASELINE = 23  # centres the caps on the tile

font = instantiateVariableFont(TTFont(SRC), {'wght': 700, 'wdth': 72})
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
names = [cmap[ord(c)] for c in 'RO']

# Ink extent of the pair at font units, then one scale so it spans LEFT..RIGHT.
x, ink = 0, []
for n in names:
    pen = BoundsPen(glyphs)
    glyphs[n].draw(pen)
    xmin, ymin, xmax, ymax = pen.bounds
    ink.append((x + xmin, x + xmax))
    x += glyphs[n].width
scale = (RIGHT - LEFT) / (ink[-1][1] - ink[0][0])

pen = SVGPathPen(glyphs, ntos=lambda v: f'{v:.2f}'.rstrip('0').rstrip('.'))
x = 0
for n in names:
    # Font y runs up; SVG y runs down from the baseline.
    t = TransformPen(pen, (scale, 0, 0, -scale, LEFT + (x - ink[0][0]) * scale, BASELINE))
    glyphs[n].draw(t)
    x += glyphs[n].width

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {TILE} {TILE}">
  <style>
    .p {{ fill: #F6F6F3 }} .i {{ fill: #141413 }} .m {{ fill: #C8322A }}
    @media (prefers-color-scheme: dark) {{ .p {{ fill: #131412 }} .i {{ fill: #ECEBE6 }} .m {{ fill: #E0604F }} }}
  </style>
  <rect class="p" width="{TILE}" height="{TILE}" rx="3"/>
  <rect class="m" x="{RULE_X - 1}" y="3" width="2" height="{TILE - 6}"/>
  <path class="i" d="{pen.getCommands()}"/>
</svg>
'''
OUT.write_text(svg)
cap = font['OS/2'].sCapHeight * scale
print(f'favicon.svg: cap height {cap:.1f} of {TILE} ({cap / TILE:.0%}), ink {LEFT}–{RIGHT}', file=sys.stderr)
