import { BloodGroup, Gender, Specialisation } from './enums';
import { Flag, FollowupStatus } from './helper';

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialisation: Specialisation;
  password: string;
  joinDate: string;
  retirementDate?: string;
  rating?: number;
  image?: string;
  gender: Gender;
  email?: string;
  licenseNumber?: string;
  phoneNumber: string;

  // Relationships
  // patientRegister?: PatientRegister[] | null;
  // reports?: Report[] | null;
  // followups?: Followup[] | null;
  // remarks?: Remark[] | null;
  // complaints?: Complaint[] | null;
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  dob: string;
  gender: Gender;
  height: number;
  weight: number;
  bloodGroup?: BloodGroup;
  number: string;
  email?: string;
  emergencyNumber?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  aadhar?: string;
  password: string;

  // Relationships
  //   reports?: Report[] | null;
  // patientRegister?: PatientRegister | null;
  //   followups?: Followup[] | null;
  //   remarks?: Remark[] | null;
  //   complaints?: Complaint[] | null;
}

export interface Report {
  id: number;
  diagnosis?: string;
  tests?: string;
  medication?: string;
  followupRequired?: boolean;
  remarks?: string;
  date?: string; // LocalDateTime

  patient: Patient;
  doctor: Doctor;
  register: PatientRegister;
  // followup?: Followup;
}

export interface PatientRegister {
  id: number;
  roomNo: string;
  admitted: boolean;
  admissionDate?: string;
  dischargeDate?: string;
  doctor: Doctor | null;
  patient: Patient | null;
  bedNumber?: string;

  // Relationships
  // reports?: Report[] | null;
  // followups?: Followup[] | null;
  // remarks?: Remark[] | null;
  // complaints?: Complaint[] | null;
}

export interface Remark {
  id: number;
  timestamp: string;
  readingType: string;
  readingVal: string;
  note: string;
  flag: Flag;
  patient: Patient;
  doctor: Doctor;
  register: PatientRegister;
}

export interface Followup {
  id: number;
  followupDate: string;
  patient: Patient;
  doctor: Doctor;
  register: PatientRegister;
  status: FollowupStatus;
  report?: Report;
}

// TODO: response
export interface Complaint {
  id: number;
  issue: string;
  addressed: boolean;
  patient: Patient;
  doctor: Doctor;
  patientRegister: PatientRegister;
}
