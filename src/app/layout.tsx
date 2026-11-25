import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#050505",
};

export const metadata: Metadata = {
  title: "Sony WH‑1000XM6 — Silence, perfected.",
  description:
    "Flagship wireless noise-cancelling headphones. Precision-engineered acoustic architecture, adaptive multi-microphone ANC, and AI-enhanced audio upscaling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050505] font-sans text-white/90 antialiased selection:bg-[#0050FF]/35">
        {children}
      </body>
    </html>
  );
}
