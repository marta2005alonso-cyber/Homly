import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    private url = environment.apiUrl + '/images';

    constructor(private http: HttpClient) { }

    getByPropertyId(propertyId: number) {
        return this.http.get<any[]>(`${this.url}/property/${propertyId}`);
    }

    uploadImage(propertyId: number, file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<any>(`${this.url}/property/${propertyId}`, formData);
    }

    deleteImage(id: number) {
        return this.http.delete<any>(`${this.url}/${id}`);
    }
}