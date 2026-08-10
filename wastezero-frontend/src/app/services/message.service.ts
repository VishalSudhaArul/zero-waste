import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MessageService {

  private apiUrl = `${environment.apiUrl}/messages`;
  private socket!: Socket;
  private messageSubject = new Subject<any>();
  message$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient) {
    this.connectSocket();
  }

  private connectSocket(): void {
    this.socket = io(environment.socketUrl, {
      transports: ['websocket', 'polling']
    });

    // Join room after connection established
    this.socket.on('connect', () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.socket.emit('join', userId);
      }
    });

    this.socket.on('newMessage', (msg: any) => {
      this.messageSubject.next(msg);
    });

    this.socket.on('connect_error', (err: any) => {
      console.warn('Socket error:', err.message);
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

  sendMessage(receiver_id: string, content: string) {
    return this.http.post(
      `${this.apiUrl}/send`,
      { receiver_id, content },
      this.getHeaders()
    );
  }

  getConversation(userId: string) {
    return this.http.get(`${this.apiUrl}/${userId}`, this.getHeaders());
  }

  getInbox() {
    return this.http.get(`${this.apiUrl}/inbox`, this.getHeaders());
  }

  getUsers() {
    return this.http.get(`${this.apiUrl}/users`, this.getHeaders());
  }

  getUnreadCount() {
    return this.http.get(`${this.apiUrl}/unread`, this.getHeaders());
  }
}