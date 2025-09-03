import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => {
      return import('./home/home.component').then((m) => m.HomeComponent);
    },
  },
  {
    path: 'login/doctor',
    loadComponent: () =>
      import('./auth/login-doc/login-doc.component').then(
        (m) => m.LoginDocComponent
      ),
  },
  {
    path: 'login/patient',
    loadComponent: () =>
      import('./auth/login-pat/login-pat.component').then(
        (m) => m.LoginPatComponent
      ),
  },
  {
    path: 'register-doctor',
    loadComponent: () =>
      import('./auth/register-doc/register-doc.component').then(
        (m) => m.RegisterDocComponent
      ),
  },
  {
    path: 'register-patient',
    loadComponent: () =>
      import('./auth/register-pat/register-pat.component').then(
        (m) => m.RegisterPatComponent
      ),
  },

  {
    path: 'profile-doc',
    loadComponent: () =>
      import('./profile/doctor-profile/doctor-profile.component').then(
        (m) => m.DoctorProfileComponent
      ),
  },

  {
    path: 'profile-pat',
    loadComponent: () =>
      import('./profile/patient-profile/patient-profile.component').then(
        (m) => m.PatientProfileComponent
      ),
  },
];
