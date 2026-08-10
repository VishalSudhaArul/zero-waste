import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reports.html'
})
export class Reports implements OnInit {

  reportData: any = null;
  isLoading = true;
  activeTab: 'overview' | 'users' | 'pickups' | 'opportunities' | 'volunteers' = 'overview';

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
    this.loadReports();
  }

  loadReports() {
    this.isLoading = true;
    this.http.get<any>(`${this.apiUrl}/admin/reports`, this.getHeaders()).subscribe({
      next: (data) => {
        this.reportData = data;
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

  switchTab(tab: any) {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }

  // CSV Export
  downloadCSV() {
    if (!this.reportData) return;

    const rows: string[][] = [];

    // Header
    rows.push(['WasteZero Platform Report']);
    rows.push(['Generated on', new Date().toLocaleString()]);
    rows.push([]);

    // Users
    rows.push(['=== USER REPORT ===']);
    rows.push(['Total Users', this.reportData.users.total]);
    rows.push(['Citizens', this.reportData.users.citizens]);
    rows.push(['Volunteers', this.reportData.users.volunteers]);
    rows.push(['Active', this.reportData.users.active]);
    rows.push(['Suspended', this.reportData.users.suspended]);
    rows.push([]);

    // Pickups
    rows.push(['=== PICKUP REPORT ===']);
    rows.push(['Total Pickups', this.reportData.pickups.total]);
    rows.push(['Open', this.reportData.pickups.open]);
    rows.push(['Accepted', this.reportData.pickups.accepted]);
    rows.push(['Completed', this.reportData.pickups.completed]);
    rows.push([]);

    // Waste by type
    rows.push(['=== WASTE BY CATEGORY ===']);
    rows.push(['Waste Type', 'Count']);
    this.reportData.wasteByType.forEach((w: any) => {
      rows.push([w._id, w.count]);
    });
    rows.push([]);

    // Opportunities
    rows.push(['=== OPPORTUNITY REPORT ===']);
    rows.push(['Total', this.reportData.opportunities.total]);
    rows.push(['Open', this.reportData.opportunities.open]);
    rows.push(['In Progress', this.reportData.opportunities.inProgress]);
    rows.push(['Closed', this.reportData.opportunities.closed]);
    rows.push([]);

    // Applications
    rows.push(['=== APPLICATION REPORT ===']);
    rows.push(['Total', this.reportData.applications.total]);
    rows.push(['Pending', this.reportData.applications.pending]);
    rows.push(['Accepted', this.reportData.applications.accepted]);
    rows.push(['Rejected', this.reportData.applications.rejected]);
    rows.push([]);

    // Top Volunteers
    rows.push(['=== TOP VOLUNTEERS ===']);
    rows.push(['Name', 'Email', 'Location', 'Completed Pickups']);
    this.reportData.topVolunteers.forEach((v: any) => {
      rows.push([v.name, v.email, v.location || 'N/A', v.completedPickups]);
    });

    // Build CSV
    const csvContent = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wastezero-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  getWasteIcon(type: string): string {
    const icons: any = {
      Plastic: '🧴', Organic: '🌿',
      'E-Waste': '💻', Metal: '🔩', Glass: '🫙', Other: '🗑️'
    };
    return icons[type] || '🗑️';
  }

  getCompletionRate(): number {
    if (!this.reportData?.pickups?.total) return 0;
    return Math.round((this.reportData.pickups.completed / this.reportData.pickups.total) * 100);
  }

  getAcceptanceRate(): number {
    if (!this.reportData?.applications?.total) return 0;
    return Math.round((this.reportData.applications.accepted / this.reportData.applications.total) * 100);
  }
}