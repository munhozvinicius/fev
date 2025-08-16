import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { NextRequest } from "next/server";

// Garantir execução em Node.js (não edge) e rota dinâmica no App Router
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Configuração do NextAuth (poderia estar em "@/lib/auth")
const auth = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
});

// Exporta handlers explícitos como funções (evita erro "Invalid configuration GET")
export async function GET(req: NextRequest, ctx: any) {
  // @ts-ignore - a assinatura é compatível em runtime
  return auth(req, ctx);
}

export async function POST(req: NextRequest, ctx: any) {
  // @ts-ignore - a assinatura é compatível em runtime
  return auth(req, ctx);
}
