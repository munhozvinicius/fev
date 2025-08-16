
import "./globals.css";
import { ReactNode } from "react";
export const metadata = { title: "Funil de Vendas" };
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="p-4">
          <div className="text-xl font-semibold mb-4">Funil de Vendas</div>
          {children}
        </div>
      </body>
    </html>
  );
}
