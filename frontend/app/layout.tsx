import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sze Chuan House",
  description: "Sze Chuan House's official website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
