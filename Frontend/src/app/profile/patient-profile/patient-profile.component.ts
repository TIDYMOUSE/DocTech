import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button'; // Keep for p-button in details view
import { MessageModule } from 'primeng/message'; // Keep if used elsewhere or in child components
import { Patient, Remark } from '../../utils/models';
import { Gender, BloodGroup } from '../../utils/enums';
import { TooltipModule } from 'primeng/tooltip';
import { ComplaintComponent } from './complaint/complaint.component';
import { FollowupComponent } from './followup/followup.component';
import { ReportComponent } from './report/report.component';
import { DoctorViewComponent } from './doctor-view/doctor-view.component';
import { WardViewComponent } from './ward-view/ward-view.component';
import { MonitorComponent } from './monitor/monitor.component';
import { Flag, FollowupStatus } from '../../utils/helper';
import { TagModule } from 'primeng/tag';
import { ScrollerModule } from 'primeng/scroller';
import { Skeleton } from 'primeng/skeleton';
import { PatStore } from '../../store/PatientStore';
import { MessageService } from 'primeng/api';

export interface NavItem {
  label?: string;
  icon?: string;
  componentKey?: string;
  tooltip?: string;
  isSeparator?: boolean;
}

// interface ModifiedRemark {
//   timestamp: string;
//   readingType: string;
//   note: string;
//   flag: Flag;
// }

// interface ModifiedFollowup {
//   followupDate: string;
//   doctor: string;
//   status: FollowupStatus;
// }

type ActivityItem = {
  type: 'remark' | 'followup';
  title: string;
  subtitle: string;
  timestamp: string;
  timeAgo: string;
  tag: string;
  severity: 'info' | 'warn' | 'success' | 'danger';
};

@Component({
  selector: 'app-patient-profile',
  standalone: true, // Assuming Angular 17+ uses standalone by default with CLI
  imports: [
    CommonModule,
    ButtonModule,
    MessageModule,
    TooltipModule,
    Skeleton,
    ScrollerModule,
    ComplaintComponent,
    FollowupComponent,
    ReportComponent,
    DoctorViewComponent,
    WardViewComponent,
    MonitorComponent,
    TagModule,
  ],
  providers: [PatStore, MessageService],
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.css',
})
export class PatientProfileComponent implements OnInit {
  patStore = inject(PatStore);

  isMenuCollapsed = signal<boolean>(false);
  currentComponent = signal<string>('details');

  navItems: NavItem[] = [
    {
      label: 'Patient Details',
      icon: 'pi pi-user',
      componentKey: 'details',
      tooltip: 'Patient Details',
    },
    {
      label: 'Health Monitor',
      icon: 'pi pi-chart-line',
      componentKey: 'monitor',
      tooltip: 'Health Monitor',
    },
    {
      label: 'Medical Reports',
      icon: 'pi pi-file-pdf',
      componentKey: 'reports',
      tooltip: 'Medical Reports',
    },
    {
      label: 'Follow-up Requests',
      icon: 'pi pi-calendar-plus',
      componentKey: 'followups',
      tooltip: 'Follow-up Requests',
    },
    {
      label: 'Register Complaint',
      icon: 'pi pi-exclamation-triangle',
      componentKey: 'complains',
      tooltip: 'Register Complaint',
    },
    { isSeparator: true },
    {
      label: 'Doctor Information',
      icon: 'pi pi-user-edit',
      componentKey: 'doctor',
      tooltip: 'Doctor Information',
    },
    {
      label: 'Ward Details',
      icon: 'pi pi-home',
      componentKey: 'ward',
      tooltip: 'Ward Details',
    },
  ];

  // modifiedRemarks: ModifiedRemark[] = [
  //   {
  //     timestamp: '2025-06-03T10:15:00Z',
  //     readingType: 'Blood Pressure',
  //     note: 'Elevated systolic value observed during morning reading.',
  //     flag: Flag.ABNORMAL,
  //   },
  //   {
  //     timestamp: '2025-06-03T15:40:00Z',
  //     readingType: 'Heart Rate',
  //     note: 'Normal range maintained throughout the afternoon.',
  //     flag: Flag.NORMAL,
  //   },
  //   {
  //     timestamp: '2025-06-02T21:10:00Z',
  //     readingType: 'Oxygen Saturation',
  //     note: 'Slight drop observed at night, advised retest.',
  //     flag: Flag.CRITICAL,
  //   },
  // ];

