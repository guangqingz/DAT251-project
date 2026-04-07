import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/ui/navbar/Navbar";
import Footer from "@/app/ui/Footer";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Sze Chuan House",
  description: "Sze Chuan House's official website",
    icons: {
      icon: [
          {rel: "icon", url: "/logo.png"}
      ]
    }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`antialiased min-h-dvh grid grid-rows-[auto_1fr_auto]`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
