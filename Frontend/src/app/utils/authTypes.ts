import { BloodGroup, Gender, Specialisation, UserType } from './enums';

export type LoginRequest = {
  email: string;
  password: string;
  userType: UserType; // DOCTOR or PATIENT
};

export type LoginResponse = {
  token: string;
  userType: UserType;
  email: string;
  name: string;
};

export type DoctorRegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specialisation: string;
  joinDate: string;
  gender: string;
  phoneNumber: string;
  licenseNumber: string;
  retirementDate?: string;
  image?: string; // base64 encoded string or use File/Blob
};

export type PatientRegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: Date | string;
  gender: Gender;
  height: number;
  weight: number;
  bloodGroup: string;
  number: string;
  emergencyNumber?: string;
  address?: string;
  aadhar: string;
};
