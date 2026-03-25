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

export const maxNumberGuest = 5;

type TimeSlot = {
    time: string,
    available: boolean,
}

type TimeSlotExtended = {
    time: string,
    available: boolean,
    pastTime: boolean
}

type TimeSlotRequestType = {
        date: string,
        numGuests: number
    }

const days: string[] = ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"]
let date: Date = new Date();
let year: number = date.getFullYear();
let month: string = date.toLocaleDateString("no-NO", {month: "long"})
const maxFutureMonth = 2;
let maxMonth = (date.getMonth() + maxFutureMonth + 1) % 12

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

let timeSlotsExtended: TimeSlotExtended[] = []

export default function BookingDetailsForm({setBookingDetails, formState, setFormStateAction}:
    {
        setBookingDetails: any,
        formState:Partial<BookingSchema2>
        setFormStateAction: React.Dispatch<React.SetStateAction<Partial<BookingSchema2>>>
    }){
    const {
        register,
        handleSubmit,
        watch,
        setValue,
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
    const [currYear, setCurrYear] = useState(year);
    const [currMonthString, setCurrMonthString] = useState(month); // used for calendar header


    // used to deactivate/activate calendar buttons
    const [prevMonth, setPrevMonth] = useState(false)
    const [nextMonth, setNextMonth] = useState(false)

    const selectedTime = watch("time");
    const selectedDate = watch("date");
    const selectedNumberOfGuest = watch("numberGuest");

    let firstDayOfMonth = new Date(currYear, date.getMonth(), 1).getDay();
    let lastDateOfMonth = new Date(currYear, date.getMonth() + 1, 0).getDate();
    let todaysDate = new Date().getDate();
    let todaysMonth = new Date().getMonth();

    const dateInMonth = Array.from({length: lastDateOfMonth}, (_, index) => index + 1);
    let gridSpace = (firstDayOfMonth + 6) % 7; // used to place the date numbers under correct day

    const router = useRouter();

    const onSubmit: SubmitHandler<BookingSchemaType> = (data) => {
        console.log("FORM BOOKING DETAILS SUBMITTED")
        console.log(data)
        setBookingDetails(data)
        mutate(data);
    }



    const handleNextBtn = () => {
        setNextMonth(false)
        if (maxMonth !== (date.getMonth() + 1)){
            setNextMonth(true)
        }
    }

    const handleNextMonth = () =>{
        // enforce maximum days ahead a customer can book table
        if (maxMonth !== (date.getMonth() + 1)){
            date.setMonth(date.getMonth() + 1);
            const month: string = date.toLocaleDateString("no-NO", {month: "long"})
            setCurrMonthString(month)
            setCurrYear(date.getFullYear())
        }

        handlePrevBtn();
        handleNextBtn();
    }

    const handlePrevBtn = () => {
        const todaysDate = new Date();

        setPrevMonth(false);
        // prevent going back in time
        if (todaysDate.getMonth() < date.getMonth()) {
            setPrevMonth(true)
        }
    }

    const handlePrevMonth = () => {
        const todaysDate = new Date();

        // prevent going back in time
        if (todaysDate < date){
            date.setMonth(date.getMonth() - 1);
            const month: string = date.toLocaleDateString("no-NO", {month: "long"})
            setCurrMonthString(month)
            setCurrYear(date.getFullYear())
        }
        handlePrevBtn();
        handleNextBtn();

        return prevMonth
    }

    const handleSelectDate = (dateValue: number) => {
        let month = date.getMonth() + 1;
        let monthString: string = "";
        if (month < 10) {
            monthString = "0" + month.toString()
        } else {
            monthString = month.toString();
        }
        const dateString = `${currYear}-${monthString}-${dateValue}`;
        setValue("date", dateString, {shouldValidate: true})
        setSchemaSection("TIME");
    }

    const handleTime = (time: string) => {
        setValue("time", time, {shouldValidate: true})
        setSchemaSection("CONTACT")
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

    const mutation = useMutation({
        mutationFn: (timeSlotRequestData: TimeSlotRequestType) => {
            console.log(timeSlotRequestData)
            return axios.post(`http://localhost:8080/booking/timeslot`, timeSlotRequestData);
        },
        onSuccess: (data) => {
            console.log(data);
            handlePastTimeSlots(data.data);
            }
    })

    function isPastTime(time: string): boolean {
        const todaysDate = new Date();
        const hour = Number(time.split(":")[0])

        // users must minimum book 2 hours before the booking time
        if ((todaysDate.getHours() + 3) > hour){
            return true;
        }

        return false;
    }

    const handlePastTimeSlots = (timeslotList: TimeSlot) => {
        console.log(timeslotList);
        timeSlotsExtended = timeslotList.map((prev: TimeSlot) => ({
            ...prev, pastTime: isPastTime(prev.time)
        }));
        return false;
    }

    useEffect(()=> {
        handlePrevBtn();
        handleNextBtn();
        const body: TimeSlotRequestType = {
                    date: "2026-03-24",
                    numGuests: 2,
               }
        mutation.mutate(body);
    }, [])



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
                <section className={"flex flex-col gap-5"}>
                    <h2 className={"text-xl text-custom-gray text-center"}>{selectedNumberOfGuest} personer</h2>
                    <h3 className={"text-2xl text-center"}>Velg dato</h3>
                    <Controller
                        control={control}
                        name={"date"}
                        render={({field}) =>
                            <input
                                   aria-label={"choose date of booking"}
                                   aria-controls={"calendar"}
                                   aria-describedby={"calendar-error"}
                                   className={"sr-only"}
                                   {...field}
                                   onChange={e => field.onChange(e.target.value)}/>}
                    />
                    <div role={"group"} id={"calendar"}>
                        {/*calendar header*/}
                        <div className={"flex justify-between px-1"}>
                            <h4 className={"text-2xl capitalize"}>{currMonthString} {currYear}</h4>
                            <div className={"flex gap-2"}>
                                <ArrowLeftIcon
                                    aria-disabled={!prevMonth}
                                    className={clsx("w-6",
                                        {"text-gray-500": !prevMonth})}
                                    onClick={handlePrevMonth}/>
                                <ArrowRightIcon
                                    aria-disabled={!nextMonth}
                                    className={clsx("w-6",
                                        {"text-gray-500": !nextMonth})}
                                    onClick={handleNextMonth}/>
                            </div>
                        </div>
                        {/*calendar days*/}
                        <div className={"grid grid-cols-7 mt-5 text-center gap-5"}>
                            {days.map((day: string) =>
                                <h4 key={day} className={"text-xl"}>{day}</h4>
                            )}
                            {Array.from({length: gridSpace}).map((_, i) =>(
                                <div key={i}></div>
                            ))}
                            {dateInMonth.map((dateItem: number) => {
                                let chosenDate: string[] = selectedDate.split("-")
                                let chosenYear: number = Number(chosenDate[0]);
                                let chosenMonth: number = Number(chosenDate[1])
                                let chosenDay: number = Number(chosenDate[2]);
                                let isSelectedDay: boolean = false;
                                let isValidDay: boolean = true;

                                if (chosenYear === currYear && (chosenMonth - 1) === date.getMonth() && chosenDay === dateItem){
                                    isSelectedDay = true;
                                }

                                if (dateItem < todaysDate && date.getMonth() === todaysMonth){
                                    isValidDay = false;
                                }

                               return <button key={dateItem}
                                              disabled={!isValidDay}
                                        onClick={() => handleSelectDate(Number(dateItem))}
                                              aria-disabled={isValidDay}
                                              aria-pressed={isSelectedDay}
                                        className={clsx("text-xl p-2 rounded-md",
                                            { "text-custom-red": dateItem === todaysDate && date.getMonth() === todaysMonth},
                                            {"text-gray-400": !isValidDay},
                                            {"hover:bg-gray-300 transition-colors": isValidDay},
                                            {"bg-gray-300": isSelectedDay})}>{dateItem}</button>
                            })}
                        </div>
                    </div>
                    {errors.date && <span id={"calendar-error"}>{errors.date.message}</span>}
                    <button
                        onClick={() => setSchemaSection("GUESTS")}
                        className={"mt-5 p-2 border-2 rounded-full w-fit scale-90 hover:scale-100 transition-all"}>
                        <ArrowLeftIcon className={"w-8 h-8"}/>
                    </button>
                </section>
            }
            {schemaSection === "TIME" &&
                <section className={"flex flex-col gap-5"}>
                    <h2 className={"text-xl text-custom-gray text-center"}>{selectedNumberOfGuest} personer</h2>
                    <h2 className={"text-xl text-custom-gray text-center"}>{selectedDate}</h2>
                    <label htmlFor="time" className={"text-2xl text-center font-title"}>Velg tid</label>
                    <Controller
                        control={control}
                        name={"time"}
                        render={({field}) =>
                            <input type={"text"}
                                   aria-label={"choose time of booking"}
                                   aria-controls={"time-group"}
                                   aria-describedby={"time-error"}
                                   className={"sr-only"}
                                   {...field}
                                   onChange={e => field.onChange(e.target.value)}/>}
                    />
                    {errors.time && <span id={"time-error"}>{errors.time.message}</span>}
                    <div role={"group"} id="time-group" aria-label={"time slots buttons"} className={"grid grid-cols-4 gap-3"}>
                        {timeSlotsExtended.map((timeSlot: TimeSlotExtended)=>(
                                <button key={timeSlot.time} type={"button"}
                                        onClick={()=> handleTime(timeSlot.time)}
                                        disabled={!timeSlot.available || timeSlot.pastTime}
                                        aria-pressed={selectedTime === timeSlot.time}
                                        aria-disabled={timeSlot.available}
                                        className={clsx(
                                            "relative border-2 border-gray-300 py-2 rounded-md text-xl",
                                            { "text-custom-green hover:bg-gray-300 transition-colors": timeSlot.available},
                                            {"text-gray-400": timeSlot.pastTime}
                                        )}>
                                    <p>{timeSlot.time}</p>
                                    {(!timeSlot.available && !timeSlot.pastTime) &&
                                        <div className={"bg-red-400 w-2 h-2 absolute right-1 top-1 rounded-full"}></div>}
                                </button>)
                        )}
                    </div>
                    <button
                        onClick={() => setSchemaSection("DATE")}
                        className={"p-2 border-2 rounded-full w-fit scale-90 hover:scale-100 transition-all"}>
                        <ArrowLeftIcon className={"w-8 h-8"}/>
                    </button>
                </section>
            }
            {schemaSection === "CONTACT" &&
                <section className={"flex flex-col gap-5"}>
                    <h2 className={"text-xl text-custom-gray text-center"}>{selectedNumberOfGuest} personer</h2>
                    <h2 className={"text-xl text-custom-gray text-center"}>{selectedDate}, kl. {selectedTime}</h2>
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
                            onClick={() => setSchemaSection("TIME")}
                            className={"p-2 border-2 rounded-full w-fit scale-90 hover:scale-100 transition-all"}>
                            <ArrowLeftIcon className={"w-8 h-8"}/>
                        </button>
                        <button type="submit"
                                className={"bg-black text-lg text-white w-fit py-2 px-8 rounded-3xl border-2 hover:bg-inherit hover:text-black"}>
                            Reserver
                        </button>
                    </div>
                </section>
            }
        </form>
    )
}