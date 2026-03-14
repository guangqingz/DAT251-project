import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import {PhoneArrowDownLeftIcon} from '@heroicons/react/24/outline';

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
        className={`antialiased min-h-[100dvh] grid grid-rows-[auto_1fr_auto]`}
      >
          <nav className={"flex justify-between items-center mx-6"}>
              <Link href={"/"}>
                <Image src={"/logo.PNG"} alt={"Logo of the restaurant"} width={100} height={100}/>
              </Link>
              <ul className={"flex gap-3"}>
                  <li><Link href="/menu" className={"text-white hover:text-black"}>Menu</Link></li>
                  <li><Link href="/contact" className={"p-2 text-white px-3 hover:text-black"}>Contact</Link></li>
                  <li><Link href="/booking" className={"p-2 text-white rounded-md px-3 border-2 border-white hover:bg-custom-red hover:border-2 hover:border-black"}>Book now</Link></li>
              </ul>
          </nav>
          <div>
            {children}
          </div>
        <footer className={"flex justify-between px-30 py-6 bg-red-900 text-white"}>
            <div>
                <h3 className={"text-2xl mb-3"}>Opening hours</h3>
                <p>Open Tuesday to Sunday 1:30 - 9:30 pm</p>
            </div>
            <div>
                <h3 className={"text-2xl mb-3"}>Address</h3>
                <address className={"not-italic"}>
                    <a href={"https://maps.app.goo.gl/RTmRGc1UnXhyFcev5"} className={"underline"}>Nedre Korskirkeallmenningen 9</a>
                    <p>5017 Bergen</p>
                    <p>Norway</p>
                </address>
            </div>
            <div>
                <h3 className={"text-2xl mb-3"}>Contact</h3>
                <address className={"not-italic"}>
                    {/*<a href={}></a> placeholder for email*/}
                    <a href={"tel:+47-553-136-90"} className={"flex gap-2 underline"}>
                        <PhoneArrowDownLeftIcon className={"h-[18px] w-[18px]"}/>
                        <p>55313690</p>
                    </a>
                    <a href={"https://www.facebook.com/szechuanhousebergen/"} className={"underline"}>Facebook</a>
                </address>
            </div>
        </footer>
      </body>
    </html>
  );
}
