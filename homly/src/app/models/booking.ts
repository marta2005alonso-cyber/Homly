import { User } from "./user";
import { Property } from "./property";

export interface Booking {
    id: number;
    checkIn: string;
    checkOut: string;
    numberOfGuests: number;
    totalPrice: number;
    status: string;
    user: User;
    property: Property;
}
