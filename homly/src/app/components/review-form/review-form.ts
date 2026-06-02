import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReviewService } from '../../services/review-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-review-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-form.html',
  styleUrl: './review-form.css'
})
export class ReviewForm {

  form: FormGroup;
  public bookingId: number = 0;
  public reviewId: number = -1;
  public showSaveModal: boolean = false;

  constructor(
    private reviewService: ReviewService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.form = this.fb.group({
      rating: this.fb.control('', [Validators.required, Validators.min(1), Validators.max(5)]),
      comment: this.fb.control('', [Validators.required, Validators.minLength(10)])
    });
  }

  ngOnInit() {
    this.bookingId = this.route.snapshot.params['bookingId'];

    this.reviewService.getReviews().subscribe({
      next: (datos: any) => {
        const existing = datos.find((r: any) => r.booking.id == this.bookingId);
        if (existing) {
          this.reviewId = existing.id;
          this.form.patchValue(existing);
        }
      },
      error: (error: any) => console.error('Error: ', error)
    });
  }

  save() {
    this.showSaveModal = true;
  }

  confirmSave() {
    const review = {
      rating: this.form.value.rating,
      comment: this.form.value.comment,
      date: new Date().toISOString().split('T')[0],
      booking: { id: this.bookingId }
    };

    if (this.reviewId !== -1) {
      this.reviewService.updateReview(this.reviewId, review).subscribe({
        next: () => { this.router.navigate(['/bookings']); },
        error: (error: any) => console.error('Error: ', error)
      });
    } else {
      this.reviewService.addReview(review).subscribe({
        next: () => { this.router.navigate(['/bookings']); },
        error: (error: any) => console.error('Error: ', error)
      });
    }
  }


  goBack() {
    this.location.back();
  }
}