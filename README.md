
# Funil de Vendas — v4.1-fix

- Next.js 14 (App Router) + NextAuth (Google)
- Google Sheets (Service Account) como base
- Tema branco / botões roxo-escuro
- Filtros: Razão Social, etapas múltiplas, filtros rápidos
- Corrigido: imports usam `@/lib/...` (não `@/src/lib/...`).

## Rodar local
1. Crie `.env.local` na raiz (use o que já geramos)
2. `npm install`
3. `npm run dev` → http://localhost:3000

## Deploy na Vercel
- Crie as **mesmas** variáveis do `.env.local` em Project → Settings → Environment Variables
- No OAuth Client do Google adicione os URIs da Vercel:
  - `https://SEU-PROJETO.vercel.app`
  - `https://SEU-PROJETO.vercel.app/api/auth/callback/google`
