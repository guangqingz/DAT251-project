'use client';

import {useState} from "react";
import BookingDetailsForm from "@/app/booking/BookingDetailsForm";
import {BookingFormOutput, BookingSchema, BookingSchema2} from "@/app/booking/FormTypes";
import CustomerDetailsForm from "@/app/booking/CustomerDetailsForm";
import Container from "@/app/ui/Container";

export default function Page () {
    const [formState, setFormState] = useState<Partial<BookingSchema2>>({});
    const [showBookingForm, setShowBookingForm] = useState(true);

    const handleBookingState = (data) => {
        setFormState(prevState => ({
            ...prevState,
            ...data,
        }));
        setShowBookingForm(false);
    }

    console.log(formState);

    return (<section className={"bg-custom-eggwhite h-full"}>
       <Container style={"flex flex-col items-center px-5 py-20 2xl:py-30 gap-9"}>
            <BookingDetailsForm setBookingDetails={handleBookingState} formState={formState} setFormStateAction={setFormState}/>
            {/*{showBookingForm ?*/}
            {/*    <BookingDetailsForm setBookingDetails={handleBookingState}/> :*/}
            {/*    <CustomerDetailsForm setCustomerDetails={handleBookingState}/>*/}
            {/*}*/}
        </Container>
    </section>
    );
}