import { Booking } from "./booking";

export interface Review {
    id: number;
    rating: number;
    comment: string;
    date: string;
    booking: Booking;
}