import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private url = environment.apiUrl + '/favorites';

  constructor(private http: HttpClient) { }

  getByUserId(userId: number) {
    return this.http.get<any[]>(`${this.url}/user/${userId}`);
  }

  addFavorite(userId: number, propertyId: number) {
    return this.http.post<any>(this.url, { user: { id: userId }, property: { id: propertyId } });
  }

  deleteFavorite(id: number) {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
