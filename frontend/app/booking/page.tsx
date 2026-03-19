'use client';

import {useState} from "react";
import BookingDetailsForm from "@/app/booking/BookingDetailsForm";
import {BookingFormOutput, BookingSchema} from "@/app/booking/FormTypes";
import CustomerDetailsForm from "@/app/booking/CustomerDetailsForm";
import Container from "@/app/ui/Container";
import {Controller} from "react-hook-form";

export default function Page () {
    const [formState, setFormState] = useState<Partial<BookingSchema>>({});
    const [showBookingForm, setShowBookingForm] = useState(true);

    console.log(formState)

    const handleBookingState = (data: BookingFormOutput) => {
        setFormState(prevState => ({
            ...prevState,
            ...data,
        }));
        setShowBookingForm(false);
    }

    return (<section className={"bg-custom-eggwhite h-full"}>
            <Container style={"flex flex-col items-center pt-30 gap-9"}>
                <h2 className={"text-xl text-custom-gray"}>Velkommen</h2>
                <BookingDetailsForm setBookingDetails={handleBookingState} />
                {/*{showBookingForm ?*/}
                {/*    <BookingDetailsForm setBookingDetails={handleBookingState}/> :*/}
                {/*    <CustomerDetailsForm setCustomerDetails={handleBookingState}/>*/}
                {/*}*/}
            </Container>
    </section>
    );
}