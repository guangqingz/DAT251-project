import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {BookingSchemaType} from "@/app/booking/FormTypes";

/**
 * Custom hook to get a specific booking based on id
 * @param id - of booking
 */
export default function useSingleBooking(id:string){
    const {data, isError, isPending} = useQuery({
        queryKey: [`booking`],
        queryFn: async () => {
            const response = await axios.get<BookingSchemaType>(`http://localhost:8080/booking/${id}`);
            return response.data;
        }
    })
    return {data, isError, isPending}
}