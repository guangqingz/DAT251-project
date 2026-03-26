import {useEffect} from "react";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {isPastTime} from "@/app/utils/utils";
import {TimeSlotExtendedType, TimeSlotRequestType, TimeSlotType} from "@/app/booking/FormTypes";

export function useTimeSlots(chosenNumberGuest: number, chosenFullDate: string){
    const mutation = useMutation({
        mutationFn: (timeSlotRequestData: TimeSlotRequestType) => {
            return axios.post(`http://localhost:8080/booking/timeslot`, timeSlotRequestData);
        }
    })

    const timeSlotsExtended: TimeSlotExtendedType[] = mutation.data?.data.map((prev: TimeSlotType)=> ({
        ...prev,
        time: prev.time.slice(0, -3),
        pastTime: isPastTime(prev.time, chosenFullDate)
    })) ?? [];

    useEffect(()=> {
        const request: TimeSlotRequestType = {
            date: chosenFullDate || "",
            numGuests: chosenNumberGuest || 0,
        }
        mutation.mutate(request);
    }, [chosenNumberGuest, chosenFullDate])

    return timeSlotsExtended;
}