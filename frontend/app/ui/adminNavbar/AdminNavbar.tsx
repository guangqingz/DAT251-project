"use client";

import {
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function AdminNavbar() {
  const pathname = usePathname();

  const isDashboardPage = pathname === "/dashboard";
  const isBookingPage = pathname === "/dashboard/booking";
  const isMenuPage= pathname === "/dashboard/menu";

  async function logout() {
        await fetch("http://localhost:8080/users/logout", {
            method: "POST",
            credentials: "include",
        });
  };

  return (
    <aside className="w-60 bg-[#8B2E1A] rounded-r-2xl text-white flex flex-col justify-between py-6">
      <div>
        <img
          src="/logo_white.png"
          alt="Sze Chuan House logo"
          className="w-[170px] mx-auto mb-8 block"
        />

        <nav className="flex flex-col">
          <Link href="/dashboard"
            className={clsx(
              "flex items-center gap-4 px-6 py-4 tracking-widest transition-colors duration-200 hover:bg-[#AA5136]",
                {"bg-[#AA5136]": isDashboardPage,}
            )}
          >
            <Squares2X2Icon className="w-8 h-8" />
            <span className="text-l">Dashboard</span>
          </Link>

          <Link href="/dashboard/booking"
            className={clsx(
              "flex items-center gap-4 px-6 py-4 tracking-widest opacity-100 hover:bg-[#AA5136] transition-colors duration-200",
                {"bg-[#AA5136]": isBookingPage,}
            )}
          >
            <CalendarDaysIcon className="w-8 h-8" />
            <span className="text-l">Bookings</span>
          </Link>

          <Link href="/dashboard/menu"
            className={clsx(
              "flex items-center gap-4 px-6 py-4 tracking-widest opacity-100 hover:bg-[#AA5136] transition-colors duration-200",
              {"bg-[#AA5136]": isMenuPage,}
            )}
          >
            <ClipboardDocumentListIcon className="w-8 h-8" />
            <span className="text-l">Menu</span>
          </Link>
        </nav>
      </div>

      <Link href="/login" className="flex items-center gap-4 px-6 py-4 tracking-widest opacity-100 hover:bg-[#AA5136] transition-colors duration-200" onClick={() => logout()}>
        <ArrowRightOnRectangleIcon className="w-8 h-8"/>
        <span className="text-l">Log ut</span>
      </Link>
    </aside>
  );
}