import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../services/property-service';
import { ReviewService } from '../../services/review-service';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { BookingService } from '../../services/booking-service';
import { FormsModule } from '@angular/forms';
import { FavoriteService } from '../../services/favorite-service';

@Component({
  selector: 'app-property-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './property-detail.html',
  styleUrl: './property-detail.css',
})
export class PropertyDetail {

  public property: any = null;
  public reviews: any[] = [];
  public checkIn: string = '';
  public checkOut: string = '';
  public guests: number = 1;
  public totalPrice: number = 0;
  public selectedType: string = '';
  public userProperties: any[] = [];
  public selectedOfferedProperty: any = null;
  public bookings: any[] = [];
  public dateError: string = '';
  public isFavorite: boolean = false;
  public favoriteId: number = 0;
  public showSuccessModal: boolean = false;

  constructor(
    private propertyService: PropertyService,
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef,
    private favoriteService: FavoriteService

  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    const user = this.authService.getUser();

    this.checkIn = this.route.snapshot.queryParams['checkIn'] || '';
    this.checkOut = this.route.snapshot.queryParams['checkOut'] || '';
    this.guests = this.route.snapshot.queryParams['guests'] || 1;

    this.propertyService.getPropertyById(id).subscribe({
      next: datos => {
        this.property = datos;
        this.calculatePrice();
        this.cdr.detectChanges();

        if (user) {
          this.favoriteService.getByUserId(user.id).subscribe({
            next: favData => {
              const fav = favData.find((f: any) => f.property.id == Number(id));
              if (fav) {
                this.isFavorite = true;
                this.favoriteId = fav.id;
              } else {
                this.isFavorite = false;
                this.favoriteId = 0;
              }
              this.cdr.detectChanges();
            },
            error: error => console.error('Error: ', error)
          });
        }
      },
      error: error => console.error('Error: ', error)
    });

    this.loadUserProperties();

    this.bookingService.getBookings().subscribe({
      next: datos => {
        this.bookings = datos.filter((b: any) =>
          b.property.id == id && b.status !== 'CANCELLED'
        );
      },
      error: error => console.error('Error: ', error)
    });

    this.reviewService.getReviews().subscribe({
      next: datos => {
        console.log('reviews:', datos);
        this.reviews = datos.filter((r: any) => r.booking.property.id == id);
        console.log('reviews filtradas:', this.reviews);
        this.cdr.detectChanges();
      },
      error: error => console.error('Error: ', error)
    });
  }

  goBack() {
    this.location.back();
  }

  calculatePrice() {
    if (this.checkIn && this.checkOut) {
      const start = new Date(this.checkIn);
      const end = new Date(this.checkOut);
      const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      this.totalPrice = days * this.property.pricePerNight;
    }
  }

  reserve() {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.checkIn || !this.checkOut) {
      this.dateError = 'Debes seleccionar las fechas de entrada y salida';
      return;
    }

    if (this.guests < 1) {
        this.dateError = 'Debe indicar al menos 1 persona';
        return;
    }

    if (this.guests > this.property.maxGuests) {
      this.dateError = 'El número de personas supera el máximo permitido';
      return;
    }




    const start = new Date(this.checkIn);
    const end = new Date(this.checkOut);

    if (end <= start) {
      this.dateError = 'La fecha de salida debe ser al menos un día después de la entrada';
      return;
    }

    const ocupada = this.bookings.some((b: any) =>
      new Date(b.checkIn) < end && new Date(b.checkOut) > start
    );

    if (ocupada) {
      this.dateError = 'Esas fechas ya están reservadas, por favor elige otras fechas';
      return;
    }

    const isExchange = this.property.type === 'EXCHANGE' ||
      (this.property.type === 'BOTH' && this.selectedType === 'EXCHANGE');

    if (isExchange && !this.selectedOfferedProperty) {
      this.dateError = 'Debes seleccionar una propiedad para el intercambio';
      return;
    }

    this.dateError = '';

    const booking: any = {
      checkIn: this.checkIn,
      checkOut: this.checkOut,
      numberOfGuests: this.guests,
      totalPrice: isExchange ? 0 : this.totalPrice,
      user: { id: user.id },
      property: { id: this.property.id }
    };

    if (isExchange) {
      booking.offeredProperty = { id: this.selectedOfferedProperty.id };
    }

    this.bookingService.addBooking(booking).subscribe({
      next: () => {
        this.showSuccessModal = true;
        this.cdr.detectChanges();
      },
      error: error => console.error('Error: ', error)
    });
  }

  loadUserProperties() {
    const user = this.authService.getUser();
    if (user) {
      this.propertyService.getProperties().subscribe({
        next: datos => {
          this.userProperties = datos.filter((p: any) => p.owner.id === user.id);
        },
        error: error => console.error('Error: ', error)
      });
    }
  }

  getToday() {
    return new Date().toISOString().split('T')[0];
  }

  getMinCheckOut() {
    if (this.checkIn) {
      const date = new Date(this.checkIn);
      date.setDate(date.getDate() + 1);
      return date.toISOString().split('T')[0];
    }
    return '';
  }

  addFavorite() {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isFavorite) {
      this.favoriteService.deleteFavorite(this.favoriteId).subscribe({
        next: () => {
          this.isFavorite = false;
          this.favoriteId = 0;
          this.cdr.detectChanges();
        },
        error: error => console.error('Error: ', error)
      });
    } else {
      this.favoriteService.addFavorite(user.id, this.property.id).subscribe({
        next: (datos: any) => {
          this.isFavorite = true;
          this.favoriteId = datos.id;
          this.cdr.detectChanges();
        },
        error: error => console.error('Error: ', error)
      });
    }
  }

  goToBookings() {
    this.router.navigate(['/bookings']);
  }
}