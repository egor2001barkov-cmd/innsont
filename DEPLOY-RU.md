# Как выложить insont.ru

Код: https://github.com/egor2001barkov-cmd/innsont  
Сервер тот же, что у Elizon: `151.248.113.174` (Timeweb VPS, alias `elizon` в ~/.ssh).  
Elizon слушает `:3000`, INSONT — `:3001`. Caddy разводит домены.

## DNS в reg.ru

Панель: Домены → insont.ru → DNS / Управление зоной.

NS должны быть `ns1.reg.ru` и `ns2.reg.ru`.

| Имя | Тип | Значение |
|-----|-----|----------|
| `@` | A | `151.248.113.174` |
| `www` | A | `151.248.113.174` |

Удалите:

- парковку Рег.ру
- A-записи на чужие IP
- CNAME на `www` вроде `parking.reg.ru` или `*.vercel-dns.com`

TTL 300–3600. Обычно 5–30 минут, иногда до суток.

Проверка:

```bash
dig +short insont.ru A
dig +short www.insont.ru A
# должно быть 151.248.113.174
```

Когда A-запись встанет, Caddy сам выпустит HTTPS (Let's Encrypt).

## Не ставьте на Vercel

С российских мобильных сетей Vercel часто не открывается. Elizon из‑за этого уже переезжал на этот VPS.

## Деплой обновлений (через git, без правок на сервере)

На VPS в каталоге проекта (там, где `docker-compose.yml`):

```bash
git pull
docker compose build
docker compose up -d
curl -s -o /dev/null -w "%{http_code}" https://insont.ru/   # ждём 200
```

Прямые правки файлов на сервере не делаем: история и откат — только через git.

## Переменные окружения на сервере

В `.env` рядом с `docker-compose.yml` (в контейнер пробрасываются `environment`):

- `YANDEX_WORDSTAT_TOKEN` — сбор ключей (можно без него: работают подсказки)
- `DEEPSEEK_API_KEY` (+ `DEEPSEEK_MODEL`, по умолчанию `deepseek-4.1-flash`) — основной LLM;
- `YANDEXGPT_API_KEY` и `YANDEXGPT_FOLDER_ID` — резервный LLM.
  Получить: console.yandex.cloud → выбрать каталог → скопировать Folder ID →
  Сервисные аккаунты → создать → API-ключ. Без ключей кабинет работает,
  но статьи генерируются в demo-режиме (каркасные шаблоны).

После изменения `.env` перезапустить: `docker compose up -d`.

## Данные кабинета

`data/` монтируется в контейнер volume'ом и переживает рестарты:

- `data/accounts/{id}/account.json` — аккаунты: профиль, scrypt-хэш пароля, счётчики тарифа
- `data/accounts/{id}/articles/` — статьи пользователей
- `data/accounts/{id}/wp/` — пароли приложений WordPress (только на сервере)
- `data/sessions/` — файлы сессий (sha256 токена из httpOnly-куки)
- `data/referrals.json` — реферальная программа

Бэкап на ночь достаточно делать по каталогу `data/`.

## Безопасность

- Пароли хранятся только как scrypt-хэши с солью; восстановлению не подлежат.
- Сессии: httpOnly + SameSite=Lax + Secure (в production) куки, файлы сессий — sha256(токена).
- Вход: rate-limit по IP (20/10 мин), блок почты после 5 неудачных попыток на 15 минут.
- Одинаковое время ответа на существующую и несуществующую почту (защита от перебора).


## Рабочая схема деплоя: systemd (с 27–29.10.2026)

Сайты работают как systemd-сервисы (НЕ docker): `innsont-app.service` и `elizon-app.service`.
Runtime-каталог: `/opt/innsont-app` (standalone-сборка + `.env` + `data/`). Git-клон: `/opt/innsont`.

```bash
ssh elizon
export PATH=/opt/node/bin:$PATH

# 1. сборка на хосте (typecheck отключён в next.config — 1ГБ RAM; типы проверяются локально перед пушем)
cd /opt/innsont && git pull && npm ci --no-audit --no-fund
NODE_OPTIONS='--max-old-space-size=640' npm run build

# 2. синк в runtime-каталог (data/ защищён; ВАЖНО: --exclude=.env — Next кладёт билд-.env в standalone!)
rsync -a --delete /opt/innsont/.next/standalone/ /opt/innsont-app/ --exclude=data --exclude=.env
rsync -a --delete /opt/innsont/.next/static/  /opt/innsont-app/.next/static/
rsync -a /opt/innsont/public/ /opt/innsont-app/public/

# 3. рестарт и проверка
systemctl restart innsont-app && sleep 5
systemctl is-active innsont-app   # active
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3001/   # 200
```

Runtime-`.env` в /opt/innsont-app (НЕ перезаписывать синком): PORT=3001, HOSTNAME=127.0.0.1,
NODE_ENV=production, NEXT_PUBLIC_SITE_URL, ключи LLM/Wordstat. Инцидент 29.10: rsync без
--exclude=.env затёр runtime-env билд-версией без PORT → сервис падал EADDRINUSE на :3000.
Git-`.env` в /opt/innsont урезан до NEXT_PUBLIC_SITE_URL, чтобы standalone не утаскивал лишнее.

Важно: деплой Elizon не должен затирать `/etc/caddy/Caddyfile` без блока insont.ru — 19.10.2026
это уже случилось (сайт лежал ~16 часов, восстановлен 20.10).

## Права на каталог данных (один раз после клонирования)

Контейнер работает от uid 1001 (nextjs), каталог данных — от root после git clone:

```bash
ssh elizon "chown -R 1001:65533 /opt/innsont/data"
```

Иначе регистрация/вход падают с 500 (нет прав на запись account.json). Проверка:
`curl -s -o /dev/null -w "%{http_code}" -X POST https://insont.ru/api/auth/register ...` → 200/409.

## Диск и память VPS (1 ГБ RAM, инцидент 27.10.2026)

Сборка на сервере (`docker compose build`) на 1-ГБ машине дважды роняла docker-демон
(OOM) и заполняла диск до 98% сборочным кэшем в /var/lib/containerd. Правила:

- После КАЖДОЙ сборки: `docker builder prune --all -f` и раз в месяц `docker system prune -a -f`.
- Контроль: `df -h /` (держать <80%) и `docker system df`.
- Сборки — вне часов пик; при 502 после сборки: `systemctl restart docker && cd /opt/innsont && docker compose up -d`.
- Долгосрочно: собирать образ вне VPS (локально/CI) и доставлять через registry, либо поднять тариф VPS.
