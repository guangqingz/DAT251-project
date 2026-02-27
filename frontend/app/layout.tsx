import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

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
          <nav className={"flex justify-between items-center mx-6"}>
              <Image src={"/logo.PNG"} alt={"Logo of the restaurant"} width={100} height={100}/>
              <ul className={"flex gap-3"}>
                  <li><Link href="/menu" className={"hover:text-gray-600"}>Menu</Link></li>
                  <li><Link href="/booking" className={"p-2 bg-gray-400 rounded-md px-3 border-2 border-gray-400 hover:bg-white hover:border-2 hover:border-gray-400"}>Book now</Link></li>
                  <li><Link href="/contact" className={"p-2 bg-black rounded-md px-3 text-white border-2 hover:bg-white hover:border-2 hover:text-black hover:border-black"}>Contact</Link></li>
              </ul>
          </nav>
        {children}
      </body>
    </html>
  );
}
