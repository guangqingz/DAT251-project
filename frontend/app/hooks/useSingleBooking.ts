import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {BookingSchemaType} from "@/app/(main)/booking/FormTypes";

/**
 * Custom hook to get a specific booking based on id
 * @param id - of booking
 */
export default function useSingleBooking(id:string){
    return useQuery({
        queryKey: [`specificBooking`, id],
        queryFn: async () => {
            const response = await axios.get<BookingSchemaType>(`http://localhost:8080/booking/${id}`);
            return response.data;
        }
    })
}