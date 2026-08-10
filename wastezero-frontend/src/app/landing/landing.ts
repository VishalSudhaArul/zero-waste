import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface VideoClip {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  src: string;
  duration: string;
  icon: string;
  tag: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.html',
})
export class Landing {
  @ViewChild('mainVideoPlayer') mainVideoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('modalVideoPlayer') modalVideoPlayer!: ElementRef<HTMLVideoElement>;

  activeClipIndex = 0;
  isMuted = true;
  isPlaying = true;
  showVideoModal = false;
  selectedModalClipIndex = 0;

  clips: VideoClip[] = [
    {
      id: 0,
      title: 'Full Platform Showcase (Merged)',
      subtitle: 'Complete 60-Second WasteZero Journey',
      desc: 'Seamlessly merged showcase highlighting request, dispatch, sorting, recycling, impact analytics, and sustainable community growth.',
      src: '/assets/videos/zerowaste_showcase_full.mp4',
      duration: '01:00',
      icon: '🎬',
      tag: 'Full 60s Movie'
    },
    {
      id: 1,
      title: 'Clip 1: Smart Eco Request',
      subtitle: 'Citizen Pickup Scheduling',
      desc: 'Users quickly log location, waste categories, and preferred pickup windows with high accuracy.',
      src: '/assets/videos/zerowaste clip1.mp4',
      duration: '00:10',
      icon: '📱',
      tag: 'Step 1'
    },
    {
      id: 2,
      title: 'Clip 2: Volunteer Dispatch',
      subtitle: 'Real-time Route & Driver Matching',
      desc: 'Local pickup agents receive instant geolocation alerts to accept and route nearby pickups.',
      src: '/assets/videos/zerowaste clip2.mp4',
      duration: '00:10',
      icon: '🚛',
      tag: 'Step 2'
    },
    {
      id: 3,
      title: 'Clip 3: Waste Segregation',
      subtitle: 'Eco Sorting & Safe Handling',
      desc: 'Plastic, organic, e-waste, and recyclable glass are separated according to environmental standards.',
      src: '/assets/videos/zerowaste clip3.mp4',
      duration: '00:10',
      icon: '♻️',
      tag: 'Step 3'
    },
    {
      id: 4,
      title: 'Clip 4: Green Recycling Hub',
      subtitle: 'Circular Economy Processing',
      desc: 'Collected materials are delivered to certified facilities for zero-landfill reprocessing.',
      src: '/assets/videos/zerowaste clip4.mp4',
      duration: '00:10',
      icon: '🏭',
      tag: 'Step 4'
    },
    {
      id: 5,
      title: 'Clip 5: Impact Analytics',
      subtitle: 'Live Carbon & Waste Telemetry',
      desc: 'Gamified dashboards measure landfill reduction, carbon footprint savings, and user scores.',
      src: '/assets/videos/zerowaste clip5.mp4',
      duration: '00:10',
      icon: '📊',
      tag: 'Step 5'
    },
    {
      id: 6,
      title: 'Clip 6: Sustainable Community',
      subtitle: 'Green Neighborhood Rewards',
      desc: 'Empowering communities to collaborate, earn eco-badges, and create cleaner living environments.',
      src: '/assets/videos/zerowaste clip6.mp4',
      duration: '00:10',
      icon: '🌱',
      tag: 'Step 6'
    }
  ];

  get currentClip(): VideoClip {
    return this.clips[this.activeClipIndex] || this.clips[0];
  }

  get currentModalClip(): VideoClip {
    return this.clips[this.selectedModalClipIndex] || this.clips[0];
  }

  selectClip(index: number): void {
    this.activeClipIndex = index;
    if (this.mainVideoPlayer && this.mainVideoPlayer.nativeElement) {
      const video = this.mainVideoPlayer.nativeElement;
      video.src = this.currentClip.src;
      video.load();
      video.play().catch(() => {});
      this.isPlaying = true;
    }
  }

  togglePlayPause(): void {
    if (!this.mainVideoPlayer) return;
    const video = this.mainVideoPlayer.nativeElement;
    if (video.paused) {
      video.play().catch(() => {});
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  toggleMute(): void {
    if (!this.mainVideoPlayer) return;
    const video = this.mainVideoPlayer.nativeElement;
    video.muted = !video.muted;
    this.isMuted = video.muted;
  }

  openVideoModal(index: number = 0): void {
    this.selectedModalClipIndex = index;
    this.showVideoModal = true;
    setTimeout(() => {
      if (this.modalVideoPlayer && this.modalVideoPlayer.nativeElement) {
        const video = this.modalVideoPlayer.nativeElement;
        video.src = this.currentModalClip.src;
        video.load();
        video.play().catch(() => {});
      }
    }, 100);
  }

  closeVideoModal(): void {
    this.showVideoModal = false;
    if (this.modalVideoPlayer && this.modalVideoPlayer.nativeElement) {
      this.modalVideoPlayer.nativeElement.pause();
    }
  }

  switchModalClip(index: number): void {
    this.selectedModalClipIndex = index;
    if (this.modalVideoPlayer && this.modalVideoPlayer.nativeElement) {
      const video = this.modalVideoPlayer.nativeElement;
      video.src = this.currentModalClip.src;
      video.load();
      video.play().catch(() => {});
    }
  }

  onVideoEnded(): void {
    // Auto-advance to next clip if in individual clip mode
    if (this.activeClipIndex > 0 && this.activeClipIndex < this.clips.length - 1) {
      this.selectClip(this.activeClipIndex + 1);
    } else if (this.activeClipIndex === this.clips.length - 1) {
      this.selectClip(0); // loop back to full video
    }
  }
}