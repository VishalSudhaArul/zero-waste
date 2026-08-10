import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  profileForm!: FormGroup;
  isLoading = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  role  = localStorage.getItem('role')  || '';
  name  = localStorage.getItem('name')  || '';
  email = localStorage.getItem('email') || '';

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name:      ['', Validators.required],
      email:     [{ value: '', disabled: true }],
      location:  [''],
      phone:     [''],
      bio:       [''],
      skills:    [''],
      interests: ['']
    });

    this.loadProfile();
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  loadProfile() {
    this.isLoading = true;
    this.http.get<any>(`${this.apiUrl}/profile`, this.getHeaders()).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.profileForm.patchValue({
          name:      user.name      || '',
          email:     user.email     || '',
          location:  user.location  || '',
          phone:     user.phone     || '',
          bio:       user.bio       || '',
          skills:    user.skills?.join(', ')    || '',
          interests: user.interests?.join(', ') || ''
        });
        this.name  = user.name;
        this.email = user.email;
        this.role  = user.role;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load profile.';
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formVal = this.profileForm.getRawValue();

    const payload = {
      name:      formVal.name,
      location:  formVal.location,
      phone:     formVal.phone,
      bio:       formVal.bio,
      skills:    formVal.skills
        ? formVal.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [],
      interests: formVal.interests
        ? formVal.interests.split(',').map((s: string) => s.trim()).filter(Boolean)
        : []
    };

    this.http.put<any>(`${this.apiUrl}/profile`, payload, this.getHeaders()).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.successMessage = 'Profile updated successfully!';
        localStorage.setItem('name',      res.user.name);
        localStorage.setItem('location',  res.user.location  || '');
        localStorage.setItem('skills',    JSON.stringify(res.user.skills    || []));
        localStorage.setItem('interests', JSON.stringify(res.user.interests || []));
        this.name = res.user.name;
        this.cdr.detectChanges();
        setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err?.error?.message || 'Failed to update profile.';
        this.cdr.detectChanges();
      }
    });
  }

  getRoleLabel(): string {
    if (this.role === 'admin')     return 'Administrator';
    if (this.role === 'volunteer') return 'Pickup Agent';
    return 'Citizen';
  }

  getRoleBadgeClass(): string {
    if (this.role === 'admin')     return 'bg-yellow-900/30 text-yellow-400 border-yellow-900/40';
    if (this.role === 'volunteer') return 'bg-teal-900/30 text-teal-400 border-teal-900/40';
    return 'bg-green-900/30 text-green-400 border-green-900/40';
  }

  getInitial(): string {
    return this.name?.charAt(0).toUpperCase() || '?';
  }
}