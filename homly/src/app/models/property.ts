import { User } from "./user";

export interface Property {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    maxGuests: number;
    pricePerNight: number;
    entryTime: string;
    departureTime: string;
    owner: User;
}
