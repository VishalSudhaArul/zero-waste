import { Component, OnInit, OnDestroy, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {

  role: string | null = null;
  userName: string | null = null;
  notifications: any[] = [];
  unreadCount = 0;
  showNotifications = false;

  // Video Tour Modal State
  showVideoModal = false;
  activeVideoIndex = 0;

  videos = [
    { id: 0, title: 'Full Platform Showcase (Merged 60s)', tag: 'Full Showcase', src: '/assets/videos/zerowaste_showcase_full.mp4', icon: '🎬' },
    { id: 1, title: 'Clip 1: Smart Eco Pickup Request', tag: 'Eco Request', src: '/assets/videos/zerowaste clip1.mp4', icon: '📱' },
    { id: 2, title: 'Clip 2: Volunteer Dispatch & Route', tag: 'Dispatch', src: '/assets/videos/zerowaste clip2.mp4', icon: '🚛' },
    { id: 3, title: 'Clip 3: Waste Segregation & Sorting', tag: 'Segregation', src: '/assets/videos/zerowaste clip3.mp4', icon: '♻️' },
    { id: 4, title: 'Clip 4: Green Recycling Hub Facility', tag: 'Recycling', src: '/assets/videos/zerowaste clip4.mp4', icon: '🏭' },
    { id: 5, title: 'Clip 5: Impact Analytics Dashboard', tag: 'Analytics', src: '/assets/videos/zerowaste clip5.mp4', icon: '📊' },
    { id: 6, title: 'Clip 6: Sustainable Community Rewards', tag: 'Community', src: '/assets/videos/zerowaste clip6.mp4', icon: '🌱' },
  ];

  private notifSub!: Subscription;

  constructor(
    private notificationService: NotificationService,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.role     = localStorage.getItem('role');
    this.userName = localStorage.getItem('name');
    this.loadNotifications();
    this.loadUnreadCount();

    this.notifSub = this.notificationService.notification$.subscribe((notif: any) => {
      this.notifications.unshift(notif);
      this.unreadCount++;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.notifSub?.unsubscribe();
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (res: any) => {
        this.notifications = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadUnreadCount() {
    this.notificationService.getUnreadCount().subscribe({
      next: (res: any) => {
        this.unreadCount = res.count;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
    this.cdr.detectChanges();
  }

  markAllRead(): void {
    this.notificationService.markAllRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
        this.unreadCount = 0;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  markOneRead(id: string): void {
    this.notificationService.markOneRead(id).subscribe({
      next: () => {
        const notif = this.notifications.find(n => n._id === id);
        if (notif && !notif.isRead) {
          notif.isRead = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  openVideoModal(index: number = 0): void {
    this.activeVideoIndex = index;
    this.showVideoModal = true;
    this.cdr.detectChanges();
  }

  closeVideoModal(): void {
    this.showVideoModal = false;
    this.cdr.detectChanges();
  }

  switchVideo(index: number): void {
    this.activeVideoIndex = index;
    this.cdr.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showNotifications = false;
      this.cdr.detectChanges();
    }
  }

  getRoleColor(): string {
    if (this.role === 'admin')     return 'bg-[#fbbf24] shadow-[0_0_8px_#fbbf24]';
    if (this.role === 'volunteer') return 'bg-[#2dd4bf] shadow-[0_0_8px_#2dd4bf]';
    return 'bg-[#34d399] shadow-[0_0_8px_#34d399]';
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }
}