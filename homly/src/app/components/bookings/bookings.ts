import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking-service';
import { AuthService } from '../../services/auth-service';
import { ReviewService } from '../../services/review-service';

@Component({
  selector: 'app-bookings',
  imports: [CommonModule],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
})
export class Bookings {

  public bookings: any[] = [];
  public user: any = {};
  public reviews: any[] = [];
  public showCancelModal: boolean = false;
  public selectedBookingId: number = 0;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private reviewService: ReviewService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();

    this.bookingService.getBookings().subscribe({
      next: datos => {
        this.bookings = datos.filter((b: any) => b.user.id === this.user.id);
        this.cdr.detectChanges();
      },
      error: error => console.error('Error: ', error)
    });

    this.reviewService.getReviews().subscribe({
      next: (datos: any) => {
        this.reviews = datos;
        this.cdr.detectChanges();
      },
      error: (error: any) => console.error('Error: ', error)
    });
  }

  confirmCancel(id: number) {
    this.showCancelModal = true;
    this.selectedBookingId = id;
  }

  cancelBooking() {
    this.bookingService.deleteBooking(this.selectedBookingId).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(b => b.id !== this.selectedBookingId);
        this.showCancelModal = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => console.error('Error: ', error)
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  editBooking(id: number) {
    this.router.navigate(['/booking-form', id]);
  }

  addReview(bookingId: number) {
    this.router.navigate(['/review-form', bookingId]);
  }

  isExpired(checkOut: string) {
    return new Date(checkOut) < new Date();
  }

  isOneDayBefore(checkIn: string) {
    const today = new Date();
    const checkin = new Date(checkIn);
    const diff = (checkin.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 1;
  }

  getReviewByBooking(bookingId: number) {
    return this.reviews.find((r: any) => r.booking.id === bookingId);
  }

  isPending(id: number) {
    const booking = this.bookings.find(b => b.id === id);
    return booking?.status === 'PENDING';
  }

  goToProperty(id: number) {
    this.router.navigate(['/property', id]);
  }
}