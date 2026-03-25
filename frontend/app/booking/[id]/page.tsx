'use client'

import Container from "@/app/ui/Container";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {useParams} from "next/navigation";

export default function Page(){
    const params = useParams();
    const id = params.id;

    const {data, isError} = useQuery({
        queryKey: [`booking`],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:8080/booking/${id}`);
            return response.data;
        }
    })

    return (<section className={"bg-custom-eggwhite h-full"}>
        <Container style={"flex flex-col items-center px-5 py-20 2xl:py-30 gap-9"}>
            {isError && <h1>Kan ikke finne booking bekreftelse for booking med <span className={"font-bold"}>ID:{id}</span></h1>}
            {data &&
               <>
                   <h1 className={"text-2xl uppercase"}>Booking bekreftet</h1>
                    <div className={"flex flex-col items-center gap-5 text-lg"}>
                        <p>Booking bekreftelse ble sendt til <span className={"font-bold"}>{data.email}</span></p>
                        <p>Antall gjester: <span className={"font-bold"}>{data.numberGuest}</span></p>
                        <p>Dato: <span className={"font-bold"}>{data.date.split("T")[0]}</span></p>
                        <p>Tid: <span className={"font-bold"}>{data.time}</span></p>
                        <p>Telefonnummer: <span className={"font-bold"}>{data.phoneNumber}</span></p>
                        <p>Kommentar: <span>{data.comment}</span></p>
                    </div>
                </>
                }
        </Container>
    </section>)
 }