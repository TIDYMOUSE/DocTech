import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { DoctorStore } from '../../../store/DoctorStore';
import { Skeleton } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { DocService } from '../doc.service';
import { Followup } from '../../../utils/models';
import { HttpErrorResponse } from '@angular/common/http';
import { handleError } from '../../../utils/util';
import { DialogModule } from 'primeng/dialog';
import { Textarea } from 'primeng/textarea';
import { SpecialisationTests } from '../../../utils/enums';
import { Report } from '../../../utils/models';
import { FollowupStatus } from '../../../utils/helper';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-followup-list',
  imports: [
    CommonModule,
    TableModule,
    Textarea,
    ButtonModule,
    Select,
    InputIconModule,
    Skeleton,
    IconFieldModule,
    DialogModule,
    MessageModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: './followup-list.component.html',
  styleUrl: './followup-list.component.css',
})
export class FollowupListComponent implements OnInit {
  docStore = inject(DoctorStore);
  messageService = inject(MessageService);
  docService = inject(DocService);

  currentView = signal<'list' | 'form' | 'reportForm'>('list');
  selectedFollowup = signal<Followup | null>(null);
  dialogVisible = signal<boolean>(false);

  filteredFollowups = computed(() => {
    return this.docStore.followups().filter((f) => {
      const matchesStatus =
        !this.selectedStatus() || f.status == this.selectedStatus();
      const matchesSearch =
        !this.searchTerm() ||
        f.patient.firstName
          .toLowerCase()
          .includes(this.searchTerm().toLowerCase()) ||
        f.patient.lastName
          .toLowerCase()
          .includes(this.searchTerm().toLowerCase());
      return matchesStatus && matchesSearch;
    });
  });

  async ngOnInit() {
    this.docStore.loadFollowups();
  }

  statusOptions = [
    { label: 'All', value: null },
    { label: 'Pending', value: 'Pending' },
    { label: 'Acheived', value: 'Acheived' },
  ];

  testsOptions = this.toSelectOptions(
    SpecialisationTests[this.docStore.doc()?.specialisation!]
  );

  selectedStatus = signal<string | null>('Pending');
  searchTerm = signal('');
  selectedTests: string[] = [];
  diagnosis: string = '';
  medication = '';
  remarks = '';

  toSelectOptions(tests: string[]): { label: string; value: string }[] {
    return tests.map((test) => ({ label: test, value: test }));
  }

  showAddressDialog(followup: Followup) {
    this.selectedFollowup.set(followup);
    this.dialogVisible.set(true);
  }

  addReport() {
    this.dialogVisible.set(false);
    this.currentView.set('reportForm');
  }

  switchToList() {
    this.currentView.set('list');
    this.selectedFollowup.set(null);
  }

  switchToForm() {
    this.currentView.set('form');
    this.selectedFollowup.set(null);
  }

  onCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (input.checked) {
      if (!this.selectedTests.includes(value)) {
        this.selectedTests.push(value);
      }
    } else {
      this.selectedTests = this.selectedTests.filter((v) => v !== value);
    }
  }

  async addressFollowup() {
    let fol = this.selectedFollowup();
    if (!fol) return;
    fol.status = FollowupStatus.Acheived;
    this.docService.addressFollowup(fol).subscribe({
      next: (res) => {
        console.log(res);
        this.docStore.loadFollowups();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Followup addressed successfully',
        });
        this.switchToList();
      },
      error: (err: HttpErrorResponse) => {
        handleError(err, this.messageService);
      },
    });
    this.dialogVisible.set(false);
  }

  onSubmitReport() {
    let report: Omit<Report, 'id'> = {
      doctor: this.selectedFollowup()?.doctor!,
      patient: this.selectedFollowup()?.patient!,
      register: this.selectedFollowup()?.register!,
      date: new Date().toISOString(),
      diagnosis: this.diagnosis,
      followupRequired: false,
      medication: this.medication,
      remarks: this.remarks,
      tests: this.selectedTests.toString(),
    };
    console.log(report);
    this.docService.createReport(report).subscribe({
      next: (res) => {
        console.log(res);
        let fol = this.selectedFollowup()!;
        fol.report = res;
        fol.status = FollowupStatus.Acheived;
        this.docService.addressFollowup(fol).subscribe({
          next: (res) => {
            console.log(res);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Follow-up addressed successfully!',
            });
            this.switchToList();
          },
          error: (err: HttpErrorResponse) =>
            handleError(err, this.messageService),
        });
      },
      error: (err: HttpErrorResponse) => handleError(err, this.messageService),
    });
  }
}
