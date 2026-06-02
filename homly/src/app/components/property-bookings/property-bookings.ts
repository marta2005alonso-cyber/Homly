import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking-service';

@Component({
  selector: 'app-property-bookings',
  imports: [CommonModule],
  templateUrl: './property-bookings.html',
  styleUrl: './property-bookings.css'
})
export class PropertyBookings {

  public bookings: any[] = [];
  public propertyId: number = 0;
  public showCancelModal: boolean = false;
  public pendingId: number = 0;
  public propertyName: string = '';

  constructor(
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.propertyId = this.route.snapshot.params['id'];

    this.bookingService.getByPropertyId(this.propertyId).subscribe({
      next: datos => {
        if (datos.length > 0) {
          this.propertyName = datos[0].property.name;
        }
        this.bookings = datos.filter((b: any) =>
          b.property.id == this.propertyId &&
          b.status === 'CONFIRMED'
        );
        this.cdr.detectChanges();
      },
      error: (error: any) => console.error('Error: ', error)
    });
  }

  cancelBooking(id: number) {
    this.pendingId = id;
    this.showCancelModal = true;
  }

  confirmCancelBooking() {
    this.bookingService.deleteBooking(this.pendingId).subscribe({
      next: () => {
        this.bookings = this.bookings.filter(b => b.id !== this.pendingId);
        this.showCancelModal = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => console.error('Error: ', error)
    });
  }

  goBack() {
    this.router.navigate(['/my-properties']);
  }

  isExpired(checkOut: string) {
    return new Date(checkOut) < new Date();
  }
}