import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private apiUrl = `${environment.apiUrl}/notifications`;
  private socket!: Socket;
  private notifSubject = new Subject<any>();
  notification$ = this.notifSubject.asObservable();

  constructor(private http: HttpClient) {
    this.connectSocket();
  }

  private connectSocket(): void {
    this.socket = io(environment.socketUrl, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.socket.emit('join', userId);
      }
    });

    this.socket.on('newNotification', (notif: any) => {
      this.notifSubject.next(notif);
    });

    this.socket.on('connect_error', (err: any) => {
      console.warn('Notification socket error:', err.message);
    });
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getNotifications() {
    return this.http.get(`${this.apiUrl}`, this.getHeaders());
  }

  getUnreadCount() {
    return this.http.get<{ count: number }>(
      `${this.apiUrl}/unread`,
      this.getHeaders()
    );
  }

  markAllRead() {
    return this.http.put(`${this.apiUrl}/read-all`, {}, this.getHeaders());
  }

  markOneRead(id: string) {
    return this.http.put(`${this.apiUrl}/${id}/read`, {}, this.getHeaders());
  }
}