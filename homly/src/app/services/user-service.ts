import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = environment.apiUrl + '/users';

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<User[]>(this.url);
  }

  getUserById(id: number) {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  addUser(user: User) {
    return this.http.post<any>(this.url, user);
  }

  updateUser(id: number, user: User) {
    return this.http.put<any>(`${this.url}/${id}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
