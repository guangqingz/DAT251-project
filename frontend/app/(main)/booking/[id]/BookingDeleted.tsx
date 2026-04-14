import React from "react";

export default function BookingDeleted({email}:{email:string}){
    return <div className={"flex flex-col items-center gap-5 text-lg max-w-2/3 w-full text-center"}>
                <h1 className={"text-2xl uppercase"}>Booking slettet</h1>
                <p>Bekreftelse for slettet booking ble sendt til <span className={"font-bold"}>{email}</span></p>
    </div>
}