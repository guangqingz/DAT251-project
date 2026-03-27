import React from "react";
import {SchemaSections} from "@/app/booking/page";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";
import {FieldErrors, UseFormWatch, UseFormRegister} from "react-hook-form";
import {BookingSchemaType} from "@/app/booking/FormTypes";
import {CountryCode, getCountries} from "libphonenumber-js";

/**
 * Last step of the booking form where user fills in contact information
 * @param register - React hook form register function for input binding
 * @param errors - validation errors to display field error messages
 * @param watch - watches and returns field values
 * @param setSchemaSelection - callback to navigate between form steps
 */
export default function ContactDetailsForm({register, errors, watch, setSchemaSelection}:
   {
       register:UseFormRegister<BookingSchemaType>,
       errors:FieldErrors<BookingSchemaType>,
       watch:UseFormWatch<BookingSchemaType>,
       setSchemaSelection: React.Dispatch<React.SetStateAction<SchemaSections>>
   }){
    const chosenNumberGuest = watch("numberGuest");
    const chosenFullDate = watch("date");
    const chosenTime = watch("time");

    const countryCodeList: CountryCode[] = getCountries() || [];

    return (
        <section className={"flex flex-col gap-5"}>
            {/*Summary of chosen guests, date and time*/}
            <h2 className={"text-xl text-custom-gray text-center"}>{chosenNumberGuest} personer</h2>
            <h2 className={"text-xl text-custom-gray text-center"}>{chosenFullDate}, kl. {chosenTime}</h2>
            <h3 className={"text-2xl text-center font-title"}>Fyll ut kontaktinformasjon</h3>

            <section className={"flex flex-col gap-9 mt-5"}>
                <div className={"flex flex-col gap-3"}>
                    <input type="email" id="email" {...register("email")}
                           className={"border-b pb-2 focus:p-2 placeholder-gray-500"}
                           placeholder={"Din email"}
                           aria-label={"email"}
                           aria-describedby={"email-error"}
                    />
                    {errors?.email && <span id={"email-error"} className={"text-red-800"}>{errors.email.message}</span>}
                </div>
                <div>
                    <div className={"grid grid-cols-6 gap-3 mb-3"}>
                        <select className={"col-span-1"}
                                id={"countryCode"}
                                {...register("countryCode")}
                                aria-label={"country code for telephone numbers"}
                                aria-describedby={"phone-number-error"}
                        >
                            {countryCodeList.map((country:CountryCode)=>
                                <option key={country}>{country}</option>
                            )}
                        </select>
                        <input type={"tel"} id={"phoneNumber"} {...register("phoneNumber")}
                               placeholder={"Ditt telefonnummer"}
                               className={"border-b pb-2 focus:p-2 placeholder-gray-500 col-span-5"}
                               aria-label={"telephone number"}
                               aria-describedby={"phone-number-error"}
                        />
                    </div>
                    {errors?.phoneNumber && <span id={"phone-number-error"} className={"text-red-800"}>{errors.phoneNumber.message}</span>}
                </div>
                <div className={"flex flex-col gap-2"}>
                    <label htmlFor={"comment"} className={"text-gray-500"}>Kommentar</label>
                    <textarea rows={4}
                              className={"border p-2 rounded-md"}
                              id={"comment"}
                              {...register("comment")}
                              aria-describedby={"comment-error"}
                              aria-required={false}/>
                    {errors?.comment && <span id={"comment-error"} className={"text-red-800"}>{errors.comment.message}</span>}
                </div>
            </section>
            <div className={"flex justify-between py-3"}>
                <button
                    onClick={() => setSchemaSelection("TIME")}
                    className={"p-2 border-2 rounded-full w-fit scale-90 hover:scale-100 transition-all"}>
                    <ArrowLeftIcon className={"w-8 h-8"}/>
                </button>
            </div>
        </section>
    )
}