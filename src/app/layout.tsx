import type { Metadata } from "next";
import { Creepster, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { SocketStatus } from "@/components/SocketStatus";

const creepster = Creepster({
  variable: "--font-creepster",
  subsets: ["latin"],
  weight: "400",
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Glou garou",
  description: "Glou garou",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${creepster.variable} ${crimsonPro.variable} antialiased`}
      >
        {children}
        {/* Temporairement désactivé - remplacé par Supabase Realtime
        <SocketStatus />
        */}
      </body>
    </html>
  );
}
