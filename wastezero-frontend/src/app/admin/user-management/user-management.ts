import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-management.html'
})
export class UserManagement implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];
  isLoading = true;
  searchQuery = '';
  filterRole = 'all';
  filterStatus = 'all';

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.http.get<any[]>(`${this.apiUrl}/admin/users`, this.getHeaders()).subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  applyFilters() {
    let result = [...this.users];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.location?.toLowerCase().includes(q)
      );
    }

    if (this.filterRole !== 'all') {
      result = result.filter(u => u.role === this.filterRole);
    }

    if (this.filterStatus !== 'all') {
      result = result.filter(u =>
        this.filterStatus === 'suspended'
          ? u.status === 'suspended'
          : u.status !== 'suspended'
      );
    }

    this.filteredUsers = result;
    this.cdr.detectChanges();
  }

  suspendUser(id: string) {
    if (!confirm('Are you sure you want to suspend this user?')) return;
    this.http.put(`${this.apiUrl}/admin/users/${id}/suspend`, {}, this.getHeaders()).subscribe({
      next: () => { this.loadUsers(); },
      error: (err: any) => console.error(err)
    });
  }

  activateUser(id: string) {
    this.http.put(`${this.apiUrl}/admin/users/${id}/activate`, {}, this.getHeaders()).subscribe({
      next: () => { this.loadUsers(); },
      error: (err: any) => console.error(err)
    });
  }

  getRoleBadge(role: string): string {
    if (role === 'admin')     return 'bg-yellow-900/20 text-yellow-400 border-yellow-900/30';
    if (role === 'volunteer') return 'bg-teal-900/20 text-teal-400 border-teal-900/30';
    return 'bg-green-900/20 text-green-400 border-green-900/30';
  }

  getStatusBadge(status: string): string {
    return status === 'suspended'
      ? 'bg-red-900/20 text-red-400 border-red-900/30'
      : 'bg-green-900/20 text-green-400 border-green-900/30';
  }

  getTotalByRole(role: string): number {
    return this.users.filter(u => u.role === role).length;
  }

  getSuspendedCount(): number {
    return this.users.filter(u => u.status === 'suspended').length;
  }
}