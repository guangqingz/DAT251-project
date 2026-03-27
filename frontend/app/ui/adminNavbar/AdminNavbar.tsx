"use client";

import {
  Squares2X2Icon,
  CalendarDaysIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
export default function AdminNavbar() {
  return (
    <aside className="w-60 bg-[#8B2E1A] rounded-r-2xl text-white flex flex-col justify-between py-6">
      <div>
        <img
          src="/logo.png"
          alt="Sze Chuan House logo"
          className="w-[170px] mx-auto mb-8 block"
        />

        <nav className="flex flex-col">
          <button className="flex items-center gap-4 px-6 py-4 tracking-widest opacity-100 hover:bg-[#B25533] transition-colors duration-200">
            <Squares2X2Icon className="w-8 h-8" />
            <span className="text-l">Dashboard</span>
          </button>

          <button className="flex items-center gap-4 px-6 py-4 tracking-widest opacity-100 hover:bg-[#B25533] transition-colors duration-200">
            <CalendarDaysIcon className="w-8 h-8" />
            <span className="text-l">Bookings</span>
          </button>
        </nav>
      </div>

      <button className="flex items-center gap-3 px-6 py-3 opacity-100  hover:bg-[#B25533] transition-colors duration-200">
        <ArrowRightOnRectangleIcon className="w-8 h-8" />
        <span className="text-l"> Log ut</span>
      </button>
    </aside>
  );
}