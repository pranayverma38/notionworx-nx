import LayoutModals from "@/components/modals";
// import WowInit from "@/components/common/WowInit";
import {
  DM_Sans,
  Kumbh_Sans,
  Outfit,
  Red_Hat_Display,
  Urbanist,
} from "next/font/google";
import "./globals.scss";
import ScrollToTop from "@/components/common/ScrollToTop";

const dmSans = DM_Sans({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-dm-sans",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  variable: "--font-kumbh-sans",
});

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-red-hat-display",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${urbanist.variable} ${outfit.variable} ${kumbhSans.variable} ${redHatDisplay.variable}`}
    >
      <body>
        {/* <WowInit /> WOW.js off for now */}
        {children}
        <LayoutModals />
        <ScrollToTop />
      </body>
    </html>
  );
}
