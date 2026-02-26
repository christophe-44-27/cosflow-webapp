import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/index.css";
import { AuthProviderWrapper } from "./features/auth";
import { LocaleProvider } from "./lib/locale-context";
import { Toaster } from "./components/ui/sonner";
import { BugsnagProvider } from "./components/bugsnag-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BugsnagProvider>
          <LocaleProvider>
            <AuthProviderWrapper>
              {children}
            </AuthProviderWrapper>
          </LocaleProvider>
        </BugsnagProvider>
        <Toaster />
      </body>
    </html>
  );
}
