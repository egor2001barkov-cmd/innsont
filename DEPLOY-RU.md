# Как выложить innsont.ru

Код: https://github.com/egor2001barkov-cmd/innsont  
Сервер тот же, что у Elizon: `168.222.194.23` (Timeweb VPS).  
Elizon слушает `:3000`, INNSONT — `:3001`. Caddy разводит домены.

## DNS в reg.ru

Панель: Домены → innsont.ru → DNS / Управление зоной.

NS должны быть `ns1.reg.ru` и `ns2.reg.ru`.

| Имя | Тип | Значение |
|-----|-----|----------|
| `@` | A | `168.222.194.23` |
| `www` | A | `168.222.194.23` |

Удалите:

- парковку Рег.ру
- A-записи на чужие IP
- CNAME на `www` вроде `parking.reg.ru` или `*.vercel-dns.com`

TTL 300–3600. Обычно 5–30 минут, иногда до суток.

Проверка:

```bash
dig +short innsont.ru A
dig +short www.innsont.ru A
# должно быть 168.222.194.23
```

Когда A-запись встанет, Caddy сам выпустит HTTPS (Let's Encrypt).

## Не ставьте на Vercel

С российских мобильных сетей Vercel часто не открывается. Elizon из‑за этого уже переезжал на этот VPS.
