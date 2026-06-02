import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-booking-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css'
})
export class BookingForm {

  form: FormGroup;
  public id: number = -1;
  public totalPrice: number = 0;
  public pricePerNight: number = 0;
  public checkIn: string = '';
  public checkOut: string = '';
  public showSaveModal: boolean = false;
  public isExchange: boolean = false;

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.form = this.fb.group({
      numberOfGuests: this.fb.control(1, [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    this.bookingService.getBookingById(this.id).subscribe({
      next: datos => {
        this.pricePerNight = datos.property.pricePerNight;
        this.checkIn = datos.checkIn;
        this.checkOut = datos.checkOut;
        this.isExchange = datos.totalPrice === 0;
        this.form.patchValue({ numberOfGuests: datos.numberOfGuests });

        this.form.get('numberOfGuests')?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(datos.property.maxGuests)
        ]);
        this.form.get('numberOfGuests')?.updateValueAndValidity();
        this.calculatePrice();
      },
      error: error => console.error('Error: ', error)
    });
  }

  save() {
    this.showSaveModal = true;
  }

  confirmSave() {
    const formValue: any = {
      checkIn: this.checkIn,
      checkOut: this.checkOut,
      numberOfGuests: this.form.value.numberOfGuests,
      totalPrice: this.totalPrice
    };

    this.bookingService.updateBooking(this.id, formValue).subscribe({
      next: () => {
        this.router.navigate(['/bookings']);
      },
      error: error => console.error('Error: ', error)
    });
  }

  goBack() {
    this.location.back();
  }

calculatePrice() {
    if (this.isExchange) {
      this.totalPrice = 0;
      return;
    }
    if (this.checkIn && this.checkOut) {
      const start = new Date(this.checkIn);
      const end = new Date(this.checkOut);
      const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      this.totalPrice = days * this.pricePerNight;
    }
  }
}