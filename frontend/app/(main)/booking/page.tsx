'use client';

import React, {useState} from "react";
import {bookingSchema, BookingSchemaType} from "@/app/(main)/booking/FormTypes";
import Container from "@/app/ui/Container";
import {zodResolver} from "@hookform/resolvers/zod";
import {SubmitHandler, useForm} from "react-hook-form";
import GuestsDetailsForm from "@/app/(main)/booking/(formParts)/GuestsDetailsForm";
import DateDetailsForm from "@/app/(main)/booking/(formParts)/DateDetailsForm";
import TimeDetailsForm from "@/app/(main)/booking/(formParts)/TimeDetailsForm";
import ContactDetailsForm from "@/app/(main)/booking/(formParts)/ContactDetailsForm";
import useBookingSubmit from "@/app/hooks/useBookingSubmit";
import {ExclamationTriangleIcon} from "@heroicons/react/16/solid";
import Image from "next/image";
import {CountryCode, isValidPhoneNumber} from "libphonenumber-js";

export type SchemaSections = "GUESTS" | "DATE" | "TIME" | "CONTACT"

export default function Page () {
    const {
        register, handleSubmit, watch, control, formState: { errors },
    } = useForm<BookingSchemaType>({
        resolver: zodResolver(bookingSchema),
        defaultValues:{
            id: "",
            numberGuest: 0,
            date: "",
            time: "",
            countryCode: "NO"
        },
        mode: "onSubmit"
    })
    const [schemaSection, setSchemaSection] = useState<SchemaSections>("GUESTS");
    const {mutate, isError, isPending, isRedirecting} = useBookingSubmit();

    const onSubmit: SubmitHandler<BookingSchemaType> = (data) => {
        mutate(data);
    }

    // Multistep form, renders one section at a time based on schemaSection
    return (<section className={"bg-custom-eggwhite h-full"}>
       <Container style={"flex flex-col items-center px-5 py-20 2xl:py-30 gap-5"}>
           {/*Loading animation shown while submitting form*/}
           <div aria-live={"polite"}>
               {isPending && <Image src={"/loading.gif"}
                                    alt={"loading animation while waiting for submission verification"}
                                    width={500} height={240}
                                    unoptimized={true}/>}
           </div>
           {/*Error message if submission fails*/}
           <div aria-live={"polite"}>
               {isError &&
                   <div className={"flex flex-col md:flex-row items-center gap-2 text-center md:text-left bg-red-200 border-2 border-red-600 p-3"}>
                       <ExclamationTriangleIcon aria-hidden={true} className={"size-13 sm:size-10"}/>
                       <p>Det oppstod en feil ved innsending av skjemaet. Vennligst prøv igjen senere eller ring oss på telefon.</p>
                   </div>
               }
           </div>
           {(!isPending && !isRedirecting) &&
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
           }
        </Container>
    </section>
    );
}