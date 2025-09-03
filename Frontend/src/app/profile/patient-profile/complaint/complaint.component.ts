import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Interfaces (assuming these are imported from your types file)
import {
  Doctor,
  Patient,
  Complaint,
  PatientRegister,
} from '../../../utils/models';
import { Gender, Specialisation } from '../../../utils/enums';
import { DialogModule } from 'primeng/dialog';
import { PatStore } from '../../../store/PatientStore';
import { SelectModule } from 'primeng/select';
import { PatService } from '../pat-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { handleError } from '../../../utils/util';
import { Skeleton } from 'primeng/skeleton';
interface ComplaintFormData {
  doctorId: number;
  issue: string;
}

@Component({
  selector: 'app-complaint',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    TextareaModule,
    DropdownModule,
    SelectModule,
    TagModule,
    DividerModule,
    Skeleton,
    ToastModule,
    DialogModule,
  ],
  providers: [MessageService],
  templateUrl: './complaint.component.html',
  styleUrl: './complaint.component.css',
})
export class ComplaintComponent implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private patService = inject(PatService);

  currentView: 'list' | 'form' = 'list';
  complaintForm!: FormGroup;
  isSubmitting = false;
  patStore = inject(PatStore);

  // patient: Patient = {
  //   id: 1,
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   dob: '1990-01-01',
  //   gender: Gender.Male,
  //   height: 175,
  //   weight: 70,
  //   number: '1234567890',
  //   password: 'password',
  // };

  // doctors: Doctor[] = [
  //   {
  //     id: 1,

  //     firstName: 'Sarah',
  //     lastName: 'Johnson',
  //     specialisation: Specialisation.Cardiologist,
  //     password: 'password',
  //     joinDate: '2020-01-01',
  //     gender: Gender.Female,
  //     phoneNumber: '9876543210',
  //   },
  //   {
  //     id: 2,
  //     firstName: 'Michael',
  //     lastName: 'Brown',
  //     specialisation: Specialisation.Dermatologist,
  //     password: 'password',
  //     joinDate: '2018-01-01',
  //     gender: Gender.Male,
  //     phoneNumber: '9876543211',
  //   },
  //   {
  //     id: 3,
  //     firstName: 'Emily',
  //     lastName: 'Davis',
  //     specialisation: Specialisation.Gynaecologist,
  //     password: 'password',
  //     joinDate: '2019-01-01',
  //     gender: Gender.Female,
  //     phoneNumber: '9876543212',
  //   },
  // ];

  // complaints: Complaint[] = [
  //   {
  //     id: 1,
  //     issue:
  //       'The doctor was late for the appointment and seemed unprepared. I waited for over an hour without any explanation.',
  //     isAddressed: true,
  //     patient: this.patient,
  //     doctor: this.doctors[0],
  //     patientRegister: {} as PatientRegister,
  //   },
  //   {
  //     id: 2,
  //     issue:
  //       'I felt the doctor did not listen to my concerns properly and rushed through the consultation without proper examination.',
  //     isAddressed: false,
  //     patient: this.patient,
  //     doctor: this.doctors[1],
  //     patientRegister: {} as PatientRegister,
  //   },
  //   {
  //     id: 3,
  //     issue:
  //       'I felt the doctor did not listen to my concerns properly and rushed through the consultation without proper examination.',
  //     isAddressed: false,
  //     patient: this.patient,
  //     doctor: this.doctors[1],
  //     patientRegister: {} as PatientRegister,
  //   },
  //   {
  //     id: 4,
  //     issue:
  //       'I felt the doctor did not listen to my concerns properly and rushed through the consultation without proper examination.',
  //     isAddressed: false,
  //     patient: this.patient,
  //     doctor: this.doctors[1],
  //     patientRegister: {} as PatientRegister,
  //   },
  //   {
  //     id: 5,
  //     issue:
  //       'I felt the doctor did not listen to my concerns properly and rushed through the consultation without proper examination.',
  //     isAddressed: false,
  //     patient: this.patient,
  //     doctor: this.doctors[1],
  //     patientRegister: {} as PatientRegister,
  //   },
  // ];

  getCompDoctors = computed(() => {
    let st = new Set<Doctor>();
    this.patStore.followups().map((followup) => st.add(followup.doctor));
    return [...st];
  });

  doctorOptions = computed(() =>
    this.patStore.doctors().map((doctor) => ({
      label: `Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.specialisation}`,
      value: doctor.id,
    }))
  );

  dialogVisibility: boolean = false;

  ngOnInit() {
    this.initializeForm();
    this.patStore.loadComplaints();
    this.patStore.loadDoctors();
    // this.setupDoctorOptions();
  }

  private initializeForm() {
    let firstDoctor = this.getCompDoctors()[0] ?? null;
    this.complaintForm = this.fb.group({
      doctorId: [firstDoctor?.id ?? null, [Validators.required]],
      issue: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  // private setupDoctorOptions() {
  //   this.doctorOptions = this.doctors.map((doctor) => ({
  //     label: `Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.specialisation}`,
  //     value: doctor.id,
  //   }));
  // }

  switchToForm() {
    this.currentView = 'form';
    let firstDoctor = this.getCompDoctors()[0] ?? null;
    this.complaintForm.reset();
    this.complaintForm.patchValue({
      doctorId: firstDoctor?.id ?? null,
    });
  }

  switchToList() {
    this.currentView = 'list';
  }

  getDoctorName(doctorId: number): string {
    const doctor = this.getCompDoctors().find((d) => d.id === doctorId);
    return doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown';
  }

  formatDate(id: number): string {
    const date = new Date();
    date.setDate(date.getDate() - id);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  trackByComplaintId(index: number, complaint: Complaint): number {
    return complaint.id;
  }

  async onSubmit() {
    if (this.complaintForm.valid) {
      this.isSubmitting = true;

      const formData: ComplaintFormData = this.complaintForm.value;

      const newComplaint: Omit<Complaint, 'id'> = {
        issue: formData.issue,
        addressed: false,
        patient: this.patStore.pat()!,
        doctor: this.getCompDoctors().find((d) => d.id === formData.doctorId)!,
        patientRegister: this.patStore.patientRegister()!,
      };

      this.patService
        .postComplaint(this.patStore.id()!, newComplaint)
        .subscribe({
          next: (res) => {
            this.isSubmitting = false;
            console.log(res);
            this.patStore.loadComplaints();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Your complaint has been registered successfully!',
            });
            this.switchToList();
          },
          error: (err: HttpErrorResponse) => {
            handleError(err, this.messageService);
          },
        });
    } else {
      Object.keys(this.complaintForm.controls).forEach((key) => {
        this.complaintForm.get(key)?.markAsTouched();
      });
    }
  }

  showDialog() {
    this.dialogVisibility = true;
  }
}
