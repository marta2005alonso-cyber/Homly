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
      checkIn: this.fb.control('', [Validators.required]),
      checkOut: this.fb.control('', [Validators.required]),
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

        this.form.patchValue({
            checkIn: datos.checkIn,
            checkOut: datos.checkOut,
            numberOfGuests: datos.numberOfGuests
        });

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
          checkIn: this.isExchange ? this.checkIn : this.form.value.checkIn,
          checkOut: this.isExchange ? this.checkOut : this.form.value.checkOut,
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
      const checkIn = this.form.get('checkIn')?.value;
      const checkOut = this.form.get('checkOut')?.value;
      if (checkIn && checkOut) {
          const start = new Date(checkIn);
          const end = new Date(checkOut);
          const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
          this.totalPrice = days * this.pricePerNight;
      }
  }

  getToday() {
    return new Date().toISOString().split('T')[0];
  }

  getMinCheckOut() {
      const checkIn = this.form.get('checkIn')?.value;
      if (checkIn) {
          const date = new Date(checkIn);
          date.setDate(date.getDate() + 1);
          return date.toISOString().split('T')[0];
      }
      return '';
  }
}