'use client';

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm, SubmitHandler, Controller} from "react-hook-form";
import {z} from "zod";
import {useEffect, useState} from "react";
import {InformationCircleIcon, ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/24/outline";
import clsx from "clsx";
import {useMutation, useQueryClient, useQuery} from "@tanstack/react-query";
import axios from "axios";
import {useRouter} from "next/navigation";
import GuestsDetailsForm from "@/app/booking/GuestsDetailsForm";
import {BookingSchema2} from "@/app/booking/FormTypes";
import DateDetailsForm from "@/app/booking/DateDetailsForm";
import TimeDetailsForm from "@/app/booking/TimeDetailsForm";

export const maxNumberGuest = 5;

const bookingSchema = z.object({
    numberGuest: z.number(),
    time: z.string(),
    date: z.string(),
    email: z.email(),
    phoneNumber: z.string(),
    comment: z.string().optional()
})

type BookingSchemaType = z.infer<typeof bookingSchema>

export type SchemaSections = "GUESTS" | "DATE" | "TIME" | "CONTACT"

export default function BookingDetailsForm({setBookingDetails, formState, setFormStateAction}:
    {
        setBookingDetails: any,
        formState:Partial<BookingSchema2>
        setFormStateAction: React.Dispatch<React.SetStateAction<Partial<BookingSchema2>>>
    }){
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

    const router = useRouter();

    const onSubmit: SubmitHandler<BookingSchemaType> = (data) => {
        console.log("FORM BOOKING DETAILS SUBMITTED")
        console.log(data)
        setBookingDetails(data)
        mutate(data);
    }
    
    const queryClient = useQueryClient();

    const {mutate} = useMutation({
        mutationFn: (formData: BookingSchemaType) => {
            return axios.post("http://localhost:8080/booking", formData)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['booking']})
            console.log("Booking successful, query invalidated.")
            console.log(data);
            router.push(`/booking/${data.data.id}`);
        },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={"max-w-100 w-full"}>
            {schemaSection === "GUESTS" &&
                <GuestsDetailsForm control={control}
                                   errors={errors}
                                   formState={formState}
                                   setFormStateAction={setFormStateAction}
                                   setSchemaSelection={setSchemaSection}/>
            }
            {schemaSection === "DATE" &&
                <DateDetailsForm control={control}
                                 errors={errors}
                                 formState={formState}
                                 setFormStateAction={setFormStateAction}
                                 setSchemaSelection={setSchemaSection}/>
            }
            {schemaSection === "TIME" &&
                <TimeDetailsForm control={control}
                                 errors={errors}
                                 formState={formState}
                                 setFormStateAction={setFormStateAction}
                                 setSchemaSelection={setSchemaSection}/>
            }
            {/*{schemaSection === "CONTACT" &&*/}
            {/*    <section className={"flex flex-col gap-5"}>*/}
            {/*        <h2 className={"text-xl text-custom-gray text-center"}>{selectedNumberOfGuest} personer</h2>*/}
            {/*        <h2 className={"text-xl text-custom-gray text-center"}>{selectedDate}, kl. {selectedTime}</h2>*/}
            {/*        <h3 className={"text-2xl text-center font-title"}>Fyll ut kontaktinformasjon</h3>*/}

            {/*        <section className={"flex flex-col gap-9 mt-5"}>*/}
            {/*            <div className={"flex flex-col gap-3"}>*/}
            {/*                <input type="email" id="email" {...register("email")}*/}
            {/*                       className={"border-b pb-2 focus:p-2 placeholder-gray-500"}*/}
            {/*                       placeholder={"Din email"}*/}
            {/*                       aria-label={"email"}*/}
            {/*                       aria-describedby={"email-error"}*/}
            {/*                />*/}
            {/*                {errors?.email && <span id={"email-error"} className={"text-red-800"}>Fyll inn email</span>}*/}
            {/*            </div>*/}
            {/*            <div className={"flex flex-col gap-3"}>*/}
            {/*                <input type={"tel"} id={"phoneNumber"} {...register("phoneNumber")}*/}
            {/*                       placeholder={"Ditt telefonnummer"}*/}
            {/*                       className={"border-b pb-2 focus:p-2 placeholder-gray-500"}*/}
            {/*                       aria-label={"telephone number"}*/}
            {/*                       aria-describedby={"phone-number-error"}*/}
            {/*                />*/}
            {/*                {errors?.phoneNumber && <span id={"phone-number-error"} className={"text-red-800"}>Fyll inn telefonnummer</span>}*/}
            {/*            </div>*/}
            {/*            <div className={"flex flex-col gap-2"}>*/}
            {/*                <label htmlFor={"comment"} className={"text-gray-500"}>Kommentar</label>*/}
            {/*                <textarea rows={4} className={"border p-2 rounded-md"} id={"comment"} {...register("comment")}/>*/}
            {/*            </div>*/}
            {/*        </section>*/}
            {/*        <div className={"flex justify-between py-3"}>*/}
            {/*            <button*/}
            {/*                onClick={() => setSchemaSection("TIME")}*/}
            {/*                className={"p-2 border-2 rounded-full w-fit scale-90 hover:scale-100 transition-all"}>*/}
            {/*                <ArrowLeftIcon className={"w-8 h-8"}/>*/}
            {/*            </button>*/}
            {/*            <button type="submit"*/}
            {/*                    className={"bg-black text-lg text-white w-fit py-2 px-8 rounded-3xl border-2 hover:bg-inherit hover:text-black"}>*/}
            {/*                Reserver*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    </section>*/}
            {/*}*/}
        </form>
    )
}