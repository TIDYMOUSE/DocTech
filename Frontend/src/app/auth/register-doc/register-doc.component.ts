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
import { ToastModule } from 'primeng/toast';
import { DoctorRegisterRequest } from '../../utils/authTypes';
import { Gender, Specialisation } from '../../utils/enums';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

interface SelectOptions {
  label: string;
  value: string;
}
@Component({
  selector: 'app-register-doc',
  imports: [
    FormsModule,
    FloatLabelModule,
    CommonModule,
    ToastModule,
    MessageModule,
    ToastModule,
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
  templateUrl: './register-doc.component.html',
  styleUrl: './register-doc.component.css',
  providers: [MessageService],
})
export class RegisterDocComponent {
  genderOptions: SelectOptions[];
  specialisationOptions: SelectOptions[];
  joinDateWrapper: Date | null;
  retirementDateWrapper: Date | null = null;
  constructor(
    private messageService: MessageService,
    private docService: AuthService,
    private router: Router
  ) {
    this.genderOptions = Object.values(Gender).map((g) => ({
      label: g,
      value: g,
    }));
    this.specialisationOptions = Object.values(Specialisation).map((s) => ({
      label: s,
      value: s,
    }));
    this.joinDateWrapper = new Date();
  }
  formSubmitted = signal<boolean>(false);
  DoctorRegister: DoctorRegisterRequest = {
    email: '',
    firstName: '',
    gender: Gender.Female,
    joinDate: '',
    lastName: '',
    password: '',
    phoneNumber: '',
    licenseNumber: '89',
    specialisation: Specialisation.Cardiologist,
  };

  imagePreview: string | null = null;

  uploadImage(event: any) {
    const file: File = event.files[0];
    if (file) {
      // Optional size check (5MB limit)
      if (file.size > 5000000) {
        console.error('File too large');
        return;
      }

      // File type validation
      if (!file.type.startsWith('image/')) {
        console.error('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;

        // Strip the data URL prefix
        const strippedBase64 = base64String.split(',')[1];

        this.DoctorRegister.image = strippedBase64;
        this.imagePreview = base64String;
      };
      reader.onerror = () => {
        console.error('Error reading file');
      };

      reader.readAsDataURL(file); // triggers reader.result as data URL
    }
  }

  formatDateToYMD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onDateChange(value: Date | null, type: 's' | 'r') {
    if (type === 's') {
      this.joinDateWrapper = value;
      this.DoctorRegister.joinDate = value ? this.formatDateToYMD(value) : '';
    } else {
      this.retirementDateWrapper = value;
      this.DoctorRegister.retirementDate = value
        ? this.formatDateToYMD(value)
        : '';
    }
  }

  onSubmit(doc: NgForm) {
    this.formSubmitted.set(true);
    if (doc.invalid) return;

    console.log(this.DoctorRegister);
    this.docService.registerDoctor(this.DoctorRegister).subscribe({
      next: (res) => {
        console.log('Success here is your token: ', res);
        this.messageService.add({
          summary: 'Success!',
          life: 3000,
          severity: 'success',
          detail: 'Registration Successful',
        });
        localStorage.setItem('token', res);
        this.router.navigate(['/profile-doc']);
      },
      error: (res) => {
        this.messageService.add({
          summary: 'Failed!',
          life: 3000,
          severity: 'error',
          detail: 'Oops! Something went wrong. Please try again',
        });
        console.error('Failed here', res);
      },
    });
  }
}
