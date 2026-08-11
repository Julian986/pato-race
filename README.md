# Pato Race 2026

Plataforma web del evento solidario **Pato Race** (Opción 2): landing, registro, Mercado Pago, ticket digital, compartir y dashboard público de recaudación.

## Desarrollo

```bash
pnpm install
pnpm dev
# o: npm run dev
```

Abre [http://localhost:6632](http://localhost:6632).

## Variables de entorno

Copiá `.env.example` a `.env.local`:

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública (back_urls MP y share) |
| `TICKET_PRICE` | Precio del ticket (default 10000) |
| `GOAL_AMOUNT` | Meta de recaudación en ARS |
| `MP_ACCESS_TOKEN` | Token de Mercado Pago (sandbox/prod) |
| `DATABASE_URL` | Neon Postgres (opcional) |

Sin `MP_ACCESS_TOKEN`, el checkout usa un **pago simulado** local (`/api/mp/mock-pay`) para probar el flujo completo.

Sin `DATABASE_URL`, los datos se guardan en `data/store.json`.

## Flujo

1. Landing → **Adoptá tu pato**
2. `/participar` → datos + Mercado Pago
3. Webhook / mock aprueba el pago
4. `/ticket/[id]` → comprobante + WhatsApp / copiar enlace
5. Contadores públicos en `#stats` (polling `/api/stats`)
