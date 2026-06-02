import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private url = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.url}/login`, { email, password });
  }

  register(user: any) {
    return this.http.post<any>(`${this.url}/register`, user);
  }

  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  isLoggedIn() {
    return localStorage.getItem('user') !== null;
  }

  logout() {
    localStorage.removeItem('user');
  }
}
