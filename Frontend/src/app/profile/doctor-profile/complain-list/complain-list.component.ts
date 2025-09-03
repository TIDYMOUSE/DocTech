import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  Signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { DoctorStore } from '../../../store/DoctorStore';
import { Complaint } from '../../../utils/models';
import { Skeleton } from 'primeng/skeleton';
import { Select } from 'primeng/select';
import { DocService } from '../doc.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { handleError } from '../../../utils/util';

@Component({
  selector: 'app-complain-list',
  standalone: true,
  imports: [
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    Skeleton,
    MessageModule,
    DialogModule,
    Select,
    ButtonModule,
    FormsModule,
    TextareaModule,
    TableModule,
  ],
  templateUrl: './complain-list.component.html',
  styleUrl: './complain-list.component.css',
})
export class ComplainListComponent implements OnInit {
  docStore = inject(DoctorStore);
  docService = inject(DocService);
  messageService = inject(MessageService);

  async ngOnInit() {
    this.docStore.loadComplaints();
  }

  filteredComplaints = computed(() => {
    return this.docStore.complaints().filter((c) => {
      const statusMatch =
        this.statusFilter() === 'All' ||
        (this.statusFilter() === 'Resolved' && c.addressed) ||
        (this.statusFilter() === 'Pending' && !c.addressed);

      const nameMatch =
        c.patient.firstName
          .toLowerCase()
          .includes(this.searchQuery().toLowerCase()) ||
        c.patient.lastName
          .toLowerCase()
          .includes(this.searchQuery().toLowerCase());

      return statusMatch && nameMatch;
    });
  });

  statusFilter = signal('Pending'); // 'all', 'Resolved', 'Pending'
  searchQuery = signal('');

  selectedComplaint = signal<Complaint | null>(null);
  displayDialog = signal(false);
  responseMessage = signal('');

  viewPatientDetails(complaint: Complaint) {
    console.log(
      'Viewing patient details for:',
      complaint.patient.firstName + complaint.patient.lastName
    );
    // Implement routing or modal display as needed
  }

  openAddressDialog(complaint: Complaint) {
    this.selectedComplaint.set(complaint);
    this.responseMessage.set('');
    this.displayDialog.set(true);
  }

  submitResponse() {
    let sComplaint = this.selectedComplaint();
    if (!sComplaint) {
      this.messageService.add({
        severity: 'error',
        summary: 'Oops!',
        detail: 'Complaint was not chosen properly!',
      });
      return;
    }

    sComplaint.addressed = true;
    console.log(sComplaint);
    this.docService.addressComplaint(sComplaint).subscribe({
      next: (res) => {
        console.log(res);
        this.docStore.loadComplaints();
        this.messageService.add({
          severity: 'success',
          summary: 'Success!',
          detail: 'Complaint addressed succesfully',
        });
      },
      error: (err: HttpErrorResponse) => handleError(err, this.messageService),
    });
    this.displayDialog.set(false);
    this.selectedComplaint.set(null);
    this.responseMessage.set('');
  }

  getSeverity(complain: Complaint): [string, string] {
    if (complain.addressed) return ['success', 'Resolved'];
    return ['error', 'Pending'];
  }
}
