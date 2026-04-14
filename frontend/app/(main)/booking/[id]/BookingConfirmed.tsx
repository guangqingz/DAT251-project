import React, {useState} from "react";
import {TrashIcon} from "@heroicons/react/24/outline";
import {BookingSchemaType} from "@/app/(main)/booking/FormTypes";
import BookingUpdate from "@/app/(main)/booking/[id]/BookingUpdate";
import {PencilSquareIcon} from "@heroicons/react/16/solid";
import {CountryCallingCode, CountryCode, getCountryCallingCode} from "libphonenumber-js";

export default function BookingConfirmed({data} : {data:BookingSchemaType | undefined}) {
    const timeStart:string = data?.time.slice(0,-3) || "";
    const maxHoursTime:number = 2
    // Add max hours time based on start time in correct format (hh:mm)
    const hours:number = Number(data?.time.slice(0, 2)) + maxHoursTime
    const minutes:string = data?.time.slice(2,5) || ""
    const timeEnd:string = hours.toString() + minutes || "";

    return (<>
        {data &&
        <>
            <h1 className={"text-2xl uppercase"}>Booking bekreftet</h1>
            <div className={"flex flex-col items-center gap-5 text-lg max-w-2/3 w-full text-center"}>
                <p>Booking bekreftelse ble sendt til <span className={"font-bold"}>{data.email}</span></p>
                <p>Antall gjester: <span className={"font-bold"}>{data.numberGuest}</span></p>
                <p>Dato: <span className={"font-bold"}>{data.date.split("T")[0]}</span></p>
                <p>Tid: <span className={"font-bold"}>{timeStart}-{timeEnd}</span></p>
                <p>Telefonnummer: <span className={"font-bold"}>{data.phoneNumber}</span></p>
                <p>Kommentar: <span>{data.comment}</span></p>
            </div>
        </> }
    </>
    )
}
