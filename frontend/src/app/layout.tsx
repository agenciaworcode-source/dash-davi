import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beautyderm | Dashboard de Precisão",
  description: "Sistema analítico integrado ao CRM Agendor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="light">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
        <link rel="icon" href="/logo.png" />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} antialiased bg-[#f8f9fb] text-[#191c1e] font-body`}
      >
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
