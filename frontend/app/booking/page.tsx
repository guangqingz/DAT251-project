'use client';

import {useState} from "react";
import BookingDetailsForm from "@/app/booking/BookingDetailsForm";
import {BookingFormOutput, BookingSchema} from "@/app/booking/FormTypes";
import CustomerDetailsForm from "@/app/booking/CustomerDetailsForm";
import Container from "@/app/ui/Container";

export default function Page () {
    const [formState, setFormState] = useState<Partial<BookingSchema>>({});
    const [showBookingForm, setShowBookingForm] = useState(true);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);

    const handleBookingState = (data: BookingFormOutput) => {
        setFormState(prevState => ({
            ...prevState,
            ...data,
        }));
        setShowBookingForm(false);
    }

    console.log(formState);

    return (<section className={"bg-custom-eggwhite h-full"}>
       <Container style={"flex flex-col items-center px-5 py-20 2xl:py-30 gap-9"}>
           {!bookingConfirmed &&
               <BookingDetailsForm setBookingDetails={handleBookingState} setBookingConfirmed={setBookingConfirmed}/>}
            {/*{showBookingForm ?*/}
            {/*    <BookingDetailsForm setBookingDetails={handleBookingState}/> :*/}
            {/*    <CustomerDetailsForm setCustomerDetails={handleBookingState}/>*/}
            {/*}*/}
            {bookingConfirmed && <>
                <h1 className={"text-2xl uppercase"}>Booking bekreftet</h1>
                <div className={"flex flex-col items-center gap-5 text-lg"}>
                    <p>Booking bekreftelse ble sendt til <span className={"font-bold"}>{formState.email}</span></p>
                    <p>Antall gjester: <span className={"font-bold"}>{formState.numberGuest}</span></p>
                    <p>Dato: <span className={"font-bold"}>{formState.date}</span></p>
                    <p>Tid: <span className={"font-bold"}>{formState.time}</span></p>
                    <p>Telefonnummer: <span className={"font-bold"}>{formState.phoneNumber}</span></p>
                    <p>Kommentar: <span>{formState.comment}</span></p>
                </div>
            </>}
        </Container>
    </section>
    );
}