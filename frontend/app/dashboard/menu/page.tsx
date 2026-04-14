"use client";

import { useState, ChangeEvent } from "react";
import AdminNavbar from "@/app/ui/adminNavbar/AdminNavbar";
import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function MenuUploadPage() {

  // separate state for each PDF
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [takeawayFile, setTakeawayFile] = useState<File | null>(null);

  const [menuUploading, setMenuUploading] = useState(false);
  const [takeawayUploading, setTakeawayUploading] = useState(false);
 
  const [menuMessage, setMenuMessage] = useState("");
  const [takeawayMessage, setTakeawayMessage] = useState("");

  // handler now knows whether we are updating the normal menu or takeaway menu
const handleFileChange = (
  type: "menu" | "takeaway",
  e: ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0] ?? null;

  if (file && file.type !== "application/pdf") {
    if (type === "menu") {
      setMenuMessage("Kun PDF-filer er tillatt.");
    } else {
      setTakeawayMessage("Kun PDF-filer er tillatt.");
    }
    return;
  }

  // clear only the message for the relevant section
  if (type === "menu") {
    setMenuMessage("");
    setMenuFile(file);
  } else {
    setTakeawayMessage("");
    setTakeawayFile(file);
  }
};

  // upload function receives which PDF to upload
const handleUpload = async (type: "menu" | "takeaway") => {
  const file = type === "menu" ? menuFile : takeawayFile;

  if (!file) {
    if (type === "menu") {
      setMenuMessage("Velg en PDF først.");
    } else {
      setTakeawayMessage("Velg en PDF først.");
    }
    return;
  }

  if (type === "menu") {
    setMenuUploading(true);
    setMenuMessage("");
  } else {
    setTakeawayUploading(true);
    setTakeawayMessage("");
  }

  try {
    const endpoint =
      type === "menu"
        ? "http://localhost:8080/admin/menu/upload"
        : "http://localhost:8080/admin/takeaway/upload";

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Kunne ikke oppdatere PDF.");
    }

    if (type === "menu") {
      setMenuMessage("Restaurantmenyen ble oppdatert.");
      setMenuFile(null);
    } else {
      setTakeawayMessage("Takeaway-menyen ble oppdatert.");
      setTakeawayFile(null);
    }
  } catch (error) {
    const text =
      error instanceof Error ? error.message : "Noe gikk galt.";

    if (type === "menu") {
      setMenuMessage(text);
    } else {
      setTakeawayMessage(text);
    }
  } finally {
    if (type === "menu") {
      setMenuUploading(false);
    } else {
      setTakeawayUploading(false);
    }
  }
};

  return (
    <div className="flex min-h-dvh bg-[#f5f3ef]">
      <AdminNavbar />

      <main className="flex-1 p-10">
        <div className="mb-10">
          <h1 className="text-4xl font-medium mb-2">Oppdater meny</h1>
          <p className="text-neutral-600 text-lg">
            Last opp en ny PDF for restaurantens meny.
          </p>
        </div>

        <div className="max-w-4xl rounded-3xl bg-white p-8 shadow-sm border border-neutral-200">
          <div className="grid gap-8 lg:grid-cols-2">

            {/* Restaurant Menu */}
            <section className="rounded-2xl border border-neutral-200 p-6">
              <div className="mb-6 flex items-center gap-4 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5">
                <div className="rounded-2xl bg-[#8B2E1A] p-4 text-white">
                  <DocumentTextIcon className="h-8 w-8" />
                </div>

                <div>
                  <h2 className="text-xl font-medium">Restaurantmeny</h2>
                  <p className="text-neutral-600">menu-NO-2025.pdf</p>
                </div>
              </div>

              <label className="mb-5 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#c9a46d] bg-[#faf5ee] px-6 py-8 text-center transition hover:bg-[#f5ecdf]">
                <ArrowUpTrayIcon className="h-6 w-6 text-[#8B2E1A]" />

                <div>
                  <p className="font-medium text-[#8B2E1A]">Velg ny PDF</p>
                  <p className="text-sm text-neutral-500">
                    Last opp ny restaurantmeny
                  </p>
                </div>

                <input
                  type="file"
                  accept="application/pdf"

                  //specify this input is for the normal menu
                  onChange={(e) => handleFileChange("menu", e)}

                  className="hidden"
                />
              </label>

              {/* show selected restaurant menu file */}
              {menuFile && (
                <div className="mb-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                  Valgt fil: <span className="font-medium">{menuFile.name}</span>
                </div>
              )}

              {/* CHANGED: separate upload button for normal menu */}
              <button
                onClick={() => handleUpload("menu")}
                disabled={menuUploading}
                className="rounded-2xl bg-[#8B2E1A] px-6 py-3 font-medium text-white transition hover:bg-[#a33922] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {menuUploading ? "Laster opp..." : "Oppdater restaurantmeny"}
              </button>
            </section>

            {/* Takeaway Menu */}
            <section className="rounded-2xl border border-neutral-200 p-6">
              <div className="mb-6 flex items-center gap-4 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5">
                <div className="rounded-2xl bg-[#c9a46d] p-4 text-white">
                  <DocumentTextIcon className="h-8 w-8" />
                </div>

                <div>
                  <h2 className="text-xl font-medium">Takeaway-meny</h2>
                  <p className="text-neutral-600">takeaway-2025.pdf</p>
                </div>
              </div>

              <label className="mb-5 flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#c9a46d] bg-[#faf5ee] px-6 py-8 text-center transition hover:bg-[#f5ecdf]">
                <ArrowUpTrayIcon className="h-6 w-6 text-[#8B2E1A]" />

                <div>
                  <p className="font-medium text-[#8B2E1A]">Velg takeaway-PDF</p>
                  <p className="text-sm text-neutral-500">
                    Last opp ny takeaway-meny
                  </p>
                </div>

                <input
                  type="file"
                  accept="application/pdf"

                  // CHANGED: specify this input is for takeaway menu
                  onChange={(e) => handleFileChange("takeaway", e)}

                  className="hidden"
                />
              </label>

              {/* CHANGED: show selected takeaway file */}
              {takeawayFile && (
                <div className="mb-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                  Valgt fil: <span className="font-medium">{takeawayFile.name}</span>
                </div>
              )}

              {/* CHANGED: separate upload button for takeaway menu */}
              <button
                onClick={() => handleUpload("takeaway")}
                disabled={takeawayUploading}
                className="rounded-2xl bg-[#c9a46d] px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {takeawayUploading ? "Laster opp..." : "Oppdater takeaway-meny"}
              </button>
            </section>
          </div>

          {menuMessage && (
            <div className="mt-6 rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-700">
              {menuMessage}
            </div>
          )}

          {takeawayMessage && (
            <div className="mt-3 rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-700">
              {takeawayMessage}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}