import { User } from "./user";

export interface Message {
    id: number;
    text: string;
    date: string;
    sender: User;
    receiver: User;
}
