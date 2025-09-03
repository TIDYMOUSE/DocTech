import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { Textarea } from 'primeng/textarea';
import { Toast } from 'primeng/toast';
import { Checkbox } from 'primeng/checkbox';
import { BloodGroup, Gender } from '../../utils/enums';
import { PatientRegisterRequest } from '../../utils/authTypes';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { parseErrorResponse } from '../../utils/util';

interface SelectOptions {
  label: string;
  value: string;
}

@Component({
  selector: 'app-register-pat',
  imports: [
    FormsModule,
    Textarea,
    Toast,
    FloatLabelModule,
    CommonModule,
    Checkbox,
    MessageModule,
    InputGroupAddonModule,
    InputIconModule,
    InputGroupModule,
    IconFieldModule,
    InputTextModule,
    PasswordModule,
    Button,
    SelectModule,
    DatePickerModule,
    FileUploadModule,
    InputMaskModule,
  ],
  templateUrl: './register-pat.component.html',
  styleUrl: './register-pat.component.css',
  providers: [MessageService],
})
export class RegisterPatComponent {
  genderOptions: SelectOptions[];
  bloodGroupOptions: SelectOptions[];
  agreedToTerms = signal<boolean>(false);
  dobWrapper: Date;
  constructor(
    private messageService: MessageService,
    private router: Router,
    private patService: AuthService
  ) {
    this.genderOptions = Object.values(Gender).map((g) => ({
      label: g,
      value: g,
    }));
    this.bloodGroupOptions = Object.values(BloodGroup).map((s) => ({
      label: s,
      value: s,
    }));
    this.dobWrapper = new Date();
  }

  formSubmitted = signal<boolean>(false);

  PatientRegister: PatientRegisterRequest = {
    email: '',
    aadhar: '',
    bloodGroup: BloodGroup.AB_POSITIVE,
    height: 0,
    weight: 0,
    firstName: '',
    gender: Gender.Male,
    dob: this.formatDateToYMD(new Date()),
    lastName: '',
    password: '',
    number: '',
  };

  formatDateToYMD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onDateChange(value: Date) {
    this.dobWrapper = value;
    this.PatientRegister.dob = this.formatDateToYMD(value);
  }

  private toBackendBloodGroup(uiValue: string): string {
    const map: Record<string, string> = {
      'A+': 'A_POSITIVE',
      'A-': 'A_NEGATIVE',
      'B+': 'B_POSITIVE',
      'B-': 'B_NEGATIVE',
      'AB+': 'AB_POSITIVE',
      'AB-': 'AB_NEGATIVE',
      'O+': 'O_POSITIVE',
      'O-': 'O_NEGATIVE',
    };
    return map[uiValue] || uiValue;
  }

  onSubmit(pat: NgForm) {
    this.formSubmitted.set(true);
    if (!this.agreedToTerms) {
      this.messageService.add({
        severity: 'error',
        summary: 'Terms Required',
        detail: 'Please accept terms and conditions',
        life: 3000,
      });
      return;
    }
    if (pat.invalid) return;
    this.PatientRegister = {
      ...this.PatientRegister,
      bloodGroup: this.toBackendBloodGroup(this.PatientRegister.bloodGroup),
    };
    console.log(this.PatientRegister);
    this.patService.registerPatient(this.PatientRegister).subscribe({
      next: (res) => {
        console.log('Success here is your token: ', res);
        this.messageService.add({
          summary: 'Success!',
          life: 3000,
          severity: 'success',
          detail: 'Registration Successful',
        });
        localStorage.setItem('token', res);
        this.router.navigate(['/profile-pat']);
      },
      error: (err: HttpErrorResponse) => {
        const parsedError = parseErrorResponse(err.error);

        const errorSummary = parsedError?.error ?? 'Failed!';
        const errorMessage =
          parsedError?.message ??
          'Oops! Something went wrong. Please try again';

        this.messageService.add({
          summary: errorSummary,
          life: 3000,
          severity: 'error',
          detail: errorMessage,
        });

        console.error('Registration failed:', err);
      },
    });
  }
}
