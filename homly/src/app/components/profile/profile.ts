import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { BookingService } from '../../services/booking-service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  public user: any = {};
  public editing: boolean = false;
  public error: string = '';
  public showLogout: boolean = false;
  public showDelete: boolean = false;
  public showErrorModal: boolean = false;


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private bookingService: BookingService,
    private router: Router,
    private cdr: ChangeDetectorRef

  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.cdr.detectChanges();
  }

  edit() {
    this.editing = true;
  }

  save() {
    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: datos => {
        this.authService.saveUser(datos);
        this.user = datos;
        this.editing = false;
        this.cdr.detectChanges();
      },
      error: error => {
        this.error = 'Error al guardar los cambios';
        console.error('Error: ', error);
      }
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }


  logout() {
      this.showLogout = true;
  }

  confirmLogout() {
      this.authService.logout();
      this.router.navigate(['/']);
  }


  deleteAccount() {
    this.userService.getUserById(this.user.id).subscribe({
      next: () => {
        this.checkBookingsBeforeDelete();
      },
      error: error => console.error('Error: ', error)
    });
  }

  checkBookingsBeforeDelete() {
    this.bookingService.getBookings().subscribe({
        next: datos => {
            const confirmedBookings = datos.filter((b: any) =>
                (b.user.id === this.user.id || b.property.owner.id === this.user.id) &&
                b.status === 'CONFIRMED'
            );

            if (confirmedBookings.length > 0) {
                this.showErrorModal = true;
                return;
            }

            const pendingBookings = datos.filter((b: any) =>
                (b.user.id === this.user.id || b.property.owner.id === this.user.id) &&
                b.status === 'PENDING'
            );

            const cancelPromises = pendingBookings.map((b: any) =>
                this.bookingService.updateStatus(b.id, 'CANCELLED').subscribe()
            );

            this.showDelete = true;
        },
        error: error => console.error('Error: ', error)
    });
  }

  confirmDelete() {
    this.userService.deleteUser(this.user.id).subscribe({
        next: () => {
            this.authService.logout();
            this.router.navigate(['/']);
        },
        error: error => console.error('Error: ', error)
    });
  }
}
