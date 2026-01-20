import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/index.css";
import { AuthProviderWrapper } from "./features/auth";
import { LocaleProvider } from "./lib/locale-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getServerLocale } from "./lib/server-locale";

export const metadata: Metadata = {
  metadataBase: new URL('https://cosflow.app'),
  title: {
    default: 'Cosflow',
    template: '%s | Cosflow',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();
  const lang = locale === 'fr' ? 'fr' : 'en';

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider>
          <AuthProviderWrapper>
            {children}
          </AuthProviderWrapper>
        </LocaleProvider>
      </body>
    </html>
  );
}
