import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatStore } from '../../../store/PatientStore';
import { FollowupStatus } from '../../../utils/helper';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { Skeleton } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { Doctor, Followup } from '../../../utils/models';
import { PatService } from '../pat-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { handleError } from '../../../utils/util';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-followup',
  standalone: true,
  templateUrl: './followup.component.html',
  styleUrls: ['./followup.component.css'],
  imports: [
    CommonModule,
    SelectModule,
    FormsModule,
    CalendarModule,
    DatePicker,
    ButtonModule,
    DividerModule,
    TagModule,
    Skeleton,
    ToastModule,
  ],
  providers: [MessageService, PatService],
})
export class FollowupComponent implements OnInit {
  patStore = inject(PatStore);
  patService = inject(PatService);
  private messageService = inject(MessageService);

  // View state signal
  currentView = signal<'list' | 'form'>('list');

  // Form field signals
  doctorId = signal<number | null>(null);
  followupDate = signal<Date | null>(null);
  status = signal(FollowupStatus.Pending);
  isSubmitting = signal(false);

  doctorOptions = computed(() =>
    this.patStore.patDoctors().map((doctor) => ({
      label: `Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.specialisation}`,
      value: doctor.id,
    }))
  );

  async ngOnInit() {
    this.patStore.loadPatDoctors();
  }

  switchToForm() {
    const firstDoctor = this.patStore.patDoctors()[0];
    this.doctorId.set(firstDoctor?.id ?? null);
    this.status.set(FollowupStatus.Pending);
    this.followupDate.set(null);
    this.currentView.set('form');
  }

  switchToList() {
    this.currentView.set('list');
  }

  onSubmit() {
    const docId = this.doctorId();
    const date = this.followupDate();
    const status = this.status();

    if (docId && date && status) {
      this.isSubmitting.set(true);
      const newFollowup: Omit<Followup, 'id'> = {
        followupDate: date.toISOString().split('T')[0],
        patient: this.patStore.pat()!,
        doctor: this.patStore.patDoctors().find((d) => d.id === docId)!,
        register: this.patStore.patientRegister()!,
        status,
      };
      this.patService.postFollowup(this.patStore.id()!, newFollowup).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          console.log(res);
          this.patStore.loadFollowups();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Follow-up registered successfully!',
          });
          this.switchToList();
        },
        error: (err: HttpErrorResponse) => {
          handleError(err, this.messageService);
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Form',
        detail: 'Please fill all required fields',
      });
    }
  }

  getDoctorName(id: number): string {
    const doc = this.patStore.patDoctors().find((d) => d.id === id);
    return doc ? `${doc.firstName} ${doc.lastName}` : 'Unknown';
  }

  getSeverity(status: string): 'success' | 'warn' | 'danger' {
    if (status === FollowupStatus.Acheived) return 'success';
    if (status === FollowupStatus.Pending) return 'warn';
    return 'danger';
  }

  trackByFollowupId(index: number, fol: Followup): number {
    return fol.id;
  }
}
