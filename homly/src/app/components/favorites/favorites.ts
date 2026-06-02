import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FavoriteService } from '../../services/favorite-service';
import { AuthService } from '../../services/auth-service';
@Component({
  selector: 'app-favorites',
  imports: [CommonModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  public favorites: any[] = [];
  public user: any = {};
  public showConfirmModal: boolean = false;
  private pendingDeleteId: number = 0;

  constructor(
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();

    this.favoriteService.getByUserId(this.user.id).subscribe({
      next: datos => {
        this.favorites = datos;
        this.cdr.detectChanges();
      },
      error: error => console.error('Error: ', error)
    });
  }

  confirmDelete(id: number) {
    this.pendingDeleteId = id;
    this.showConfirmModal = true;
  }

  deleteFavorite() {
    this.favoriteService.deleteFavorite(this.pendingDeleteId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f.id !== this.pendingDeleteId);
        this.showConfirmModal = false;
        this.pendingDeleteId = 0;
        this.cdr.detectChanges();
      },
      error: error => console.error('Error: ', error)
    });
  }

  showDetails(id: number) {
    this.router.navigate(['/property', id]);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
