import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PickupService {

  private apiUrl = `${environment.apiUrl}/pickups`;

  constructor(private http: HttpClient) {}

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // USER
  createPickup(data: any) {
    return this.http.post(`${this.apiUrl}`, data, this.getHeaders());
  }

  getMyPickups() {
    return this.http.get(`${this.apiUrl}/my`, this.getHeaders());
  }

  // VOLUNTEER
  getOpenPickups() {
    return this.http.get(`${this.apiUrl}/open`, this.getHeaders());
  }

  acceptPickup(id: string) {
    return this.http.put(`${this.apiUrl}/${id}/accept`, {}, this.getHeaders());
  }

  completePickup(id: string) {
    return this.http.put(`${this.apiUrl}/${id}/complete`, {}, this.getHeaders());
  }

  getMyAcceptedPickups() {
    return this.http.get(`${this.apiUrl}/accepted`, this.getHeaders());
  }

  // ADMIN
  getAllPickups() {
    return this.http.get(`${this.apiUrl}/all`, this.getHeaders());
  }

  deletePickup(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}