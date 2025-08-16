import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Garantir execução em Node.js (não edge) e rota dinâmica no App Router
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
});

export { handler as GET, handler as POST };
