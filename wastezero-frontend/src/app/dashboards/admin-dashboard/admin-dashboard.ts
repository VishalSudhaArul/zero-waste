import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  totalOpportunities = 0;
  totalVolunteers    = 0;
  totalApplications  = 0;
  totalPickups       = 0;
  completedPickups   = 0;
  pendingPickups     = 0;
  recentPickups: any[] = [];
  isLoading = true;

  showVideoBanner = true;
  selectedClipIndex = 0;

  clips = [
    { title: 'Full 60s Showcase', src: '/assets/videos/zerowaste_showcase_full.mp4', icon: '🎬', tag: 'Full Video' },
    { title: '1. Eco Pickup Request', src: '/assets/videos/zerowaste clip1.mp4', icon: '📱', tag: '10s Clip' },
    { title: '2. Volunteer Dispatch', src: '/assets/videos/zerowaste clip2.mp4', icon: '🚛', tag: '10s Clip' },
    { title: '3. Waste Segregation', src: '/assets/videos/zerowaste clip3.mp4', icon: '♻️', tag: '10s Clip' },
    { title: '4. Green Recycling Hub', src: '/assets/videos/zerowaste clip4.mp4', icon: '🏭', tag: '10s Clip' },
    { title: '5. Impact Analytics', src: '/assets/videos/zerowaste clip5.mp4', icon: '📊', tag: '10s Clip' },
    { title: '6. Community Rewards', src: '/assets/videos/zerowaste clip6.mp4', icon: '🌱', tag: '10s Clip' },
  ];

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;

    this.http.get<any[]>(`${this.apiUrl}/pickups/all`, this.getHeaders()).subscribe({
      next: (pickups) => {
        this.totalPickups     = pickups.length;
        this.completedPickups = pickups.filter(p => p.status === 'Completed').length;
        this.pendingPickups   = pickups.filter(p => p.status === 'Open').length;
        this.recentPickups    = pickups.slice(0, 4);
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });

    this.http.get<any[]>(`${this.apiUrl}/opportunities/all`, this.getHeaders()).subscribe({
      next: (opps) => {
        this.totalOpportunities = opps.length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });

    this.http.get<any[]>(`${this.apiUrl}/applications`, this.getHeaders()).subscribe({
      next: (apps) => {
        this.totalApplications = apps.length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });

    this.http.get<any[]>(`${this.apiUrl}/messages/users`, this.getHeaders()).subscribe({
      next: (users) => {
        this.isLoading       = false;
        this.totalVolunteers = users.filter((u: any) => u.role === 'volunteer').length;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  selectClip(index: number) {
    this.selectedClipIndex = index;
    this.cdr.detectChanges();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Open':      return 'bg-amber-950/60 text-amber-300 border-amber-800/40';
      case 'Accepted':  return 'bg-teal-950/60 text-teal-300 border-teal-800/40';
      case 'Completed': return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40';
      default:          return 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30';
    }
  }

  getWasteIcon(type: string): string {
    const icons: any = {
      Plastic: '🧴', Organic: '🌿',
      'E-Waste': '💻', Metal: '🔩', Glass: '🫙'
    };
    return icons[type] || '🗑️';
  }
}