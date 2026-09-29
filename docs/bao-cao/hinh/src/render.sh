#!/bin/sh
# Render các sơ đồ HTML sang PNG rồi cắt phần trắng thừa.
cd "$(dirname "$0")"
python3 draw.py >/dev/null
for n in kien-truc du-lieu luong-xu-ly so-do-to-chuc; do
  w=$(python3 -c "import json;print(json.load(open('sizes.json'))['$n'][0])")
  h=$(python3 -c "import json;print(json.load(open('sizes.json'))['$n'][1])")
  /opt/pw-browsers/chromium-1194/chrome-linux/chrome --headless --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=5 --window-size=$w,$((h+200)) --screenshot=../$n.png file://$PWD/$n.html >/dev/null 2>&1
  python3 -c "
from PIL import Image
im=Image.open('../$n.png'); im.crop((0,0,$w*5,$h*5)).save('../$n.png')"
done
