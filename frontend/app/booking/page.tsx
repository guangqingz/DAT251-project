'use client';

import {useState} from "react";
import {bookingSchema, BookingSchemaType} from "@/app/booking/FormTypes";
import Container from "@/app/ui/Container";
import {zodResolver} from "@hookform/resolvers/zod";
import {SubmitHandler, useForm} from "react-hook-form";
import GuestsDetailsForm from "@/app/booking/(formParts)/GuestsDetailsForm";
import DateDetailsForm from "@/app/booking/(formParts)/DateDetailsForm";
import TimeDetailsForm from "@/app/booking/(formParts)/TimeDetailsForm";
import ContactDetailsForm from "@/app/booking/(formParts)/ContactDetailsForm";
import useBookingSubmit from "@/app/hooks/useBookingSubmit";

export type SchemaSections = "GUESTS" | "DATE" | "TIME" | "CONTACT"

export default function Page () {
    const {
        register, handleSubmit, watch, control, getValues, setError, formState: { errors },
    } = useForm<BookingSchemaType>({
        resolver: zodResolver(bookingSchema),
        defaultValues:{
            id: "",
            numberGuest: 0,
            date: "",
            time: "",
            countryCode: "NO"
        }
    })
    const [schemaSection, setSchemaSection] = useState<SchemaSections>("GUESTS");
    const mutate = useBookingSubmit();

    const onSubmit: SubmitHandler<BookingSchemaType> = (data) => {
        // remove country code field because it's not part of Booking model
        const {countryCode, ...validRequestData} = data;
        mutate(validRequestData);
    }

    // Multistep form, renders one section at a time based on schemaSection
    return (<section className={"bg-custom-eggwhite h-full"}>
       <Container style={"flex flex-col items-center px-5 py-20 2xl:py-30 gap-9"}>
           <form onSubmit={handleSubmit(onSubmit)} className={"max-w-100 w-full"}>
               {schemaSection === "GUESTS" &&
                   <GuestsDetailsForm control={control}
                                      errors={errors}
                                      watch={watch}
                                      setSchemaSelection={setSchemaSection}/>
               }
               {schemaSection === "DATE" &&
                   <DateDetailsForm control={control}
                                    errors={errors}
                                    watch={watch}
                                    setSchemaSelection={setSchemaSection}/>
               }
               {schemaSection === "TIME" &&
                   <TimeDetailsForm control={control}
                                    errors={errors}
                                    watch={watch}
                                    setSchemaSelection={setSchemaSection}/>
               }
               {schemaSection === "CONTACT" &&
                   <>
                       <ContactDetailsForm register={register}
                                           errors={errors}
                                           watch={watch}
                                           setSchemaSelection={setSchemaSection}/>
                       {/*Submit button only visible in final step*/}
                       <div className={"flex justify-center"}>
                           <button type="submit"
                                   className={"bg-black text-lg text-white w-fit py-2 px-8 rounded-3xl border-2 hover:bg-inherit hover:text-black"}>
                               Reserver
                           </button>
                       </div>
                   </>
               }
           </form>
        </Container>
    </section>
    );
}