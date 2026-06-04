import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class Home implements OnInit, OnDestroy {
  public properties: any[] = [];
  public user: any = null;
  public currentSlide: number = 0;
  private slideInterval: any;

  public cities = [
    { name: 'Sevilla', img: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1600&q=80' },
    { name: 'Madrid', img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1600&q=80' },
    { name: 'Barcelona', img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1600&q=80' },
    { name: 'Valencia', img: 'https://images.unsplash.com/photo-1591871937631-2f64059d234f?w=1600&q=80' },
    { name: 'Granada', img: 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=1600&q=80' },
  ];


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
        const shuffled = datos.sort(() => Math.random() - 0.5);
        this.properties =shuffled.slice(0, 4);
      },
      error: error => console.error('Error: ', error)
    });
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.cities.length;
    }, 4000);
  }

  ngOnDestroy() {
    clearInterval(this.slideInterval);
  }

  setSlide(index: number) {
    this.currentSlide = index;
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
