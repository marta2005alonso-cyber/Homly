import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PropertyService } from '../../services/property-service';
import { AuthService } from '../../services/auth-service';
import { BookingService } from '../../services/booking-service';

@Component({
  selector: 'app-my-properties',
  imports: [CommonModule],
  templateUrl: './my-properties.html',
  styleUrl: './my-properties.css'
})
export class MyProperties {

  public properties: any[] = [];
  public user: any = {};
  public showDeleteModal: boolean = false;
  public showErrorModal: boolean = false;
  public pendingId: number = 0;

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();

    this.propertyService.getProperties().subscribe({
      next: datos => {
        this.properties = datos.filter((p: any) => p.owner.id === this.user.id);
        this.cdr.detectChanges();
      },
      error: error => console.error('Error: ', error)
    });
  }

  addProperty() {
    this.router.navigate(['/property-form', -1]);
  }

  editProperty(id: number) {
    this.router.navigate(['/property-form', id]);
  }

  deleteProperty(id: number) {
    this.bookingService.getByPropertyId(id).subscribe({
      next: (bookings: any[]) => {
        const active = bookings.filter(b => b.status !== 'CANCELLED');
        if (active.length > 0) {
          this.showErrorModal = true;
          this.cdr.detectChanges();
        } else {
          this.pendingId = id;
          this.showDeleteModal = true;
        }
      },
      error: error => console.error('Error: ', error)
    });
  }

  confirmDeleteProperty() {
    this.propertyService.deleteProperty(this.pendingId).subscribe({
      next: () => {
        this.properties = this.properties.filter(p => p.id !== this.pendingId);
        this.showDeleteModal = false;
        this.cdr.detectChanges();
      },
      error: error => console.error('Error: ', error)
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  viewBookings(id: number) {
    this.router.navigate(['/property-bookings', id]);
  }

  viewRequests(id: number) {
    this.router.navigate(['/property-requests', id]);
  }

  viewDetail(id: number) {
    this.router.navigate(['/property', id]);
  }
}