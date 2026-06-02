import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Message } from '../models/message'

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private url = environment.apiUrl + '/messages';

  constructor(private http: HttpClient) { }

  getMessages() {
    return this.http.get<Message[]>(this.url);
  }

  getMessageById(id: number) {
    return this.http.get<Message>(`${this.url}/${id}`);
  }

  addMessage(message: Message) {
    return this.http.post<any>(this.url, message);
  }

  deleteMessage(id: number) {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
