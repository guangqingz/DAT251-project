import {useEffect} from "react";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {TimeSlotExtendedType, TimeSlotRequestType, TimeSlotType} from "@/app/booking/FormTypes";

/**
 * Custom hook to get restaurant time slots
 * @param chosenNumberGuest - number of guests in the booking
 * @param chosenFullDate - date of the booking
 * @return list of time slots including time, availability and if it's past current time
 */
export function useTimeSlots(chosenNumberGuest: number, chosenFullDate: string){
    const mutation = useMutation({
        mutationFn: async (timeSlotRequestData: TimeSlotRequestType) => {
            const response = await axios.post(`http://localhost:8080/booking/timeslot`, timeSlotRequestData);
            return response.data;
        }
    })

    const timeSlotsExtended: TimeSlotExtendedType[] = mutation.data || [];

    useEffect(()=> {
        const request: TimeSlotRequestType = {
            date: chosenFullDate || "",
            numGuests: chosenNumberGuest || 0,
        }
        mutation.mutate(request);
    }, [chosenNumberGuest, chosenFullDate])

    return timeSlotsExtended;
}