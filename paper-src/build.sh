#!/bin/sh
# Rebuild one paper (or all) and copy the PDF into ../papers/.
#   ./build.sh                 -> every paper
#   ./build.sh rethinking-the-gaokao
cd "$(dirname "$0")"
export TEXINPUTS=".:$(pwd)/_shared//:"
for d in ${1:-*/}; do
  d=${d%/}; [ "$d" = "_shared" ] && continue; [ -f "$d/main.tex" ] || continue
  (cd "$d" && latexmk -xelatex -interaction=nonstopmode -halt-on-error -quiet main.tex >/dev/null) \
    && cp "$d/main.pdf" "../papers/$d.pdf" && echo "ok   $d" || echo "FAIL $d (see $d/main.log)"
done
