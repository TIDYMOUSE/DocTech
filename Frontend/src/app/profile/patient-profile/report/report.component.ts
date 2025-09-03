import {
  Component,
  type OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ChipModule } from 'primeng/chip';
import { PanelModule } from 'primeng/panel';

import type {
  Doctor,
  Patient,
  Report,
  PatientRegister,
  Followup,
} from '../../../utils/models';
import { Gender, Specialisation, BloodGroup } from '../../../utils/enums';
import { FollowupStatus } from '../../../utils/helper';
import { PatStore } from '../../../store/PatientStore';

@Component({
  selector: 'app-report',
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    DividerModule,
    ToastModule,
    ChipModule,
    PanelModule,
  ],
  providers: [MessageService],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent {
  private messageService = inject(MessageService);

  currentView: 'list' | 'detail' = 'list';
  selectedReport = signal<Report | null>(null);
  patStore = inject(PatStore);

  getRepDoctors = computed(() =>
    this.patStore.reports().map((report) => report.doctor)
  );

  getFollowup = computed(() => {
    return this.patStore
      .followups()
      .find((f) => f.id === this.selectedReport()?.id);
  });

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

  // patientRegisters: PatientRegister[] = [
  //   {
  //     id: 1,
  //     roomNo: 'R101',
  //     isAdmitted: true,
  //     admissionDate: '2024-01-15',
  //     dischargeDate: '2024-01-20',
  //     doctor: this.doctors[0],
  //     patient: this.patient,
  //     bedNumber: 'B1',
  //   },
  //   {
  //     id: 2,
  //     roomNo: 'R205',
  //     isAdmitted: true,
  //     admissionDate: '2024-02-10',
  //     dischargeDate: '2024-02-15',
  //     doctor: this.doctors[1],
  //     patient: this.patient,
  //     bedNumber: 'B5',
  //   },
  // ];

  // followups: Followup[] = [
  //   {
  //     id: 1,
  //     followupDate: '2024-02-01',
  //     patient: this.patient,
  //     doctor: this.doctors[0],
  //     register: this.patientRegisters[0],
  //     status: FollowupStatus.Acheived,
  //   },
  //   {
  //     id: 2,
  //     followupDate: '2024-03-01',
  //     patient: this.patient,
  //     doctor: this.doctors[1],
  //     register: this.patientRegisters[1],
  //     status: FollowupStatus.Pending,
  //   },
  // ];

  // reports: Report[] = [
  //   {
  //     id: 1,
  //     diagnosis: 'Hypertension Stage 1',
  //     tests:
  //       'Blood Pressure Monitoring, ECG, Blood Tests (Lipid Profile, Complete Blood Count)',
  //     medication: 'Lisinopril 10mg once daily, Amlodipine 5mg once daily',
  //     followupRequired: true,
  //     remarks:
  //       'Patient shows elevated blood pressure readings. Lifestyle modifications recommended along with medication. Monitor blood pressure daily. adhdkf akfhdkfahdsf alkhdfldfhadfhdas alfkhdaklfhaldfhad fadfhlkadfhalkdfhadf akhdflkadfh aldfadfhl ad flahdflkadhfklehfal alkdhfakldhfleakhflkhf adkhfaldhfalhfddlhf adhfladhfldafhadlf klahdflkahdflhlaefhlfhalefhfhleh a hflaeheahfklhfafhekfdklfhelkfhalehfelkfhelkfha aheflkaehfleahflaehflefhelhfelfhelakfeh aklehflaekhflekfhealhfeal',
  //     date: '2024-01-20',
  //     patient: this.patient,
  //     doctor: this.doctors[0],
  //     register: this.patientRegisters[0],
  //     followup: this.followups[0],
  //   },
  //   {
  //     id: 2,
  //     diagnosis: 'Atopic Dermatitis',
  //     tests: 'Skin Patch Test, IgE Levels, Complete Blood Count',
  //     medication:
  //       'Topical Corticosteroids (Hydrocortisone 1%), Moisturizers, Antihistamines (Cetirizine 10mg)',
  //     followupRequired: true,
  //     remarks:
  //       'Chronic skin condition with flare-ups. Avoid known allergens and maintain proper skin care routine.',
  //     date: '2024-02-15',
  //     patient: this.patient,
  //     doctor: this.doctors[1],
  //     register: this.patientRegisters[1],
  //     followup: this.followups[1],
  //   },
  //   {
  //     id: 3,
  //     diagnosis: 'Annual Health Checkup - Normal',
  //     tests:
  //       'Complete Blood Count, Lipid Profile, Liver Function Tests, Kidney Function Tests, Chest X-Ray',
  //     medication: 'Multivitamin supplements, Vitamin D3 1000 IU daily',
  //     followupRequired: false,
  //     remarks:
  //       'All test results within normal limits. Continue healthy lifestyle and regular exercise.',
  //     date: '2024-03-10',
  //     patient: this.patient,
  //     doctor: this.doctors[2],
  //     register: this.patientRegisters[0],
  //   },
  //   {
  //     id: 4,
  //     diagnosis: 'Hypertension Stage 1',
  //     tests:
  //       'Blood Pressure Monitoring, ECG, Blood Tests (Lipid Profile, Complete Blood Count)',
  //     medication: 'Lisinopril 10mg once daily, Amlodipine 5mg once daily',
  //     followupRequired: true,
  //     remarks:
  //       'Patient shows elevated blood pressure readings. Lifestyle modifications recommended along with medication. Monitor blood pressure daily.',
  //     date: '2024-01-20',
  //     patient: this.patient,
  //     doctor: this.doctors[0],
  //     register: this.patientRegisters[0],
  //     followup: this.followups[0],
  //   },
  //   {
  //     id: 5,
  //     diagnosis: 'Hypertension Stage 1',
  //     tests:
  //       'Blood Pressure Monitoring, ECG, Blood Tests (Lipid Profile, Complete Blood Count)',
  //     medication: 'Lisinopril 10mg once daily, Amlodipine 5mg once daily',
  //     followupRequired: true,
  //     remarks:
  //       'Patient shows elevated blood pressure readings. Lifestyle modifications recommended along with medication. Monitor blood pressure daily.',
  //     date: '2024-01-20',
  //     patient: this.patient,
  //     doctor: this.doctors[0],
  //     register: this.patientRegisters[0],
  //     followup: this.followups[0],
  //   },
  //   {
  //     id: 6,
  //     diagnosis: 'Hypertension Stage 1',
  //     tests:
  //       'Blood Pressure Monitoring, ECG, Blood Tests (Lipid Profile, Complete Blood Count)',
  //     medication: 'Lisinopril 10mg once daily, Amlodipine 5mg once daily',
  //     followupRequired: true,
  //     remarks:
  //       'Patient shows elevated blood pressure readings. Lifestyle modifications recommended along with medication. Monitor blood pressure daily.',
  //     date: '2024-01-20',
  //     patient: this.patient,
  //     doctor: this.doctors[0],
  //     register: this.patientRegisters[0],
  //     followup: this.followups[0],
  //   },
  // ];

  async ngOnInit() {
    // Initialize component
    this.patStore.loadReports();
    this.patStore.loadDoctors();
    this.patStore.loadFollowups();
  }

  calculateAge(dob: string) {
    return new Date().getFullYear() - new Date(dob).getFullYear();
  }

  switchToList() {
    this.currentView = 'list';
    this.selectedReport.set(null);
  }

  inspectReport(report: Report) {
    this.selectedReport.set(report);
    this.currentView = 'detail';
  }

  getDoctorName(doctorId: number): string {
    const doctor = this.getRepDoctors().find((d) => d.id === doctorId);
    return doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  trackByReportId(index: number, report: Report): number {
    return report.id;
  }

  shareReport() {
    if (this.selectedReport()) {
      // TODO: Implement share functionality
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Report shared successfully!',
      });
    }
  }

  downloadReport() {
    if (this.selectedReport()) {
      // TODO: Implement download functionality
      this.messageService.add({
        severity: 'info',
        summary: 'Download',
        detail: 'Report download started...',
      });
    }
  }

  printReport() {
    if (this.selectedReport()) {
      window.print();
    }
  }

  getBloodGroup() {
    let bg = this.selectedReport()?.patient.bloodGroup;
    if (bg) return BloodGroup[bg.toString() as keyof typeof BloodGroup];
    return 'Not Specified';
  }
}
