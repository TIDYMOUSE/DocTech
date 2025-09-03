import { Component, input, inject, OnInit, signal } from '@angular/core';
import {
  Complaint,
  Doctor,
  Followup,
  Patient,
  PatientRegister,
} from '../../../utils/models';
import { FollowupStatus } from '../../../utils/helper';
import { CommonModule } from '@angular/common';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { DoctorStore } from '../../../store/DoctorStore';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-wardlist',
  imports: [DataView, ButtonModule, Tag, CommonModule, Skeleton],
  templateUrl: './wardlist.component.html',
  styleUrl: './wardlist.component.css',
})
export class WardlistComponent implements OnInit {
  readonly docStore = inject(DoctorStore);

  async ngOnInit() {
    this.docStore.loadWards();
    this.docStore.loadComplaints();
    this.docStore.loadReports();
    this.docStore.loadFollowups();
  }

  getPatientFullName(patient: Patient): string {
    const parts = [patient.firstName];
    if (patient.middleName) {
      parts.push(patient.middleName);
    }
    parts.push(patient.lastName);
    return parts.join(' ');
  }

  getPatientInitials(patient: Patient): string {
    const firstInitial = patient.firstName.charAt(0);
    const lastInitial = patient.lastName.charAt(0);
    return `${firstInitial}${lastInitial}`;
  }

  getDoctorInitials(doctor: Doctor): string {
    const firstInitial = doctor.firstName.charAt(0);
    const lastInitial = doctor.lastName.charAt(0);
    return `${firstInitial}${lastInitial}`;
  }

  calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  formatDate(dateString?: string): string {
    if (!dateString || dateString == 'N/A') return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getPendingFollowupsCount(register: PatientRegister): number {
    return (
      this.docStore
        .followups()
        .filter((f) => f.status === FollowupStatus.Pending).length || 0
    );
  }

  getUnaddressedComplaintsCount(register: PatientRegister): number {
    return this.docStore.complaints().filter((c) => !c.addressed).length || 0;
  }

  // Action Methods
  viewReportsAndRemarks(register: PatientRegister): void {
    console.log('View reports and remarks for:', register.patient?.firstName);
    // Implement navigation to reports and remarks view
  }

  manageFollowups(register: PatientRegister): void {
    console.log('Manage follow-ups for:', register.patient?.firstName);
    // Implement navigation to follow-ups management
  }

  viewComplaints(register: PatientRegister): void {
    console.log('View complaints for:', register.patient?.firstName);
    // Implement navigation to complaints view
  }

  viewPatientDetails(register: PatientRegister): void {
    console.log('View details for:', register.patient?.firstName);
    // Implement navigation to patient details view
  }

  editPatientRegister(register: PatientRegister): void {
    console.log('Edit patient register:', register.id);
    // Implement edit functionality
  }

  getLastReportDate(register: PatientRegister): string {
    if (!this.docStore.reports() || this.docStore.reports().length === 0) {
      return 'N/A';
    }

    const latest = this.docStore.reports().reduce((latest, report) => {
      if (!report.date) return latest;
      const latestDate = latest.date ? new Date(latest.date) : new Date(0);
      const currentDate = new Date(report.date);
      return currentDate > latestDate ? report : latest;
    });

    return latest.date ? this.formatDate(latest.date) : 'N/A';
  }

  getLastFollowupDate(register: PatientRegister): string {
    if (!this.docStore.followups() || this.docStore.followups().length === 0) {
      return 'N/A';
    }

    const latest = this.docStore.followups().reduce((latest, followup) => {
      const latestDate = new Date(latest.followupDate);
      const currentDate = new Date(followup.followupDate);
      return currentDate > latestDate ? followup : latest;
    });

    return this.formatDate(latest.followupDate);
  }
}