  // modifiedFollowups: ModifiedFollowup[] = [
  //   {
  //     followupDate: '2025-06-05T09:00:00Z',
  //     doctor: 'Dr. A. Swami',
  //     status: FollowupStatus.Pending,
  //   },
  //   {
  //     followupDate: '2025-06-02T14:30:00Z',
  //     doctor: 'Dr. Priya Menon',
  //     status: FollowupStatus.Acheived,
  //   },
  //   {
  //     followupDate: '2025-05-30T10:00:00Z',
  //     doctor: 'Dr. Sameer Rao',
  //     status: FollowupStatus.Missed,
  //   },
  // ];

  activityItem = computed(() => {
    return [...this.remarkItems(), ...this.followupItems()].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  });

  remarkItems = computed(() => {
    return this.patStore.remarks().map(
      (r): ActivityItem => ({
        type: 'remark',
        title: r.readingType + ' Alert',
        subtitle: r.note,
        timestamp: r.timestamp,
        timeAgo: this.getTimeAgo(r.timestamp),
        tag: r.flag,
        severity:
          r.flag === Flag.CRITICAL
            ? 'warn'
            : r.flag === Flag.ABNORMAL
            ? 'danger'
            : 'info',
      })
    );
  });

  followupItems = computed(() => {
    return this.patStore.followups().map(
      (f): ActivityItem => ({
        type: 'followup',
        title:
          f.status === FollowupStatus.Acheived
            ? 'Follow-up Completed'
            : f.status === FollowupStatus.Missed
            ? 'Follow-up Missed'
            : 'Follow-up Scheduled',
        subtitle: `With Dr. ${f.doctor.firstName} ${f.doctor.lastName}`,
        timestamp: f.followupDate,
        timeAgo: this.getTimeAgo(f.followupDate),

        tag: f.status,
        severity:
          f.status === FollowupStatus.Acheived
            ? 'success'
            : f.status === FollowupStatus.Missed
            ? 'danger'
            : 'info',
      })
    );
  });

  async ngOnInit() {
    // this.activityItems = this.getSortedRecentActivity(
    //   this.modifiedRemarks,
    //   this.modifiedFollowups
    // );
    this.patStore.loadId();
    this.patStore.loadPat();
    this.patStore.loadRemarks();
    this.patStore.loadFollowups();
    this.patStore.loadWard();
  }

  toggleMenu(): void {
    this.isMenuCollapsed.update((value) => !value);
  }

  navigateTo(componentKey: string): void {
    this.isMenuCollapsed.set(true);
    this.currentComponent.set(componentKey);
  }

  changeCurrentComponent = (s: string) => {
    this.currentComponent.set(s);
  };

  private getTimeAgo(timestamp: string): string {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0)
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  // getSortedRecentActivity(
  //   remarks: Remark[],
  //   followups: ModifiedFollowup[]
  // ): ActivityItem[] {
  // const remarkItems = remarks.map(
  //   (r): ActivityItem => ({
  //     type: 'remark',
  //     title: r.readingType + ' Alert',
  //     subtitle: r.note,
  //     timestamp: r.timestamp,
  //     timeAgo: this.getTimeAgo(r.timestamp),
  //     tag: r.flag,
  //     severity:
  //       r.flag === Flag.CRITICAL
  //         ? 'warn'
  //         : r.flag === Flag.ABNORMAL
  //         ? 'danger'
  //         : 'info',
  //   })
  // );

  // const followupItems = followups.map(
  //   (f): ActivityItem => ({
  //     type: 'followup',
  //     title:
  //       f.status === FollowupStatus.Acheived
  //         ? 'Follow-up Completed'
  //         : f.status === FollowupStatus.Missed
  //         ? 'Follow-up Missed'
  //         : 'Follow-up Scheduled',
  //     subtitle: `With Dr. ${f.doctor}`,
  //     timestamp: f.followupDate,
  //     timeAgo: this.getTimeAgo(f.followupDate),

  //     tag: f.status,
  //     severity:
  //       f.status === FollowupStatus.Acheived
  //         ? 'success'
  //         : f.status === FollowupStatus.Missed
  //         ? 'danger'
  //         : 'info',
  //   })
  // );

  // const combined = [...remarkItems, ...followupItems];

  // combined.sort(
  //   (a, b) =>
  //     new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  // );

  // return combined;
  // }
}
