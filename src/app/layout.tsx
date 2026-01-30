import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "สารานุกรมนิติศาสตร์อิสลาม ",
  description: "Islamic Jurisprudence Learning Platform",
  icons: {
    icon: "/fiqh/favicon.png",
    shortcut: "/fiqh/favicon.png",
    apple: "/fiqh/munadiyaIcon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="emotion-insertion-point" content="" />
        <link rel="icon" href="/fiqh/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/fiqh/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/fiqh/munadiyaIcon.png" />
      </head>
      <body
        className={`${playfair.variable} ${lato.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
