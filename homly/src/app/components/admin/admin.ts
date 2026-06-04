import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { PropertyService } from '../../services/property-service';
import { BookingService } from '../../services/booking-service';
import { ReviewService } from '../../services/review-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {

  public activeTab: string = 'users';
  public users: any[] = [];
  public properties: any[] = [];
  public bookings: any[] = [];
  public reviews: any[] = [];
  public showDeleteModal: boolean = false;
  public deleteType: string = '';
  public pendingId: number = 0;
  public showLogoutModal: boolean = false;
  public showErrorModal: boolean = false;
  public showErrorUserModal: boolean = false;
  
  constructor(
    private userService: UserService,
    private propertyService: PropertyService,
    private bookingService: BookingService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const user = this.authService.getUser();
    if (!user || user.role !== 'ADMIN') {
      this.router.navigate(['/']);
      return;
    }
    this.loadUsers();
  }

  loadUsers() {
    const currentUser = this.authService.getUser();
    this.userService.getUsers().subscribe({
      next: (datos: any) => {
        this.users = datos.filter((u: any) => u.id !== currentUser.id);
        this.cdr.detectChanges();
      },
      error: (error: any) => console.error('Error: ', error)
    });
  }

  loadProperties() {
    this.propertyService.getProperties().subscribe({
      next: datos => { this.properties = datos; this.cdr.detectChanges(); },
      error: error => console.error('Error: ', error)
    });
  }

  loadBookings() {
    this.bookingService.getBookings().subscribe({
      next: datos => { this.bookings = datos; this.cdr.detectChanges(); },
      error: error => console.error('Error: ', error)
    });
  }

  loadReviews() {
    this.reviewService.getReviews().subscribe({
      next: datos => { this.reviews = datos; this.cdr.detectChanges(); },
      error: error => console.error('Error: ', error)
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'users') this.loadUsers();
    if (tab === 'properties') this.loadProperties();
    if (tab === 'bookings') this.loadBookings();
    if (tab === 'reviews') this.loadReviews();
  }

  confirmDelete(type: string, id: number) {
    this.deleteType = type;
    this.pendingId = id;
    this.showDeleteModal = true;
  }

  executeDelete() {
    if (this.deleteType === 'user') {
      this.userService.deleteUser(this.pendingId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== this.pendingId);
          this.showDeleteModal = false;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
        this.showDeleteModal = false;
        this.showErrorUserModal = true;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        }
      });
    } else if (this.deleteType === 'property') {
    this.propertyService.deleteProperty(this.pendingId).subscribe({
        next: () => {
            this.properties = this.properties.filter(p => p.id !== this.pendingId);
            this.showDeleteModal = false;
            this.cdr.detectChanges();
        },
        error: (error: any) => {
            this.showDeleteModal = false;
            this.showErrorModal = true;
            this.cdr.markForCheck();
            this.cdr.detectChanges();
        }
    });
    } else if (this.deleteType === 'review') {
      this.reviewService.deleteReview(this.pendingId).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(r => r.id !== this.pendingId);
          this.showDeleteModal = false;
          this.cdr.detectChanges();
        },
        error: error => console.error('Error: ', error)
      });
    }
  }


  goToProperty(id: number) {
    this.router.navigate(['/property', id]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  confirmLogout() {
      this.showLogoutModal = true;
  }
}