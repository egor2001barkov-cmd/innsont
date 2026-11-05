#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Добавляет images: OG_IMAGE в openGraph-блоки страниц, где картинка не задана.

Next.js заменяет объект openGraph страницы ЦЕЛИКОМ (мержа по полям нет),
поэтому дефолт из layout не пробивается на страницы с собственным openGraph.
Скрипт: находит `openGraph: {` без `images:` в первых строках блока и вставляет
`images: OG_IMAGE,` первой строкой блока; дополняет импорт OG_IMAGE из @/lib/site.
Запуск: python3 scripts/add-og-images.py [--apply]
"""
import re
import sys
from pathlib import Path

APP = Path(__file__).resolve().parent.parent / "src" / "app"

def main():
    dry = "--apply" not in sys.argv
    changed = 0
    for f in sorted(APP.rglob("page.tsx")):
        src = f.read_text(encoding="utf-8")
        m = re.search(r"( *)openGraph: \{\n", src)
        if not m:
            continue
        # блок openGraph: до закрывающей строки того же отступа
        indent = m.group(1)
        block_end = src.find(indent + "},", m.end())
        block = src[m.end():block_end] if block_end != -1 else src[m.end():m.end() + 400]
        if re.search(r"^\s*images:", block, re.M):
            continue  # картинка уже задана (например, обложки статей)
        insertion = f"{indent}  images: OG_IMAGE,\n"
        new = src[: m.end()] + insertion + src[m.end() :]
        # импорт: расширить существующий from "@/lib/site" или добавить новый
        if "OG_IMAGE" not in new.split("export")[0]:
            imp = re.search(r'import \{([^}]*)\} from "@/lib/site";', new)
            if imp and "OG_IMAGE" not in imp.group(1):
                new = new.replace(
                    imp.group(0),
                    'import {' + imp.group(1).rstrip() + ', OG_IMAGE } from "@/lib/site";',
                    1,
                )
            elif not imp:
                first_import = re.search(r'^import .*?;\n', new, re.M)
                if first_import:
                    new = new.replace(
                        first_import.group(0),
                        first_import.group(0) + 'import { OG_IMAGE } from "@/lib/site";\n',
                        1,
                    )
        if new != src:
            print(("+" if not dry else "dry+") + " " + str(f.relative_to(f.parents[3])))
            changed += 1
            if not dry:
                f.write_text(new, encoding="utf-8")
    print(f"изменено: {changed}" + (" (dry-run)" if dry else ""))

main()
