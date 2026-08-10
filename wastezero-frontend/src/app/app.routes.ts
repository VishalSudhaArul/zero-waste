import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard, volunteerGuard, userGuard } from './guards/role-guard';

export const routes: Routes = [

  // PUBLIC
  {
    path: '',
    loadComponent: () => import('./landing/landing').then(m => m.Landing)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then(m => m.Register)
  },

  // USER ROUTES
  {
    path: 'dashboard-user',
    loadComponent: () => import('./dashboards/user-dashboard/user-dashboard').then(m => m.UserDashboard),
    canActivate: [authGuard, userGuard]
  },
  {
    path: 'schedule-pickup',
    loadComponent: () => import('./user/schedule-pickup/schedule-pickup').then(m => m.SchedulePickup),
    canActivate: [authGuard, userGuard]
  },

  // VOLUNTEER ROUTES
  {
    path: 'dashboard-volunteer',
    loadComponent: () => import('./dashboards/volunteer-dashboard/volunteer-dashboard').then(m => m.VolunteerDashboard),
    canActivate: [authGuard, volunteerGuard]
  },
  {
    path: 'opportunities',
    loadComponent: () => import('./volunteer/opportunities/opportunities').then(m => m.Opportunities),
    canActivate: [authGuard, volunteerGuard]
  },

  // ADMIN ROUTES
  {
    path: 'dashboard-admin',
    loadComponent: () => import('./dashboards/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-panel/admin-panel').then(m => m.AdminPanel),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/applications',
    loadComponent: () => import('./admin/applications/applications').then(m => m.Applications),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./admin/user-management/user-management').then(m => m.UserManagement),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/reports',
    loadComponent: () => import('./admin/reports/reports').then(m => m.Reports),
    canActivate: [authGuard, adminGuard]
  },

  // COMMON ROUTES
  {
    path: 'messages',
    loadComponent: () => import('./messages/messages').then(m => m.Messages),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile').then(m => m.Profile),
    canActivate: [authGuard]
  },

  // FALLBACK
  { path: '**', redirectTo: 'login' }
];