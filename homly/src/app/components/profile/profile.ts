import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { BookingService } from '../../services/booking-service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
  public submitted: boolean = false;
  public editForm: FormGroup;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private bookingService: BookingService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(4)]),
      firstName: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      secondName: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      phone: this.fb.control('', [Validators.required, Validators.pattern('^[0-9]{9}$')]),
      city: this.fb.control('', [Validators.required, Validators.minLength(3)])
    });
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.cdr.detectChanges();
  }

  edit() {
    this.editing = true;
    this.submitted = false;
    this.editForm.patchValue({
      name: this.user.name,
      firstName: this.user.firstName,
      secondName: this.user.secondName,
      email: this.user.email,
      phone: this.user.phone,
      city: this.user.city
    });
  }

  save() {
    this.submitted = true;
    if (this.editForm.invalid) return;

    const updatedUser = { ...this.user, ...this.editForm.value };

    this.userService.updateUser(this.user.id, updatedUser).subscribe({
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
        const today = new Date();
      today.setHours(0, 0, 0, 0);
      const confirmedBookings = datos.filter((b: any) =>
          (b.user.id === this.user.id || b.property.owner.id === this.user.id) &&
          b.status === 'CONFIRMED' &&
          b.checkOut &&
          new Date(b.checkOut) > today
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