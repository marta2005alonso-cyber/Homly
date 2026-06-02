import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private url = environment.apiUrl + '/reviews';

  constructor(private http: HttpClient) { }

  getReviews() {
    return this.http.get<Review[]>(this.url);
  }

  getReviewById(id: number) {
    return this.http.get<Review>(`${this.url}/${id}`);
  }

  addReview(review: any) {
    return this.http.post<any>(this.url, review);
  }

  deleteReview(id: number) {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

  updateReview(id: number, review: any) {
    return this.http.put<any>(`${this.url}/${id}`, review);
  }
  
}
