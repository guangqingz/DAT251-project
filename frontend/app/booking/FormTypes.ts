import {z} from "zod";
import {maxNumberGuest} from "@/app/booking/BookingDetailsForm";

const customTimeRegex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

export const bookingSchema = z.object({
    numberGuest: z.coerce.number(),
    time: z.string().refine(
        (val) => customTimeRegex.test(val),
        {
            message: "Invalid time format, expected HH:MM or HH:MM:SS",
        }),
    date: z.string(),
    email: z.email(),
    phoneNumber: z.string().length(8, "Telefonnummer må være på 8 siffer"),
    comment: z.string().optional(),
})

export type BookingSchema = z.infer<typeof bookingSchema>

export const bookingSchema2 = z.object({
    numberGuest: z.number().min(1, "Minimum 1 guest").max(maxNumberGuest, `Maximum ${maxNumberGuest}`),
    time: z.string(),
    date: z.string(),
    email: z.email(),
    phoneNumber: z.string(),
    comment: z.string().optional()
})

export type BookingSchema2 = z.infer<typeof bookingSchema2>

export const bookingDetails = bookingSchema.pick({
    numberGuest: true,
    time: true,
    date: true,
})

export type BookingFormInput = z.input<typeof bookingDetails>;
export type BookingFormOutput = z.output<typeof bookingDetails>;

export const customerDetails = bookingSchema.pick({
    email: true,
    phoneNumber: true,
    comment: true
})

export type CustomerFormInput = z.input<typeof customerDetails>;
export type CustomerFormOutput = z.output<typeof customerDetails>;