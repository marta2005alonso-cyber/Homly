import { Component, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
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
    { name: 'Milan', img: 'https://images.unsplash.com/photo-1610016302534-6f67f1c968d8?q=80&w=1075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Oporto', img: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Francia', img: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },

    { name: 'Valencia', img: 'https://images.unsplash.com/photo-1725208179317-c5e56702816a?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Granada', img: 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=1600&q=80' },
  ];


  public search = {
    destination: '',
    guests: null,
    type: '',
    checkIn: '',
    checkOut: '',
  };

  constructor(
    private propertyService: PropertyService, 
    private router: Router, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.propertyService.getProperties().subscribe({
      next: datos => {
        const shuffled = datos.sort(() => Math.random() - 0.5);
        this.properties =shuffled.slice(0, 4);
        this.cdr.detectChanges();
      },
      error: error => console.error('Error: ', error)
    });
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.cities.length;
      this.cdr.detectChanges();
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
