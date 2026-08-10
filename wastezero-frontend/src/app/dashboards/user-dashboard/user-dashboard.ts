import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.html',
})
export class UserDashboard implements OnInit {

  totalPickups = 0;
  completed = 0;
  pending = 0;
  accepted = 0;
  userName = localStorage.getItem('name') || 'User';

  showVideoBanner = true;
  selectedClipIndex = 0;

  clips = [
    { title: 'Full 60s Showcase', src: '/assets/videos/zerowaste_showcase_full.mp4', icon: '🎬', tag: 'Full Video' },
    { title: '1. Request Pickup', src: '/assets/videos/zerowaste clip1.mp4', icon: '📱', tag: '10s Clip' },
    { title: '2. Volunteer Dispatch', src: '/assets/videos/zerowaste clip2.mp4', icon: '🚛', tag: '10s Clip' },
    { title: '3. Waste Segregation', src: '/assets/videos/zerowaste clip3.mp4', icon: '♻️', tag: '10s Clip' },
    { title: '4. Recycling Facility', src: '/assets/videos/zerowaste clip4.mp4', icon: '🏭', tag: '10s Clip' },
    { title: '5. Impact Metrics', src: '/assets/videos/zerowaste clip5.mp4', icon: '📊', tag: '10s Clip' },
    { title: '6. Community Rewards', src: '/assets/videos/zerowaste clip6.mp4', icon: '🌱', tag: '10s Clip' },
  ];

  wasteStats = [
    { label: 'Plastic', icon: '🧴', kg: 0, bg: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30' },
    { label: 'Organic', icon: '🌿', kg: 0, bg: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30' },
    { label: 'E-Waste', icon: '💻', kg: 0, bg: 'from-cyan-500/20 to-blue-500/10', border: 'border-cyan-500/30' },
    { label: 'Metal',   icon: '🔩', kg: 0, bg: 'from-slate-500/20 to-zinc-500/10', border: 'border-slate-500/30' },
  ];

  recentPickups: any[] = [];
  isLoading = true;

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

    this.http.get<any[]>(`${this.apiUrl}/pickups/my`, this.getHeaders()).subscribe({
      next: (pickups) => {
        this.isLoading    = false;
        this.totalPickups = pickups.length;
        this.completed    = pickups.filter(p => p.status === 'Completed').length;
        this.pending      = pickups.filter(p => p.status === 'Open').length;
        this.accepted     = pickups.filter(p => p.status === 'Accepted').length;
        this.recentPickups = pickups.slice(0, 4);

        const wasteMap: any = { Plastic: 0, Organic: 0, 'E-Waste': 0, Metal: 0 };
        pickups.forEach(p => {
          if (wasteMap[p.wasteType] !== undefined) wasteMap[p.wasteType]++;
        });

        this.wasteStats = [
          { label: 'Plastic', icon: '🧴', kg: wasteMap['Plastic'], bg: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30' },
          { label: 'Organic', icon: '🌿', kg: wasteMap['Organic'], bg: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30' },
          { label: 'E-Waste', icon: '💻', kg: wasteMap['E-Waste'], bg: 'from-cyan-500/20 to-blue-500/10', border: 'border-cyan-500/30' },
          { label: 'Metal',   icon: '🔩', kg: wasteMap['Metal'], bg: 'from-slate-500/20 to-zinc-500/10', border: 'border-slate-500/30' },
        ];

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Dashboard load error:', err);
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