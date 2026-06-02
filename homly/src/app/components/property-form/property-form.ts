import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../services/property-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-property-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css'
})
export class PropertyForm {

  public property: any = {
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    maxGuests: 1,
    pricePerNight: 0,
    entryTime: '',
    departureTime: '',
    type: 'RENT'
  };

  public id: number = -1;
  public showSaveModal: boolean = false;
  public submitted: boolean = false;

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    if (this.id != -1) {
      this.propertyService.getPropertyById(this.id).subscribe({
        next: datos => {
          this.property = datos;
          this.cdr.detectChanges();
        },
        error: error => console.error('Error: ', error)
      });
    }
  }

  save(form: any) {
    this.submitted = true;
    if (form.invalid) return;
    this.showSaveModal = true;
  }

  confirmSave() {
    const user = this.authService.getUser();
    this.property.owner = { id: user.id };

    if (this.id == -1) {
      this.propertyService.addProperty(this.property).subscribe({
        next: () => {
          this.router.navigate(['/my-properties']);
        },
        error: error => console.error('Error: ', error)
      });
    } else {
      this.propertyService.updateProperty(this.id, this.property).subscribe({
        next: () => {
          this.router.navigate(['/my-properties']);
        },
        error: error => console.error('Error: ', error)
      });
    }
  }

  goBack() {
    this.router.navigate(['/my-properties']);
  }
}