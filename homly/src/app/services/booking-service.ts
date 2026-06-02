import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Booking } from '../models/booking';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookingService {

  private url = environment.apiUrl + '/bookings';

  constructor(private http: HttpClient) { }

  getBookings() {
    return this.http.get<Booking[]>(this.url);
  }

  getBookingById(id: number) {
    return this.http.get<Booking>(`${this.url}/${id}`);
  }

  addBooking(booking: any) {
    return this.http.post<any>(this.url, booking);
  }

  updateBooking(id: number, booking: Booking) {
    return this.http.put<any>(`${this.url}/${id}`, booking);
  }

  deleteBooking(id: number) {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  getByPropertyId(propertyId: number) {
    return this.http.get<any[]>(`${this.url}/property/${propertyId}`);
  }

  updateStatus(id: number, status: string) {
    return this.http.put<any>(`${this.url}/${id}/status`, status);
  }
}