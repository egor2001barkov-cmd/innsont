#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Генерация 10 SVG-обложек для новых статей INSONT (стиль существующих обложек)."""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "blog"

ITEMS = [
    ("yandeks-neyro-kak-popast-v-otvety", "НЕЙРОСЕТИ", "Яндекс Нейро:", "как попасть в ответы"),
    ("kak-popast-v-chatgpt-search", "НЕЙРОСЕТИ", "ChatGPT Search:", "как цитируют сайты"),
    ("geo-dlya-uslug-b2b", "НЕЙРОСЕТИ", "GEO для услуг B2B:", "упоминания в нейросетях"),
    ("indexnow-kak-podklyuchit", "ТЕХНИКА", "IndexNow:", "индексация за часы"),
    ("metrika-dlya-seo-celeji-povedenie", "АНАЛИТИКА", "Метрика для SEO:", "цели и поведение"),
    ("semanticheskoe-yadro-sbor-shagami", "КОНТЕНТ", "Семантическое ядро:", "от Вордстата до кластеров"),
    ("ssylki-dlya-novogo-sayta", "СТРАТЕГИЯ", "Ссылки молодому сайту:", "первые 6 месяцев"),
    ("seo-dlya-kliniki-mediciny", "ОТРАСЛИ", "SEO для клиники:", "требования и план"),
    ("ctr-snipeta-uvelichit-kliki", "КОНТЕНТ", "CTR сниппета:", "больше кликов с позиции"),
    ("analiz-konkurentov-v-poiske", "СТРАТЕГИЯ", "Анализ конкурентов:", "в выдаче за один день"),
]

POINTS = [
    "760,470 806,440 852,455 898,415 944,430 990,390 1036,405 1082,365 1128,350",
    "760,455 806,470 852,430 898,445 944,400 990,415 1036,375 1082,390 1128,340",
    "760,480 806,450 852,465 898,425 944,440 990,400 1036,415 1082,370 1128,355",
    "760,460 806,475 852,440 898,455 944,410 990,425 1036,385 1082,400 1128,345",
    "760,445 806,460 852,425 898,440 944,395 990,410 1036,370 1082,385 1128,330",
    "760,475 806,445 852,460 898,420 944,435 990,395 1036,410 1082,360 1128,345",
    "760,450 806,435 852,445 898,405 944,420 990,380 1036,395 1082,350 1128,335",
    "760,465 806,440 852,455 898,410 944,425 990,385 1036,400 1082,355 1128,340",
    "760,440 806,455 852,415 898,430 944,385 990,400 1036,360 1082,375 1128,325",
    "760,455 806,430 852,445 898,400 944,415 990,375 1036,390 1082,345 1128,330",
]

TPL = """<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#faf6f0"/>
  <rect x="0" y="0" width="1200" height="8" fill="#7c3aed"/>
  <text x="64" y="110" font-family="Georgia, serif" font-size="96" font-weight="700" fill="#efe6d8">{num}</text>
  <text x="64" y="158" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#7c3aed" letter-spacing="3">{tag}</text>
  <text x="64" y="248" font-family="system-ui, sans-serif" font-size="54" font-weight="700" fill="#1f1b16">{line1}</text>
  <text x="64" y="312" font-family="system-ui, sans-serif" font-size="54" font-weight="700" fill="#1f1b16">{line2}</text>
  <line x1="64" y1="352" x2="{endx}" y2="352" stroke="#e0d5c4" stroke-width="3"/>
  <text x="64" y="404" font-family="system-ui, sans-serif" font-size="24" fill="#7a6f60">INSONT · insont.ru/blog/{slug}</text>
  <g><polyline points="{points}" fill="none" stroke="#7c3aed" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="1128" cy="{lasty}" r="12" fill="#7c3aed"/></g>
  <rect x="700" y="180" width="440" height="420" fill="none" stroke="#e0d5c4" stroke-width="2" rx="18"/>
</svg>
"""

for i, (slug, tag, line1, line2) in enumerate(ITEMS):
    pts = POINTS[i].split()
    lasty = pts[-1].split(",")[1]
    svg = TPL.format(num=f"{i+1:02d}", tag=tag, line1=line1, line2=line2,
                     slug=slug, endx="640", points=POINTS[i], lasty=lasty)
    (OUT / (slug + ".svg")).write_text(svg, encoding="utf-8")
    print("cover:", slug + ".svg")
print("готово: 10 обложек")
