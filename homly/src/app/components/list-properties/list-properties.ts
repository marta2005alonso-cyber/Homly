import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../services/property-service';
import { AuthService } from '../../services/auth-service';
import { BookingService } from '../../services/booking-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-list-properties',
  imports: [CommonModule],
  templateUrl: './list-properties.html',
  styleUrl: './list-properties.css',
})
export class ListProperties {

  public properties: any[] = [];

  constructor(
    private propertyService: PropertyService,
    private bookingService: BookingService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private location: Location
  ) { }

  ngOnInit() {
    const destination = this.route.snapshot.queryParams['destination'];
    const type = this.route.snapshot.queryParams['type'];
    const guests = this.route.snapshot.queryParams['guests'];
    const checkIn = this.route.snapshot.queryParams['checkIn'];
    const checkOut = this.route.snapshot.queryParams['checkOut'];

    this.propertyService.getProperties().subscribe({
      next: datos => {
        let resultado = datos;

        if (destination && destination !== '') {
          resultado = resultado.filter((p: any) =>
            p.city.toLowerCase().includes(destination.toLowerCase())
          );
        }

        if (type && type !== '') {
          resultado = resultado.filter((p: any) =>
            p.type === type || p.type === 'BOTH'
          );
        }

        if (guests && guests !== '') {
          resultado = resultado.filter((p: any) =>
            p.maxGuests >= Number(guests)
          );
        }
        const user = this.authService.getUser();
        if (user) {
          resultado = resultado.filter((p: any) => p.owner.id !== user.id);
        }
        if (checkIn && checkOut) {
          this.bookingService.getBookings().subscribe({
            next: bookings => {
              resultado = resultado.filter((p: any) => {
                const ocupada = bookings.some((b: any) =>
                  b.property.id === p.id &&
                  new Date(checkIn) < new Date(b.checkOut) &&
                  new Date(checkOut) > new Date(b.checkIn)
                );
                return !ocupada;
              });

              this.properties = resultado;
              this.cdr.detectChanges();
            },
            error: error => console.error('Error: ', error)
          });
        } else {
          this.properties = resultado;
          this.cdr.detectChanges();
        }
      },
      error: error => console.error('Error: ', error)
    });
  }

  showDetails(id: number) {
    this.router.navigate(['/property', id], {
      queryParams: {
        checkIn: this.route.snapshot.queryParams['checkIn'],
        checkOut: this.route.snapshot.queryParams['checkOut'],
        guests: this.route.snapshot.queryParams['guests']
      }
    });
  }

  goBack() {
    this.location.back();
  }
}