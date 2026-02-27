import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIGLO - Workframe Logístico",
  description: "Panel de control B2B multi-tenant del Sistema de Gestión SMG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
