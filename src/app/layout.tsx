import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "studia+",
  description: "Tu plataforma de estudio inteligente",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "studia+",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta name="theme-color" content="#11131A" />
      </head>
      <body className="font-sans antialiased text-text-primary bg-deep-ink">
        {children}
      </body>
    </html>
  );
}
