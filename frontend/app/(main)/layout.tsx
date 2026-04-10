import type { Metadata } from "next";
import "@/app/globals.css";
import {PhoneArrowDownLeftIcon} from '@heroicons/react/24/outline';
import Container from "@/app/ui/Container";
import Navbar from "@/app/ui/navbar/Navbar";
import Providers from "@/app/providers";

export const metadata: Metadata = {
  title: "Sze Chuan House",
  description: "Sze Chuan House's official website",
    icons: {
      icon: [
          {rel: "icon", url: "/logo_black.png"}
      ]
    }
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className={`antialiased min-h-dvh grid grid-rows-[auto_1fr_auto]`}>
      <Providers>
        <Navbar/>
          <main>
            {children}
          </main>
          <footer className={"bg-custom-red text-white z-20"}>
            <Container style={"flex flex-col px-30 py-8 gap-10 items-center md:flex-row md:justify-between text-center md:text-left"}>
              <section>
                <h3 className={"text-lg mb-3 uppercase font-bold"}>åpningstider</h3>
                <ul className={"flex flex-col gap-2"}>
                  <li>Mandag: stengt</li>
                  <li>Tirsdag - søndag: 13:30 - 21:30</li>
                </ul>
              </section>
              <section>
                <h3 className={"text-lg mb-3 uppercase font-bold"}>Adresse</h3>
                <address className={"not-italic flex flex-col gap-2"}>
                  <a href={"https://maps.app.goo.gl/RTmRGc1UnXhyFcev5"} className={"underline"}>Nedre Korskirkeallmenningen 9</a>
                  <p>5017 Bergen, Norge</p>
                </address>
              </section>
              <section>
                <h3 className={"text-lg mb-3 uppercase font-bold"}>Kontakt</h3>
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
        </Providers>
      </div>
  );
}
