import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LocaleProvider } from "@/components/LocaleProvider";
import { SkipLink } from "@/components/SkipLink";
import { getDictionary } from "@/content/i18n";
import { site } from "@/content/site";
import { restaurantJsonLd } from "@/lib/seo";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const dict = getDictionary();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Portofino",
    "Italian restaurant Jounieh",
    "beachfront restaurant Lebanon",
    "Jounieh Old Souk",
    "seafood Jounieh",
    "live music restaurant Lebanon",
  ],
  robots: { index: true, follow: true },
  // Metadata icons are not prefixed with basePath automatically, unlike
  // <Link> and next/image, so do it here.
  // TODO: add the real favicon and apple-touch-icon to /public.
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.svg` },
};

export const viewport: Viewport = {
  themeColor: "#14263c",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={dict.htmlLang} className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-dvh antialiased">
        <script
          type="application/ld+json"
          // Static, build-time JSON from our own config — no user input.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(restaurantJsonLd()),
          }}
        />
        <LocaleProvider>
          <SkipLink />
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
