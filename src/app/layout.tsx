import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pita Con Nudo | Maternity Lifestyle",
  description: "Maternity Lifestyle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="bg-[#A67E6B] py-4 text-white text-center border-t">
        © {new Date().getFullYear()} Todos los derechos reservados por PITA CON NUDO, SOCIEDAD ANONIMA 
        </footer>
      </body>
    </html>
  );
}
