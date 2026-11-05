#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Вставка внутренних ссылок в тела статей INSONT.

Файлы берутся ТОЛЬКО из листинга каталога src/lib/posts (glob "*.ts"),
запись — обратно в тот же файл. Никаких путей, собранных из внешних данных.
Правила скилла internal-linking: анкор = буквальная подстрока существующего
текста донора, максимум 3 ссылки с донора, заголовки/код-спаны не трогаем.
"""
import re
import sys
from pathlib import Path

POSTS_DIR = Path("/Users/egorbarkov/sonara/src/lib/posts").resolve()

def B(slug):
    return "/blog/" + slug

ANC = {
    B("kommercheskie-faktory-chek-list"): ["коммерческим факторам", "коммерческих запросов", "Уникальное описание", "коммерческие факторы"],
    B("beloe-seo-chto-eto"): ["по правилам поисковиков", "белое SEO", "белых методов"],
    B("kak-ponyat-chto-filtr-yandeksa"): ["фильтр Яндекса", "санкции", "АГС"],
    B("geo-protiv-seo-chto-meniaetsia-v-2026"): ["генеративных движков", "генеративные движки", "AI-поиске", "GEO-оптимизация"],
    B("kak-popast-v-otvety-gigachat"): ["ответах GigaChat", "ответы GigaChat", "GigaChat"],
    B("perplexity-i-ai-overviews-kak-citiruyut-sayty"): ["модели цитируют", "AI Overviews", "Perplexity"],
    B("modeli-upominayut-konkurentov-chto-delat"): ["конкурента", "у конкурентов", "упоминания", "называют конкурентов"],
    B("kak-izmerit-roi-ii-vidimosti"): ["метрики", "замер", "окупаемость"],
    B("kak-otkryt-sayt-ii-krawleram"): ["ИИ-краулеров", "ИИ-краулерам", "GPTBot", "ИИ-краулеры"],
    B("llms-txt-zachem-i-kak"): ["llms.txt"],
    B("aeo-dlya-internet-magazina"): ["ответных движков", "AEO"],
    B("seo-internet-magazina-2026"): ["SEO магазина", "SEO интернет-магазина", "продвижение интернет-магазина"],
    B("ii-kontent-i-pravila-poiska"): ["уникальный контент", "по правилам поисковиков", "ИИ-контент", "ИИ-контента"],
    B("title-i-description-normy-dliny-primery"): ["мета-тегов", "title и description", "Description", "Title"],
    B("posadochnaya-stranica-anatomiya"): ["посадочная страница", "посадочной страницы", "посадочных страниц", "лендинг"],
    B("kanibalizaciya-klyuchevyh-zaprosov"): ["один запрос-интент", "каннибализация", "каннибализации"],
    B("wordstat-instrukciya-s-chastotoy"): ["Вордстат", "Wordstat", "частотности"],
    B("wordstat-istoriya-zaprosov-sezonost"): ["по сезонам", "сезонности", "История запросов", "по сезону"],
    B("tehnicheskiy-audit-saita-samostoyatelno"): ["в составе аудита", "аудит текущего состояния", "технический аудит"],
    B("skorost-saita-ttfb-lcp-cls"): ["скорость загрузки", "Core Web Vitals", "скорость сайта", "LCP"],
    B("mobilnaya-versiya-mobile-first"): ["на мобильном", "мобильная версия", "mobile-first", "мобильной версии"],
    B("mikrorazmetka-schema-org-2026"): ["Schema.org", "микроразметка", "микроразметки"],
    B("robots-txt-dlya-yandex-i-google-primery"): ["robots.txt"],
    B("clean-param-chto-eto-i-kak-napisat"): ["Clean-param"],
    B("kak-proverit-zakryat-li-sayt-ot-indeksacii"): ["закрыть сайт целиком", "закрыт от индексации", "от индексации"],
    B("kak-proverit-i-uvelichit-indeksaciyu-sayta"): ["индексации сайта", "проиндексировано", "в индексе", "индексация"],
    B("kak-dobavit-sayt-v-vebmaster-poshagovo"): ["добавить сайт в Вебмастер", "Яндекс.Вебмастер", "Вебмастер"],
    B("yandex-vebmaster-instrumenty"): ["Вебмастер без GSC", "Вебмастере", "Вебмастером", "Яндекс.Вебмастере"],
    B("search-console-dlya-russkogo-saita"): ["Search Console"],
    B("skolko-stoit-seo-v-2026"): ["Если бюджет ограничен", "бюджета", "цена за тысячу", "сколько стоит SEO"],
    B("insont-ili-agentstvo"): ["агентство", "агентств"],
    B("kak-vybrat-seo-podryadchika"): ["подрядчика", "подрядчик", "исполнителя"],
    B("topvisor-ili-megaindex"): ["Topvisor", "МегаИндекс", "MegaIndex"],
    B("keys-so-ili-vebmaster"): ["Keys.so"],
    B("brendovye-zaprosy-i-iks"): ["брендовые запросы", "ИКС", "брендовых запросов"],
    B("geozaprosy-i-regionalnoe-prodvizhenie"): ["в вашем регионе", "в режиме региона", "по регионам", "гео-запросы", "региональное продвижение"],
    B("issledovanie-ii-vidimosti-rf"): ["исследование", "замер"],
    "/instrumenty/ochelovechivatel": ["шаблонность", "очеловечиватель", "очеловечить"],
    "/instrumenty/kanibalizatsiya": ["проверьте поиском по сайту", "проверить каннибализацию", "бесплатный прогон"],
    "/instrumenty/llms-txt": ["сгенерировать llms.txt", "генератор llms.txt"],
    "/instrumenty/proverka-krawlerov": ["проверка ботов", "проверить ботов", "проверка краулеров"],
    "/tseny": ["тарифы", "цены", "бесплатный тариф", "бесплатно"],
    "/geo": ["GEO-оптимизация", "GEO-продвижение", "готовят сайт к GEO"],
    "/seo": ["честное продвижение в Яндексе и Google", "SEO-аудит", "комплексное SEO"],
}

PLAN = {
    "beloe-seo-chto-eto": [B("kommercheskie-faktory-chek-list"), B("kak-ponyat-chto-filtr-yandeksa")],
    "kommercheskie-faktory-chek-list": [B("geozaprosy-i-regionalnoe-prodvizhenie")],
    "geo-protiv-seo-chto-meniaetsia-v-2026": [B("kak-popast-v-otvety-gigachat"), B("llms-txt-zachem-i-kak")],
    "kak-popast-v-otvety-gigachat": [B("perplexity-i-ai-overviews-kak-citiruyut-sayty"), B("modeli-upominayut-konkurentov-chto-delat"), B("llms-txt-zachem-i-kak")],
    "perplexity-i-ai-overviews-kak-citiruyut-sayty": [B("modeli-upominayut-konkurentov-chto-delat"), B("kak-izmerit-roi-ii-vidimosti"), B("kak-otkryt-sayt-ii-krawleram")],
    "modeli-upominayut-konkurentov-chto-delat": [B("kak-izmerit-roi-ii-vidimosti"), B("perplexity-i-ai-overviews-kak-citiruyut-sayty")],
    "kak-izmerit-roi-ii-vidimosti": [B("issledovanie-ii-vidimosti-rf"), B("perplexity-i-ai-overviews-kak-citiruyut-sayty")],
    "kak-otkryt-sayt-ii-krawleram": [B("llms-txt-zachem-i-kak"), "/instrumenty/proverka-krawlerov"],
    "llms-txt-zachem-i-kak": [B("kak-otkryt-sayt-ii-krawleram"), "/instrumenty/llms-txt"],
    "aeo-dlya-internet-magazina": [B("seo-internet-magazina-2026"), B("kak-popast-v-otvety-gigachat")],
    "aeo-dlia-bankov-i-fintech": [B("kak-popast-v-otvety-gigachat"), B("aeo-dlya-internet-magazina"), B("modeli-upominayut-konkurentov-chto-delat")],
    "ii-kontent-i-pravila-poiska": ["/instrumenty/ochelovechivatel", B("beloe-seo-chto-eto")],
    "title-i-description-normy-dliny-primery": [],
    "posadochnaya-stranica-anatomiya": [B("wordstat-instrukciya-s-chastotoy"), B("kanibalizaciya-klyuchevyh-zaprosov"), B("title-i-description-normy-dliny-primery")],
    "kanibalizaciya-klyuchevyh-zaprosov": ["/instrumenty/kanibalizatsiya"],
    "wordstat-instrukciya-s-chastotoy": [B("wordstat-istoriya-zaprosov-sezonost"), B("geozaprosy-i-regionalnoe-prodvizhenie")],
    "wordstat-istoriya-zaprosov-sezonost": [B("wordstat-instrukciya-s-chastotoy")],
    "tehnicheskiy-audit-saita-samostoyatelno": [B("skorost-saita-ttfb-lcp-cls"), B("mikrorazmetka-schema-org-2026"), "/seo"],
    "skorost-saita-ttfb-lcp-cls": [B("mobilnaya-versiya-mobile-first")],
    "mobilnaya-versiya-mobile-first": [B("skorost-saita-ttfb-lcp-cls"), B("tehnicheskiy-audit-saita-samostoyatelno")],
    "mikrorazmetka-schema-org-2026": [B("tehnicheskiy-audit-saita-samostoyatelno")],
    "kak-dobavit-sayt-v-vebmaster-poshagovo": [B("yandex-vebmaster-instrumenty"), B("search-console-dlya-russkogo-saita"), B("robots-txt-dlya-yandex-i-google-primery")],
    "yandex-vebmaster-instrumenty": [B("search-console-dlya-russkogo-saita"), B("kak-proverit-i-uvelichit-indeksaciyu-sayta")],
    "search-console-dlya-russkogo-saita": [B("kak-dobavit-sayt-v-vebmaster-poshagovo"), B("yandex-vebmaster-instrumenty")],
    "kak-proverit-zakryat-li-sayt-ot-indeksacii": [B("robots-txt-dlya-yandex-i-google-primery"), B("kak-proverit-i-uvelichit-indeksaciyu-sayta")],
    "robots-txt-dlya-yandex-i-google-primery": [B("clean-param-chto-eto-i-kak-napisat"), B("kak-proverit-zakryat-li-sayt-ot-indeksacii"), B("kak-dobavit-sayt-v-vebmaster-poshagovo")],
    "clean-param-chto-eto-i-kak-napisat": [B("robots-txt-dlya-yandex-i-google-primery"), B("kak-proverit-i-uvelichit-indeksaciyu-sayta")],
    "kak-proverit-i-uvelichit-indeksaciyu-sayta": [B("yandex-vebmaster-instrumenty"), B("search-console-dlya-russkogo-saita")],
    "skolko-stoit-seo-v-2026": [B("insont-ili-agentstvo"), B("kak-vybrat-seo-podryadchika"), "/tseny"],
    "insont-ili-agentstvo": [B("kak-vybrat-seo-podryadchika"), "/tseny", B("skolko-stoit-seo-v-2026")],
    "kak-vybrat-seo-podryadchika": [B("insont-ili-agentstvo"), B("skolko-stoit-seo-v-2026")],
    "topvisor-ili-megaindex": [B("skolko-stoit-seo-v-2026")],
    "keys-so-ili-vebmaster": [B("topvisor-ili-megaindex"), "/tseny"],
    "kak-ponyat-chto-filtr-yandeksa": [B("kommercheskie-faktory-chek-list")],
    "brendovye-zaprosy-i-iks": [],
    "geozaprosy-i-regionalnoe-prodvizhenie": [B("wordstat-istoriya-zaprosov-sezonost")],
    "seo-internet-magazina-2026": [B("ii-kontent-i-pravila-poiska"), B("kommercheskie-faktory-chek-list")],
}

def find_body(text):
    m = re.search(r"body: `", text)
    if not m:
        return None
    start = m.end()
    i = start
    while i < len(text):
        if text[i] == "`" and text[i - 1] != "\\":
            return (start, i)
        i += 1
    return None

def insert_links(body, targets):
    lines = body.split("\n")
    report = []
    used_spans = []
    for url in targets:
        cands = ANC.get(url)
        if not cands:
            report.append((url, "нет кандидатов", ""))
            continue
        placed = False
        for cand in cands:
            if placed:
                break
            for li, line in enumerate(lines):
                if line.lstrip().startswith("#"):
                    continue
                for m in re.finditer(re.escape(cand), line):
                    s, e = m.start(), m.end()
                    if line[:s].count("`") % 2 == 1:
                        continue
                    if s > 0 and line[s - 1] == "[":
                        continue
                    if e < len(line) and line[e] == "]":
                        continue
                    if re.search(r"\[[^\]]*$", line[:s]):
                        continue
                    if any(ul == li and not (e <= us or s >= ue) for ul, us, ue in used_spans):
                        continue
                    lines[li] = line[:s] + "[" + cand + "](" + url + ")" + line[e:]
                    line = lines[li]
                    used_spans.append((li, s, s + len(cand) + len(url) + 4))
                    report.append((url, "ok", cand))
                    placed = True
                    break
                if placed:
                    break
        if not placed:
            report.append((url, "НЕ НАЙДЕНО", "/".join(cands[:3])))
    return "\n".join(lines), report

def main():
    dry = "--apply" not in sys.argv
    total_ok, total_fail = 0, 0
    incoming = {}
    files = {p.stem: p for p in POSTS_DIR.glob("*.ts")}
    for donor, targets in PLAN.items():
        path = files.get(donor)
        if path is None or path.parent != POSTS_DIR:
            print("!! нет файла " + donor)
            continue
        src = path.read_text(encoding="utf-8")
        span = find_body(src)
        if not span:
            print("!! " + donor + ": body не найден")
            continue
        body = src[span[0]:span[1]]
        new_body, rep = insert_links(body, targets)
        status = "; ".join(u + ":" + st + "(" + a + ")" for u, st, a in rep)
        okc = sum(1 for _, st, _ in rep if st == "ok")
        failc = sum(1 for _, st, _ in rep if st != "ok")
        total_ok += okc
        total_fail += failc
        for u, st, _ in rep:
            if st == "ok":
                incoming[u] = incoming.get(u, 0) + 1
        print(donor + ": +" + str(okc) + " (fail " + str(failc) + ") | " + status)
        if not dry and new_body != body:
            path.write_text(src[:span[0]] + new_body + src[span[1]:], encoding="utf-8")
    print()
    print("ИТОГО: +" + str(total_ok) + " ссылок, промахов " + str(total_fail))
    print("Входящие (>4 = перебор):")
    for u, c in sorted(incoming.items(), key=lambda x: -x[1]):
        flag = " <== ПРЕВЫШЕНО" if c > 4 else ""
        print("  " + str(c) + "  " + u + flag)

main()
