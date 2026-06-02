import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyService } from '../../services/property-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  public properties: any[] = [];
  public user: any = null;

  public search = {
    destination: '',
    guests: null,
    type: '',
    checkIn: '',
    checkOut: '',
  };

  constructor(private propertyService: PropertyService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.propertyService.getProperties().subscribe({
      next: datos => {
        this.properties = datos.slice(0, 6);
      },
      error: error => console.error('Error: ', error)
    });
  }

  onSearch() {
    this.router.navigate(['/listProperties'], { queryParams: this.search });
  }

  goToDetail(id: number) {
    this.router.navigate(['/property', id]);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  getMinCheckOut() {
    if (this.search.checkIn) {
        const date = new Date(this.search.checkIn);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    }
    return '';
  }
  
  goToMyProperties() {
    this.router.navigate(['/my-properties']);
  }

  getToday() {
    return new Date().toISOString().split('T')[0];
  }
  
  goToBookings() {
    this.router.navigate(['/bookings']);
  }

  goToFavorites() {
    this.router.navigate(['/favorites']);
  }
}
