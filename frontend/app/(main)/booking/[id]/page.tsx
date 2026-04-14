'use client'

import Container from "@/app/ui/Container";
import {useParams} from "next/navigation";
import useSingleBooking from "@/app/hooks/useSingleBooking";
import useBookingDelete from "@/app/hooks/useBookingDelete";
import Image from "next/image";
import React, {useState} from "react";
import BookingConfirmed from "@/app/(main)/booking/[id]/BookingConfirmed";
import BookingDeleted from "@/app/(main)/booking/[id]/BookingDeleted";
import {TrashIcon} from "@heroicons/react/24/outline";
import {ExclamationTriangleIcon, PencilSquareIcon} from "@heroicons/react/16/solid";
import {SchemaSections} from "@/app/(main)/booking/page";
import BookingUpdate from "@/app/(main)/booking/[id]/BookingUpdate";
import {SubmitHandler} from "react-hook-form";
import useBookingUpdate from "@/app/hooks/useBookingUpdate";

export type ConfirmationSections = "CONFIRM" | "DELETE" | "UPDATE";
/**
 * Shows the confirmation page of a successful booking
 */
export default function Page(){
    const [confirmationSection, setConfirmationSection] = useState<ConfirmationSections>("CONFIRM");
    const params = useParams();
    const id = params.id as string;

    const getHook = useSingleBooking(id);
    const deleteHook = useBookingDelete();
    const updateHook = useBookingUpdate();

    const isPending: boolean = getHook.isPending || deleteHook.isPending || updateHook.isPending;
    const isError: boolean = getHook.isError || deleteHook.isError || updateHook.isError;

    const handleBookingDelete = () => {
        deleteHook.mutate(id);
        setConfirmationSection("DELETE")
    }

    return (<section className={"bg-custom-eggwhite h-full"}>
        <Container style={"flex flex-col items-center px-5 pt-10 pb-15 gap-4"}>
            {/*Loading animation shown while fetching, deleting or updating booking*/}
            <div aria-live={"polite"}>
                {isPending && <Image src={"/loading.gif"}
                                     alt={"loading animation while fetching booking"}
                                     width={500} height={240}
                                     unoptimized={true}/>}
            </div>
            {/*Error messages*/}
            <div aria-live={"polite"}>
                {/*Error when retrieving specific booking*/}
                {getHook.isError && <h1 className={"md:text-xl text-center"}>Kan ikke finne booking bekreftelse for booking med <span className={"font-bold"}>ID:{id}</span></h1>}
                {/*Error when deleting booking*/}
                {deleteHook.isError && <h1 className={"md:text-xl text-center text-red-800"}>Noe gikk galt ved sletting av booking. Vennligst prøv på nytt.</h1>}
                {/*Error when updating booking*/}
                {updateHook.isError &&
                    <div className={"flex flex-col md:flex-row items-center gap-2 text-center md:text-left bg-red-200 border-2 border-red-600 p-3"}>
                        <ExclamationTriangleIcon aria-hidden={true} className={"size-13 sm:size-10"}/>
                        <p>Det er ingen ledige bord på dette tidspunktet</p>
                    </div>}
            </div>
            {(confirmationSection === "DELETE" && !isPending && !isError) &&
                <BookingDeleted email={getHook.data?.email || ""}/>}
            {(confirmationSection === "CONFIRM" && !isPending && !isError) && <>
                <BookingConfirmed data={getHook.data}/>
                <section className={"flex flex-col md:flex-row gap-3"}>
                    <button className={"border-2 border-red-800 bg-red-800 text-white py-2 px-3 rounded-md flex gap-2 transition-all hover:bg-custom-eggwhite hover:text-custom-red"}
                            onClick={handleBookingDelete}>
                        <TrashIcon className={"size-6"} aria-hidden={true}/>Slett reservasjon</button>
                    <button className={"border-2 border-custom-gray bg-custom-gray text-white py-2 px-3 rounded-md flex gap-2 transition-all hover:bg-custom-eggwhite hover:text-custom-gray"}
                            onClick={() => setConfirmationSection("UPDATE")}>
                        <PencilSquareIcon className={"size-6"} aria-hidden={true}/>Endre reservasjon</button>
                </section>
            </>
            }
            {(confirmationSection === "UPDATE" && !isPending) &&
                <BookingUpdate data={getHook.data} updateHook={updateHook} handleUpdate={setConfirmationSection}/>}
        </Container>
    </section>)
 }