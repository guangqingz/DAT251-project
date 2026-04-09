"use client";

import {
  CalendarIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import AdminNavbar from "@/app/ui/adminNavbar/AdminNavbar";
import SearchBar from "@/app/ui/searchBar";
import { useEffect, useMemo, useState, useRef } from "react";

type Booking = {
  id: string;
  email: string;
  phoneNumber: number;
  numberGuest: number;
  comment: string;
  date: string;
  time: string;
};

export default function DashboardBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  
  const dateInputReference = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const url = selectedDate
          ? `http://localhost:8080/booking/history/${selectedDate}`
          : "http://localhost:8080/booking/history";

        const response = await fetch(url);

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

    setIsLoading(true);
    fetchBookings();
  }, [selectedDate]);

  function handleDateButtonClick() {
    dateInputReference.current?.showPicker?.();
    dateInputReference.current?.focus();
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("no-NO");
  }

  function formatTime(timeString: string) {
    return timeString.slice(0, 5);
  }

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((firstBooking, secondBooking) => {
      const firstDateTime = new Date(`${firstBooking.date}T${firstBooking.time}`);
      const secondDateTime = new Date(`${secondBooking.date}T${secondBooking.time}`);
      return secondDateTime.getTime() - firstDateTime.getTime();
    });
  }, [bookings]);

  const dateButtonText = selectedDate ? formatDate(selectedDate) : "Dato";

  return (
    <div className="flex min-h-dvh bg-[#f5f3ef]">
      <AdminNavbar />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="tracking-wider font-title text-2xl sm:text-3xl ">Historikk</h1>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
            <div className="relative w-full sm:w-auto">
              <button
                type="button"
                onClick={handleDateButtonClick}
                className="font-title flex w-full items-center justify-center gap-3 rounded-2xl bg-[#c9a46d] px-4 py-3 text-sm font-medium text-black transition hover:opacity-90 sm:w-auto sm:min-w-[150px]">
                <span>Dato</span>
                <CalendarIcon className="h-5 w-5 shrink-0"/>
              </button>

              <input
                ref={dateInputReference}
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="absolute right-0 top-full mt-2 h-0 w-0 opacity-0"
                tabIndex={-1}
              />
            </div>

            <div className="w-full sm:max-w-xs">
              <SearchBar />
            </div>
          </div>
        </div>

        {selectedDate && (
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
            <p>Viser bookinger for {formatDate(selectedDate)}</p>
            <button
              type="button"
              onClick={() => setSelectedDate("")}
              className="text-[#8B2E1A] hover:underline"
            >
              Fjern filter
            </button>
          </div>
        )}

        {isLoading && <p>Laster bookinghistorikk...</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {!isLoading && !errorMessage && (

          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <table className="min-w-[900px] w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 text-sm font-medium text-neutral-800">
                  <th className="px-4 py-5 sm:px-6 w-[20%]">Email</th>
                  <th className="px-4 py-5 sm:px-6 w-[18%]">Telefonnummer</th>
                  <th className="px-4 py-5 w-[8%]">Antall</th>
                  <th className="px-4 py-5 sm:px-6 w-[24%]">Kommentar</th>
                  <th className="px-4 py-5 w-[12%]">Dato</th>
                  <th className="px-4 py-5 w-[10%]">Tid</th>
                  <th className="px-4 py-5 w-[8%]"></th>
                </tr>
              </thead>

              <tbody>
                {sortedBookings.map((booking) => (
                  <tr key={booking.id}
                    className="border-b border-neutral-200 last:border-none text-sm">
                    <td className="px-4 py-6 sm:px-6 break-words">{booking.email}</td>

                    <td className="px-4 py-6 sm:px-6">
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="h-5 w-5 shrink-0" />
                        <span>{booking.phoneNumber}</span>
                      </div>
                    </td>

                    <td className="px-4 py-6">{booking.numberGuest}</td>

                    <td className="px-4 py-6 sm:px-6 max-w-xs">
                      <p
                        className="line-clamp-3 whitespace-normal break-words"
                        title={booking.comment}
                      >
                        {booking.comment || "-"}
                      </p>
                    </td>

                    <td className="px-4 py-6 whitespace-nowrap">{formatDate(booking.date)}</td>

                    <td className="px-4 py-6 whitespace-nowrap">{formatTime(booking.time)}</td>

                    <td className="px-4 py-6">
                      <button className="text-neutral-400 transition hover:text-neutral-600">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {sortedBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-neutral-500">
                      Ingen bookinger funnet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-4 text-sm text-neutral-700 sm:flex-row sm:items-center sm:justify-between">
          <p>Viser {sortedBookings.length} resultater</p>

          <div className="flex flex-wrap items-center gap-3">
            <button className="tracking-wider font-title flex items-center gap-2 rounded-full border border-neutral-500 px-5 py-2 text-neutral-500 transition hover:bg-neutral-100">
              <ChevronLeftIcon className="h-4 w-4" />
              <span>Forrige</span>
            </button>

            <button className="tracking-wider font-title flex items-center gap-2 rounded-full border border-neutral-500 px-5 py-2 text-neutral-700 transition hover:bg-neutral-100">
              <span>Neste</span>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
