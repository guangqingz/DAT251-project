import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import {PhoneArrowDownLeftIcon} from '@heroicons/react/24/outline';
import Container from "@/app/ui/Container";

export const metadata: Metadata = {
  title: "Sze Chuan House",
  description: "Sze Chuan House's official website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`antialiased min-h-[100dvh] grid grid-rows-[auto_1fr_auto]`}
      >
      <Container>
          <nav className={"flex justify-between items-center border-b-2 border-white"}>
              <Link href={"/"}>
                  <Image src={"/logo.png"} alt={"Logo of the restaurant"} width={200} height={200}/>
              </Link>
              <ul className={"flex gap-10 uppercase font-title"}>
                  <li><Link href="/menu" className={"btn py-2 text-white"}>Meny</Link></li>
                  <li><Link href="/contact" className={"btn py-2 text-white"}>Kontakt oss</Link></li>
                  <li><Link href="/booking" className={"py-3 px-5 text-white border-2 border-white rounded-3xl hover:bg-custom-eggwhite  hover:border-2 hover:border-custom-eggwhite hover:text-black transition-colors duration-300"}>Reserver bord</Link></li>
              </ul>
          </nav>
      </Container>
          <section>
            {children}
          </section>
        <footer className={"bg-custom-red text-white"}>
            <Container style={"flex justify-between px-30 py-8"}>
                <section>
                    <h3 className={"text-xl mb-3 uppercase font-bold"}>åpningstider</h3>
                    <ul className={"flex flex-col gap-2"}>
                        <li>Tirsdag - søndag 13:30 - 21:30</li>
                        <li>Mandag: stengt</li>
                    </ul>
                </section>
                <section>
                    <h3 className={"text-xl mb-3 uppercase font-bold"}>Addresse</h3>
                    <address className={"not-italic flex flex-col gap-2"}>
                        <a href={"https://maps.app.goo.gl/RTmRGc1UnXhyFcev5"} className={"underline"}>Nedre Korskirkeallmenningen 9</a>
                        <p>5017 Bergen, Norge</p>
                    </address>
                </section>
                <section>
                    <h3 className={"text-xl mb-3 uppercase font-bold"}>Kontakt</h3>
                    <address className={"not-italic flex flex-col gap-2"}>
                        {/*<a href={}></a> placeholder for email*/}
                        <a href={"tel:+47-553-136-90"} className={"flex gap-2 underline items-center"}>
                            <PhoneArrowDownLeftIcon className={"h-4.5 w-4.5"}/>
                            <p>+47 553 136 90</p>
                        </a>
                        <a href={"https://www.facebook.com/szechuanhousebergen/"} className={"underline"}>Facebook</a>
                    </address>
                </section>
            </Container>
        </footer>
      </body>
    </html>
  );
}
