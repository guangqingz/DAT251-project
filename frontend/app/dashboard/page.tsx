"use client";

import { CalendarIcon, PhoneIcon, MagnifyingGlassIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import  AdminNavbar  from "@/app/ui/adminNavbar/AdminNavbar";
import SearchBar from "@/app/ui/searchBar";
import { useEffect, useState } from "react";

type Booking = {
  id: string;
  email: string;
  phoneNumber: number;
  numberGuest: number;
  comment: string;
  date: string;
  time: string;
};

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const currentDateText = new Date().toLocaleDateString("no-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const filteredBookings = bookings.filter((booking) => {
  const query = searchQuery.toLowerCase().trim();

  return (
    booking.email.toLowerCase().includes(query) ||
    booking.phoneNumber.toString().includes(query) ||
    booking.numberGuest.toString().includes(query) ||
    booking.comment.toLowerCase().includes(query) ||
    formatDate(booking.date).toLowerCase().includes(query) ||
    formatTime(booking.time).toLowerCase().includes(query)
  );
});

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("http://localhost:8080/booking/today");

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data: Booking[] = await response.json();
        setBookings(data);
      } catch (error) {
        setErrorMessage("Failed to fetch bookings");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, []);

  const totalBookings = bookings.length;
  const totalGuests = bookings.reduce(
    (sum, booking) => sum + booking.numberGuest,
    0
  );

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("no-NO");
  }

  function formatTime(timeString: string) {
    return timeString.slice(0, 5);
  }

  return (
    
    <div className="flex min-h-dvh bg-[#f5f3ef]">
      <AdminNavbar />

      {/* Main Content */}
      <main className="flex-1 p-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-xl mb-2">Hei, admin</h2>
            <div className="flex items-center gap-3 text-lg">
              <span className="capitalize">{currentDateText}</span>
              <CalendarIcon className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-8">
        
        {/* LEFT: Stats */}
        <div className="flex gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm w-48">
              <p className="text-sm text-gray-500">Antall bookinger i dag</p>
              <p className="text-2xl font-bold">{totalBookings}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm w-48">
              <p className="text-sm text-gray-500">Antall gjester i dag</p>
              <p className="text-2xl font-bold">{totalGuests}</p>
            </div>
        </div>

        {/* RIGHT: Search */}
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />

</div>

        {isLoading && <p>Laster bookinger...</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {!isLoading && !errorMessage && (
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <table className="w-full text-left table-fixed">
              <thead>
                <tr className="border-b border-neutral-200 text-sm font-medium text-neutral-800">
                  <th className="px-6 py-5 w-[15%]">Email</th>
                  <th className="px-6 py-5 w-[18%]">Telefonnummer</th>
                  <th className="px-4 py-5 w-[8%]">Antall</th>
                  <th className="px-6 py-5 w-[20%]">Kommentar</th>
                  <th className="px-4 py-5 w-[10%]">Dato</th>
                  <th className="px-4 py-5 w-[12%]">Tid</th>
                  <th className="w-[5%]"></th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="font-title border-b last:border-none text-sm">
                    <td className="p-8">{booking.email}</td>

                    <td>
                      <div className="p-2 flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 shrink-0" />
                        <span>{booking.phoneNumber}</span>
                      </div>
                    </td>

                    <td className="p-9">{booking.numberGuest}</td>

                    <td className="max-w-xs whitespace-normal break-words p-5"> {booking.comment || "-"}
                    </td>

                    <td className="p-5">{formatDate(booking.date)}</td>
                    <td className="p-5">{formatTime(booking.time)}</td>

                    <td>
                      <EllipsisVerticalIcon className="w-5 h-5 text-gray-400 cursor-pointer" />
                    </td>
                  </tr>
                ))}

                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-neutral-500">
                      Ingen bookinger i dag
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}