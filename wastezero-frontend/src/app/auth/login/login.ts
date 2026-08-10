import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      this.redirectByRole(role);
    }
  }

  fillDemo(role: string): void {
    if (role === 'user') {
      this.loginForm.patchValue({ email: 'user@zero.com', password: 'password123' });
    } else if (role === 'volunteer') {
      this.loginForm.patchValue({ email: 'volunteer@zero.com', password: 'password123' });
    } else if (role === 'admin') {
      this.loginForm.patchValue({ email: 'admin@zero.com', password: 'password123' });
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        localStorage.setItem('token',     res.token);
        localStorage.setItem('role',      res.role);
        localStorage.setItem('name',      res.name);
        localStorage.setItem('userId',    res._id);
        localStorage.setItem('email',     res.email || '');
        localStorage.setItem('location',  res.location || '');
        localStorage.setItem('skills',    JSON.stringify(res.skills || []));
        localStorage.setItem('interests', JSON.stringify(res.interests || []));

        this.redirectByRole(res.role);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Login failed. Please verify credentials.';
      }
    });
  }

  private redirectByRole(role: string): void {
    if (role === 'user') {
      this.router.navigate(['/dashboard-user']);
    } else if (role === 'volunteer') {
      this.router.navigate(['/dashboard-volunteer']);
    } else if (role === 'admin') {
      this.router.navigate(['/dashboard-admin']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}