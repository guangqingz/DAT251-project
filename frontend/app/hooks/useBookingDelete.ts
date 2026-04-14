import {useMutation} from "@tanstack/react-query";
import axios from "axios";

/**
 * Custom hook to delete booking given an id
 */
export default function useBookingSubmit() {
    return useMutation({
        mutationFn: (id: string) => {
            return axios.delete(`http://localhost:8080/booking/${id}`)
        },
    })
}