import { Component, computed, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { PanelModule } from 'primeng/panel';
import { PatientRegister, Doctor, Patient } from '../../../utils/models';
import { PatStore } from '../../../store/PatientStore';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-ward-view',
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    AvatarModule,
    DividerModule,
    Skeleton,
    ChipModule,
    PanelModule,
  ],
  templateUrl: './ward-view.component.html',
  styleUrl: './ward-view.component.css',
})
export class WardViewComponent implements OnInit {
  patStore = inject(PatStore);

  async ngOnInit() {
    this.patStore.loadWard();
    this.patStore.loadRemarks();
    this.patStore.loadFollowups();
    this.patStore.loadReports();
    this.patStore.loadComplaints();
  }

  getTotalRecords = computed(
    () =>
      this.getReportsCount() +
      this.getFollowupsCount() +
      this.getComplaintsCount() +
      this.getRemakrsCount()
  );

  getReportsCount = computed(() => this.patStore.reports.length);

  getFollowupsCount = computed(() => this.patStore.followups.length);

  getComplaintsCount = computed(() => this.patStore.complaints.length);

  getRemakrsCount = computed(() => this.patStore.remarks.length);

  getReportActivity = computed(() =>
    this.patStore
      .reports()
      .slice(0, 2)
      .map((report) => ({
        title: `Medical Report: ${report.diagnosis}`,
        date: this.formatDate(report.date),
        icon: 'pi pi-file-edit',
        color: 'text-blue-500',
      }))
  );

  getFollowupActiviy = computed(() =>
    this.patStore
      .followups()
      .slice(0, 1)
      .map((followup) => ({
        title: `Followup ${followup.status.toLowerCase()}`,
        date: this.formatDate(followup.followupDate),
        icon: 'pi pi-calendar-plus',
        color: 'text-green-500',
      }))
  );

  getRemarkActivity = computed(() =>
    this.patStore
      .remarks()
      .slice(0, 1)
      .map((remark) => ({
        title: `${remark.readingType}: ${remark.readingVal}`,
        date: this.formatDate(remark.timestamp),
        icon: 'pi pi-heart',
        color: 'text-red-500',
      }))
  );

  getTopAcitivites = computed(() => {
    return [
      ...this.getReportActivity(),
      ...this.getFollowupActiviy(),
      ...this.getRemarkActivity(),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  });

  // getRecentActivities(): any[] {
  //   const activities: any = [];

  // Add recent reports
  // if (this.patientRegister?.reports) {
  //   this.patientRegister.reports.slice(0, 2).forEach((report) => {
  //     activities.push({
  //       title: `Medical Report: ${report.diagnosis}`,
  //       date: this.formatDate(report.date),
  //       icon: 'pi pi-file-edit',
  //       color: 'text-blue-500',
  //     });
  //   });
  // }

  // Add recent followups
  // if (this.patientRegister?.followups) {
  //   this.patientRegister.followups.slice(0, 1).forEach((followup) => {
  //     activities.push({
  //       title: `Followup ${followup.status.toLowerCase()}`,
  //       date: this.formatDate(followup.followupDate),
  //       icon: 'pi pi-calendar-plus',
  //       color: 'text-green-500',
  //     });
  //   });
  // }

  // Add recent remarks
  // if (this.patientRegister?.remarks) {
  //   this.patientRegister.remarks.slice(0, 1).forEach((remark) => {
  //     activities.push({
  //       title: `${remark.readingType}: ${remark.readingVal}`,
  //       date: this.formatDate(remark.timestamp),
  //       icon: 'pi pi-heart',
  //       color: 'text-red-500',
  //     });
  //   });
  // }

  // return activities.slice(0, 5); // Show only 5 recent activities
  // }

  hasRecentActivity(): boolean {
    return this.getTopAcitivites().length > 0;
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  calculateDaysAdmitted(): number {
    let patientRegister = this.patStore.patientRegister();
    if (!patientRegister || !patientRegister.admissionDate) return 0;
    const admissionDate = new Date(patientRegister.admissionDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - admissionDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getInitials(doctor: any): string {
    if (!doctor) return '';
    return `${doctor.firstName.charAt(0)}${doctor.lastName.charAt(
      0
    )}`.toUpperCase();
  }

  getImageSrc(doctor: Doctor | null): string | null {
    if (!doctor || !doctor.image) return null;
    return `data:image/jpeg;base64,${doctor.image}`;
  }
}
