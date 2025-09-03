import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  Signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { WardlistComponent } from './wardlist/wardlist.component';
import { PatListComponent } from './pat-list/pat-list.component';
import { FollowupListComponent } from './followup-list/followup-list.component';
import { ComplainListComponent } from './complain-list/complain-list.component';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { DoctorStore } from '../../store/DoctorStore';
import { MonitorComponent } from '../patient-profile/monitor/monitor.component';

@Component({
  selector: 'app-doctor-profile',
  imports: [
    CommonModule,
    ComplainListComponent,
    FollowupListComponent,
    PatListComponent,
    WardlistComponent,
    CardModule,
    ProgressSpinnerModule,
    MonitorComponent,
    ButtonModule,
    BadgeModule,
    TabsModule,
    AvatarModule,
    TagModule,
    ToastModule,
    RatingModule,
    FormsModule,
  ],
  providers: [MessageService, DoctorStore],
  templateUrl: './doctor-profile.component.html',
  styleUrl: './doctor-profile.component.css',
})
export class DoctorProfileComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  readonly docStore = inject(DoctorStore);

  value: number = 0;
  isLoading = true;
  doctorId!: string;

  availableDates = [
    { day: '02 May', slots: '2 slots' },
    { day: '03 May', slots: '3 slots' },
    { day: '09 May', slots: '2 slots' },
    { day: '10 May', slots: '4 slots' },
  ];

  async ngOnInit() {
    // this.loadImageAsBase64('/doc.png')
    //   .then((base64) => {
    //     this.doctor.image = base64;
    //   })
    //   .catch((error) => {
    //     console.error('Image load error:', error);
    //   });
    this.docStore.loadId();
    this.docStore.loadDoc();
  }

  // scrollPositions: { [key: number]: number } = {};

  // onScroll(event: Event) {
  //   const target = event.target as HTMLElement;
  //   const currentTab = Number(this.value); // Defensive cast
  //   this.scrollPositions[currentTab] = target.scrollTop;
  // }

  // onTabChange(newTabIndex: string | number) {
  //   const tabIndex = Number(newTabIndex); // Ensure it's treated as a number
  //   setTimeout(() => {
  //     const scrollTop = this.scrollPositions[tabIndex] || 0;
  //     this.scrollContainer.nativeElement.scrollTop = scrollTop;
  //   });
  // }

  getInitials(): string {
    return `${this.docStore.doc()!.firstName.charAt(0)}${this.docStore
      .doc()!
      .lastName.charAt(0)}`;
  }

  getImageSrc(): string | null {
    if (!this.docStore.doc()!.image) return null;
    return `data:image/jpeg;base64,${this.docStore.doc()!.image}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
