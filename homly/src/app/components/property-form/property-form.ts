import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../services/property-service';
import { AuthService } from '../../services/auth-service';
import { ImageService } from '../../services/image-service';

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
  public images: any[] = [];
  public selectedFiles: File[] = [];
  public propertyId: number = -1;
  public showDeleteImageModal: boolean = false;
  public pendingImageId: number = 0;
  public imageError: string = '';


  constructor(
    private propertyService: PropertyService,
    private authService: AuthService,
    private imageService: ImageService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    if (this.id != -1) {
      this.propertyId = this.id;
      this.propertyService.getPropertyById(this.id).subscribe({
        next: datos => {
          this.property = datos;
          this.cdr.detectChanges();
        },
        error: error => console.error('Error: ', error)
      });

      this.imageService.getByPropertyId(this.id).subscribe({
        next: datos => {
          this.images = datos;
          this.cdr.detectChanges();
        },
        error: error => console.error('Error: ', error)
      });
    }
  }

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;

    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
  }

  confirmDeleteImage(id: number) {
      this.pendingImageId = id;
      this.showDeleteImageModal = true;
  }

  confirmDeleteImageAction() {
      this.deleteImage(this.pendingImageId);
      this.showDeleteImageModal = false;
  }

  deleteImage(id: number) {
    this.imageService.deleteImage(id).subscribe({
      next: () => {
        this.images = this.images.filter(img => img.id !== id);
        this.cdr.detectChanges();
      },
      error: error => console.error('Error: ', error)
    });
  }

  save(form: any) {
    this.submitted = true;
    if (form.invalid) return;
    if (this.id == -1 && this.selectedFiles.length === 0) {
        this.imageError = 'Debes añadir al menos 1 imagen';
        return;
    }

    if (this.id != -1 && this.images.length === 0 && this.selectedFiles.length === 0) {
        this.imageError = 'Debes tener al menos 1 imagen';
        return;
    }
    this.showSaveModal = true;
  }

  confirmSave() {
    const user = this.authService.getUser();
    this.property.owner = { id: user.id };

    if (this.id == -1) {
      this.propertyService.addProperty(this.property).subscribe({
        next: (newProperty: any) => {
          this.uploadImages(newProperty.id, () => {
            this.router.navigate(['/my-properties']);
          });
        },
        error: error => console.error('Error: ', error)
      });
    } else {
      this.propertyService.updateProperty(this.id, this.property).subscribe({
        next: () => {
          this.uploadImages(this.id, () => {
            this.router.navigate(['/my-properties']);
          });
        },
        error: error => console.error('Error: ', error)
      });
    }
  }

  uploadImages(propertyId: number, callback: () => void) {
    if (this.selectedFiles.length === 0) {
      callback();
      return;
    }
    let uploaded = 0;
    for (const file of this.selectedFiles) {
      this.imageService.uploadImage(propertyId, file).subscribe({
        next: () => {
          uploaded++;
          if (uploaded === this.selectedFiles.length) {
            callback();
          }
        },
        error: error => console.error('Error: ', error)
      });
    }
  }

  goBack() {
    this.router.navigate(['/my-properties']);
  }
}