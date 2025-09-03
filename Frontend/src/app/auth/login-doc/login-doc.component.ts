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
  selector: 'app-login-doc',
  imports: [
    ButtonModule,
    IconFieldModule,
    CheckboxModule,
    InputIconModule,
    FluidModule,
    PasswordModule,
    FormsModule,
    InputTextModule,
    ToastModule,
    MessageModule,
    RouterLink,
  ],
  templateUrl: './login-doc.component.html',
  providers: [MessageService],
})
export class LoginDocComponent {
  @ViewChild('docForm') docForm!: NgForm;

  constructor(
    private messageService: MessageService,
    private docService: AuthService,
    private router: Router
  ) {}

  doctor: LoginRequest = {
    email: '',
    password: '',
    userType: UserType.doctor,
  };

  formSubmitted = signal<boolean>(false);

  onSubmit() {
    if (this.docForm.valid) {
      this.docService.login(this.doctor).subscribe({
        next: (res) => {
          console.log('Success: ', res);
          localStorage.setItem('token', res.token);
          this.messageService.add({
            severity: 'success',
            summary: 'Login Details',
            detail: `email: ${this.doctor.email}, pass: ${this.doctor.password}`,
            life: 3000,
          });
          this.router.navigate(['/profile-doc']);
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
