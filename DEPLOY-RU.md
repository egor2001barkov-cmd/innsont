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
- `YANDEXGPT_API_KEY` и `YANDEXGPT_FOLDER_ID` — генерация статей.
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


## Рабочая схема деплоя (с 20.10.2026)

Каталог на сервере: `/opt/innsont` (git-клон репозитория).

```bash
ssh elizon
cd /opt/innsont
git pull
docker compose build
docker stop innsont-web-1 && docker compose up -d
curl -s -o /dev/null -w "%{http_code}" https://insont.ru/   # 200
```

Файлы, живущие только на сервере (не в git): `.env` (NEXT_PUBLIC_SITE_URL, ключи YandexGPT/Wordstat)
и `docker-compose.override.yml` (привязка порта к 127.0.0.1:3001). Проксирует Caddy — блоки
`insont.ru` + `www.insont.ru` в `/etc/caddy/Caddyfile` (бэкап рядом, `.backup-*`).

Важно: деплой Elizon не должен затирать `/etc/caddy/Caddyfile` без блока insont.ru — 19.10.2026
это уже случилось (сайт лежал ~16 часов, восстановлен 20.10).
