import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Property } from '../models/property';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private url = environment.apiUrl + '/properties';

  constructor(private http: HttpClient) { }

  getProperties() {
    return this.http.get<Property[]>(this.url);
  }

  getPropertyById(id: number) {
    return this.http.get<Property>(`${this.url}/${id}`);
  }

  addProperty(property: Property) {
    return this.http.post<any>(this.url, property);
  }

  updateProperty(id: number, property: Property) {
    return this.http.put<any>(`${this.url}/${id}`, property);
  }

  deleteProperty(id: number) {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
