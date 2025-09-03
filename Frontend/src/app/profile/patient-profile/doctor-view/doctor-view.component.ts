import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { Doctor, Patient } from '../../../utils/models';
import { PatStore } from '../../../store/PatientStore';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-doctor-view',
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    Skeleton,
    TagModule,
    AvatarModule,
    DividerModule,
  ],
  templateUrl: './doctor-view.component.html',
  styleUrl: './doctor-view.component.css',
})
export class DoctorViewComponent implements OnInit {
  patStore = inject(PatStore);

  currentView: 'info' | 'list' = 'list';
  isPatientAdmitted = false;

  selectedDoctor = signal<Doctor | null>(null);

  async ngOnInit() {
    this.patStore.loadWard();
    this.patStore.loadDoctors();
    // this.initializeComponent();
  }

  // ! SUSS
  initializeComponent = computed(() => {
    // this.loadPatientData();
    // this.loadDoctorsData();
    if (this.patStore.patientRegister()) {
      this.selectedDoctor.set(this.patStore.patientRegister()?.doctor ?? null);
      this.isPatientAdmitted =
        this.patStore.patientRegister()?.admitted ?? false;
      // If patient is admitted, show their doctor directly
      if (this.isPatientAdmitted) {
        this.currentView = 'info';
      } else {
        this.currentView = 'list';
      }
    }
  });

  // loadPatientData() {
  //   // Dummy patient data
  //   this.currentPatient = {
  //     id: 1,
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     dob: '1990-05-15',
  //     gender: Gender.Male,
  //     height: 175,
  //     weight: 70,
  //     bloodGroup: BloodGroup.O_POSITIVE,
  //     number: '+91-9876543210',
  //     email: 'john.doe@email.com',
  //     password: 'dummy',
  //     patientRegister: {
  //       id: 1,
  //       roomNo: 'R-101',
  //       isAdmitted: true,
  //       admissionDate: '2024-01-15',
  //       bedNumber: 'B-5',
  //       doctor: {
  //         id: 1,
  //         firstName: 'Sarah',
  //         lastName: 'Johnson',
  //         specialisation: Specialisation.Cardiologist,
  //         password: 'dummy',
  //         joinDate: '2018-03-15',
  //         rating: 4.8,
  //         image:
  //           'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
  //         gender: Gender.Female,
  //         phoneNumber: '+91-9876543201',
  //         email: 'dr.sarah.johnson@hospital.com',
  //         licenseNumber: 'MED-2018-001',
  //       },
  //       patient: null,
  //     },
  //   };

  //   this.isPatientAdmitted =
  //     this.currentPatient?.patientRegister?.isAdmitted || false;
  //   if (this.isPatientAdmitted) {
  //     this.selectedDoctor =
  //       this.currentPatient?.patientRegister?.doctor || null;
  //   }
  // }

  // loadDoctorsData() {
  //   // Dummy doctors data
  //   this.doctorList = [
  //     {
  //       id: 1,
  //       firstName: 'Sarah',
  //       lastName: 'Johnson',
  //       specialisation: Specialisation.Cardiologist,
  //       password: 'dummy',
  //       joinDate: '2018-03-15',
  //       rating: 4.8,
  //       image:
  //         'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
  //       gender: Gender.Female,
  //       phoneNumber: '+91-9876543201',
  //       email: 'dr.sarah.johnson@hospital.com',
  //       licenseNumber: 'MED-2018-001',
  //     },
  //     {
  //       id: 2,
  //       firstName: 'Michael',
  //       lastName: 'Chen',
  //       specialisation: Specialisation.Psychiatrist,
  //       password: 'dummy',
  //       joinDate: '2019-08-20',
  //       rating: 4.9,
  //       image:
  //         'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
  //       gender: Gender.Female,
  //       phoneNumber: '+91-9876543202',
  //       email: 'dr.michael.chen@hospital.com',
  //       licenseNumber: 'MED-2019-002',
  //     },
  //     {
  //       id: 3,
  //       firstName: 'Emily',
  //       lastName: 'Rodriguez',
  //       specialisation: Specialisation.Pediatrician,
  //       password: 'dummy',
  //       joinDate: '2020-01-10',
  //       rating: 4.7,
  //       image:
  //         'https://images.unsplash.com/photo-1594824886734-41b7cd661a82?w=150&h=150&fit=crop&crop=face',
  //       gender: Gender.Female,
  //       phoneNumber: '+91-9876543203',
  //       email: 'dr.emily.rodriguez@hospital.com',
  //       licenseNumber: 'MED-2020-003',
  //     },
  //     {
  //       id: 4,
  //       firstName: 'David',
  //       lastName: 'Thompson',
  //       specialisation: Specialisation.Gynaecologist,
  //       password: 'dummy',
  //       joinDate: '2017-11-05',
  //       rating: 4.6,
  //       image:
  //         'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
  //       gender: Gender.Male,
  //       phoneNumber: '+91-9876543204',
  //       email: 'dr.david.thompson@hospital.com',
  //       licenseNumber: 'MED-2017-004',
  //     },
  //     {
  //       id: 5,
  //       firstName: 'Lisa',
  //       lastName: 'Patel',
  //       specialisation: Specialisation.Dermatologist,
  //       password: 'dummy',
  //       joinDate: '2021-06-12',
  //       rating: 4.5,
  //       gender: Gender.Female,
  //       phoneNumber: '+91-9876543205',
  //       email: 'dr.lisa.patel@hospital.com',
  //       licenseNumber: 'MED-2021-005',
  //     },
  //     {
  //       id: 6,
  //       firstName: 'Robert',
  //       lastName: 'Wilson',
  //       specialisation: Specialisation.Oncologist,
  //       password: 'dummy',
  //       joinDate: '2016-04-18',
  //       rating: 4.9,
  //       image:
  //         'https://images.unsplash.com/photo-1551190822-a9333aa5b1d0?w=150&h=150&fit=crop&crop=face',
  //       gender: Gender.Male,
  //       phoneNumber: '+91-9876543206',
  //       email: 'dr.robert.wilson@hospital.com',
  //       licenseNumber: 'MED-2016-006',
  //     },
  //   ];
  // }

  toggleView() {
    this.currentView = this.currentView === 'info' ? 'list' : 'info';
  }

  selectDoctor(doctor: Doctor) {
    this.selectedDoctor.set(doctor);
    this.currentView = 'info';
  }

  requestFollowup() {
    // TODO: Implement followup request logic
    // this.followupService.requestFollowup(this.selectedDoctor);
  }

  registerComplaint() {
    // TODO: Implement complaint registration logic
    // this.complaintService.registerComplaint(this.selectedDoctor);
  }

  getInitials(doctor: Doctor | null): string {
    if (!doctor) return '';
    return `${doctor.firstName.charAt(0)}${doctor.lastName.charAt(
      0
    )}`.toUpperCase();
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }

  getImageSrc(doctor: Doctor | null): string | null {
    if (!doctor || !doctor.image) return null;
    return `data:image/jpeg;base64,${doctor.image}`;
  }
}
