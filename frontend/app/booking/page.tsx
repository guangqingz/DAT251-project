'use client';

import {useState} from "react";
import {bookingSchema, BookingSchemaType} from "@/app/booking/FormTypes";
import Container from "@/app/ui/Container";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {SubmitHandler, useForm} from "react-hook-form";
import GuestsDetailsForm from "@/app/booking/GuestsDetailsForm";
import DateDetailsForm from "@/app/booking/DateDetailsForm";
import TimeDetailsForm from "@/app/booking/TimeDetailsForm";
import ContactDetailsForm from "@/app/booking/ContactDetailsForm";
import axios from "axios";
import {useMutation} from "@tanstack/react-query";

export type SchemaSections = "GUESTS" | "DATE" | "TIME" | "CONTACT"

export default function Page () {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<BookingSchemaType>({
        resolver: zodResolver(bookingSchema),
        defaultValues:{
            numberGuest: 0,
            date: "",
            time: "",
        }
    })
    const [schemaSection, setSchemaSection] = useState<SchemaSections>("GUESTS");
    const [formState, setFormState] = useState<Partial<BookingSchemaType>>({});

    const router = useRouter();

    const onSubmit: SubmitHandler<BookingSchemaType> = (data) => {
        console.log("FORM BOOKING DETAILS SUBMITTED")
        console.log(data)
        mutate(data);
    }

    const {mutate} = useMutation({
        mutationFn: (formData: BookingSchemaType) => {
            return axios.post("http://localhost:8080/booking", formData)
        },
        onSuccess: (data) => {
            console.log("Booking successful, query invalidated.")
            console.log(data);
            router.push(`/booking/${data.data.id}`);
        },
    })

    console.log(formState);

    return (<section className={"bg-custom-eggwhite h-full"}>
       <Container style={"flex flex-col items-center px-5 py-20 2xl:py-30 gap-9"}>
           <form onSubmit={handleSubmit(onSubmit)} className={"max-w-100 w-full"}>
               {schemaSection === "GUESTS" &&
                   <GuestsDetailsForm control={control}
                                      errors={errors}
                                      formState={formState}
                                      setFormStateAction={setFormState}
                                      setSchemaSelection={setSchemaSection}/>
               }
               {schemaSection === "DATE" &&
                   <DateDetailsForm control={control}
                                    errors={errors}
                                    formState={formState}
                                    setFormStateAction={setFormState}
                                    setSchemaSelection={setSchemaSection}/>
               }
               {schemaSection === "TIME" &&
                   <TimeDetailsForm control={control}
                                    errors={errors}
                                    formState={formState}
                                    setFormStateAction={setFormState}
                                    setSchemaSelection={setSchemaSection}/>
               }
               {schemaSection === "CONTACT" &&
                   <ContactDetailsForm register={register}
                                       errors={errors}
                                       formState={formState}
                                       setSchemaSelection={setSchemaSection}/>
               }
           </form>
        </Container>
    </section>
    );
}