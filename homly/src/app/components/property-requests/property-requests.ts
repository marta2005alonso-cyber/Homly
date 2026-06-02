import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking-service';

@Component({
  selector: 'app-property-requests',
  imports: [CommonModule],
  templateUrl: './property-requests.html',
  styleUrl: './property-requests.css'
})
export class PropertyRequests {

  public requests: any[] = [];
  public propertyId: number = 0;
  public showAcceptModal: boolean = false;
  public showRejectModal: boolean = false;
  public pendingId: number = 0;

  constructor(
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.propertyId = this.route.snapshot.params['id'];

    this.bookingService.getByPropertyId(this.propertyId).subscribe({
      next: (datos: any) => {
        this.requests = datos.filter((b: any) =>
          b.status === 'PENDING' && b.offeredProperty != null
        );
        this.cdr.detectChanges();
      },
      error: (error: any) => console.error('Error: ', error)
    });
  }

  acceptRequest(id: number) {
    this.pendingId = id;
    this.showAcceptModal = true;
  }

  confirmAcceptRequest() {
    this.bookingService.updateStatus(this.pendingId, 'CONFIRMED').subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.id !== this.pendingId);
        this.showAcceptModal = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => console.error('Error: ', error)
    });
  }

  rejectRequest(id: number) {
    this.pendingId = id;
    this.showRejectModal = true;
  }

  confirmRejectRequest() {
    this.bookingService.deleteBooking(this.pendingId).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.id !== this.pendingId);
        this.showRejectModal = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => console.error('Error: ', error)
    });
  }

  goBack() {
    this.router.navigate(['/my-properties']);
  }
}