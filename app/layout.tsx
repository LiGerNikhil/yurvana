import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

import { Providers } from "@/app/providers";
import { RfqCartProvider } from "@/components/site/rfq-cart";
import { ToastProvider } from "@/components/site/toast";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingRfqButton } from "@/components/site/FloatingRfqButton";

import "./globals.css";

const fontHeading = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const fontBody = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YURVANA AGRO SOLUTIONS",
  description:
    "B2B sourcing of premium herbs, seeds, oils, extracts and natural ingredients.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fontHeading.variable} ${fontBody.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <RfqCartProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <FloatingRfqButton />
              <Footer />
            </ToastProvider>
          </RfqCartProvider>
        </Providers>
      </body>
    </html>
  );
}
