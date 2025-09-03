import { Component, signal, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { CheckboxModule } from 'primeng/checkbox';
import { InputIconModule } from 'primeng/inputicon';
import { FluidModule } from 'primeng/fluid';
import { FormsModule, NgForm } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../../utils/authTypes';
import { UserType } from '../../utils/enums';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-pat',
  imports: [
    ButtonModule,
    IconFieldModule,
    CheckboxModule,
    InputIconModule,
    FluidModule,
    FormsModule,
    PasswordModule,
    InputTextModule,
    ToastModule,
    MessageModule,
    RouterLink,
    InputIconModule,
    RouterLink,
  ],
  templateUrl: './login-pat.component.html',
  styleUrl: './login-pat.component.css',
  providers: [MessageService, AuthService],
})
export class LoginPatComponent {
  @ViewChild('patForm') patForm!: NgForm;
  constructor(
    private messageService: MessageService,
    private patService: AuthService,
    private router: Router
  ) {}
  patient: LoginRequest = {
    email: '',
    password: '',
    userType: UserType.patient,
  };

  formSubmitted = signal<boolean>(false);

  onSubmit() {
    if (this.patForm.valid) {
      this.patService.login(this.patient).subscribe({
        next: (res) => {
          console.log('Success: ', res);
          localStorage.setItem('token', res.token);
          this.messageService.add({
            severity: 'success',
            summary: 'Login Details',
            detail: `email: ${this.patient.email}, pass: ${this.patient.password}`,
            life: 3000,
          });
          this.router.navigate(['/profile-pat']);
        },
        error: (err) => {
          console.error('Failed', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Failed!',
            detail: `Please verify your login details!`,
            life: 3000,
          });
        },
      });
    } else {
      this.formSubmitted.set(true);
    }
  }
}
