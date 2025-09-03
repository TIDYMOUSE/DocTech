import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { Patient } from '../../../utils/models';
import { BloodGroup, Gender } from '../../../utils/enums';
import { FormsModule } from '@angular/forms';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { DocService } from '../doc.service';
import { DoctorStore } from '../../../store/DoctorStore';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-pat-list',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    Skeleton,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    InputIconModule,
    IconFieldModule,
    TagModule,
    PaginatorModule,
    TooltipModule,
  ],
  standalone: true,
  templateUrl: './pat-list.component.html',
  styleUrl: './pat-list.component.css',
})
export class PatListComponent implements OnInit {
  searchTerm = signal('');
  selectedStatus = signal('admitted');
  selectedSort = signal('name');
  currentView = signal('grid');

  // Pagination
  first = signal(0);
  itemsPerPage = signal(8);

  readonly docStore = inject(DoctorStore);

  readonly filteredPatients = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();
    const patientRegisters = this.docStore.patientRegister();

    console.log('Patient registers for this doctor:', patientRegisters);

    if (patientRegisters.length === 0) return [];

    // Get patients that have registers with this doctor
    const doctorPatients = patientRegisters
      .map((register) => register.patient)
      .filter((patient) => patient != null); // Remove any null patients

    console.log("Doctor's patients:", doctorPatients);

    return doctorPatients.filter((patient) => {
      const fullName = this.getPatientFullName(patient).toLowerCase();
      const patientId = patient.id.toString();
      const phone = patient.number?.toLowerCase() || '';
      const email = patient.email?.toLowerCase() || '';

      const matchesSearch =
        !term ||
        fullName.includes(term) ||
        patientId.includes(term) ||
        phone.includes(term) ||
        email.includes(term);

      // Find the register for this patient
      const register = patientRegisters.find(
        (r) => r.patient?.id === patient.id
      );
      const isAdmitted = register?.admitted;

      const matchesStatus =
        !status ||
        (status === 'admitted' && isAdmitted) ||
        (status === 'discharged' && !isAdmitted);

      return matchesSearch && matchesStatus;
    });
  });

  readonly sortedPatients = computed(() => {
    const sortType = this.selectedSort();
    const filtered = this.filteredPatients();
    if (filtered.length === 0) return [];
    return [...filtered].sort((a, b) => {
      switch (sortType) {
        case 'name':
          return this.getPatientFullName(a).localeCompare(
            this.getPatientFullName(b)
          );
        case 'name_desc':
          return this.getPatientFullName(b).localeCompare(
            this.getPatientFullName(a)
          );
        case 'age':
          return this.calculateAge(a.dob) - this.calculateAge(b.dob);
        case 'recent':
          return (
            new Date(b.createdAt || '').getTime() -
            new Date(a.createdAt || '').getTime()
          );
        default:
          return 0;
      }
    });
  });

  readonly paginatedPatients = computed(() => {
    const sorted = this.sortedPatients();
    const start = this.first();
    const end = start + this.itemsPerPage();
    return sorted.slice(start, end);
  });

  readonly resultsInfo = computed(() => {
    const start = this.first() + 1;
    const end = Math.min(
      this.first() + this.itemsPerPage(),
      this.filteredPatients().length
    );
    return `${start} - ${end} of ${this.filteredPatients().length} results`;
  });

  // Options
  statusOptions = [
    { label: 'All', value: '' },
    { label: 'Admitted', value: 'admitted' },
    { label: 'Discharged', value: 'discharged' },
  ];

  sortOptions = [
    { label: 'Name A-Z', value: 'name' },
    { label: 'Name Z-A', value: 'name_desc' },
    { label: 'Recent', value: 'recent' },
    { label: 'Age', value: 'age' },
  ];

  viewOptions = ['grid', 'list'];

  async ngOnInit() {
    this.docStore.loadPatients();
    this.docStore.loadWards();
  }

  onSearch(val: string) {
    this.searchTerm.set(val.trim());
    this.first.set(0);
  }

  onFilter(status: string) {
    this.selectedStatus.set(status);
  }

  onSort(sortType: string) {
    this.selectedSort.set(sortType);
  }

  onItemsPerPageChange(value: string) {
    this.itemsPerPage.set(parseInt(value));
    this.first.set(0); // Reset to first page
  }

  onPageChange(event: any) {
    this.first.set(event.first);
    // this.itemsPerPage.set(event.rows);
  }

  getPatientFullName(patient: Patient): string {
    return `${patient.firstName} ${patient.middleName || ''} ${
      patient.lastName
    }`.trim();
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

  isAdmitted = (patientId: number) => {
    const register = this.docStore
      .patientRegister()
      ?.find((r) => r.patient?.id === patientId);
    return !!register?.admitted;
  };

  getRegister = (patientId: number) => {
    return this.docStore
      .patientRegister()
      ?.find((r) => r.patient?.id === patientId);
  };

  getStatusSeverity(patient: Patient): string {
    if (this.isAdmitted(patient.id)) {
      return 'success';
    }
    return 'secondary';
  }

  trackByPatientId(index: number, patient: Patient): number {
    return patient.id;
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

  // Action methods
  viewPatientDetails(patient: Patient) {
    console.log('View details for patient:', patient.id);
    // Implement navigation to patient details
  }

  viewReports(patient: Patient) {
    console.log('View reports for patient:', patient.id);
    // Implement navigation to patient reports
  }

  editPatient(patient: Patient) {
    console.log('Edit patient:', patient.id);
    // Implement edit functionality
  }

  showMoreActions(patient: Patient) {
    console.log('Show more actions for patient:', patient.id);
    // Implement context menu or dropdown
  }
}
