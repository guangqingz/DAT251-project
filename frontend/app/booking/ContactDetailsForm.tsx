import {BookingSchemaType} from "@/app/booking/FormTypes";
import React from "react";
import {SchemaSections} from "@/app/booking/page";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";

export default function ContactDetailsForm({register, errors, formState, setSchemaSelection}:
   {
       register:any,
       errors:any,
       formState:Partial<BookingSchemaType>
       setSchemaSelection: React.Dispatch<React.SetStateAction<SchemaSections>>
   }){

    return (
        <section className={"flex flex-col gap-5"}>
            <h2 className={"text-xl text-custom-gray text-center"}>{formState.numberGuest} personer</h2>
            <h2 className={"text-xl text-custom-gray text-center"}>{formState.date}, kl. {formState.time}</h2>
            <h3 className={"text-2xl text-center font-title"}>Fyll ut kontaktinformasjon</h3>

            <section className={"flex flex-col gap-9 mt-5"}>
                <div className={"flex flex-col gap-3"}>
                    <input type="email" id="email" {...register("email")}
                           className={"border-b pb-2 focus:p-2 placeholder-gray-500"}
                           placeholder={"Din email"}
                           aria-label={"email"}
                           aria-describedby={"email-error"}
                    />
                    {errors?.email && <span id={"email-error"} className={"text-red-800"}>Fyll inn email</span>}
                </div>
                <div className={"flex flex-col gap-3"}>
                    <input type={"tel"} id={"phoneNumber"} {...register("phoneNumber")}
                           placeholder={"Ditt telefonnummer"}
                           className={"border-b pb-2 focus:p-2 placeholder-gray-500"}
                           aria-label={"telephone number"}
                           aria-describedby={"phone-number-error"}
                    />
                    {errors?.phoneNumber && <span id={"phone-number-error"} className={"text-red-800"}>Fyll inn telefonnummer</span>}
                </div>
                <div className={"flex flex-col gap-2"}>
                    <label htmlFor={"comment"} className={"text-gray-500"}>Kommentar</label>
                    <textarea rows={4} className={"border p-2 rounded-md"} id={"comment"} {...register("comment")}/>
                </div>
            </section>
            <div className={"flex justify-between py-3"}>
                <button
                    onClick={() => setSchemaSelection("TIME")}
                    className={"p-2 border-2 rounded-full w-fit scale-90 hover:scale-100 transition-all"}>
                    <ArrowLeftIcon className={"w-8 h-8"}/>
                </button>
                <button type="submit"
                        className={"bg-black text-lg text-white w-fit py-2 px-8 rounded-3xl border-2 hover:bg-inherit hover:text-black"}>
                    Reserver
                </button>
            </div>
        </section>
    )
}