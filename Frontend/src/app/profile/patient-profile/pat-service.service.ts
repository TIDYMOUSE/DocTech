import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Complaint,
  Doctor,
  Followup,
  Patient,
  PatientRegister,
  Remark,
  Report,
} from '../../utils/models';

@Injectable({
  providedIn: 'root',
})
export class PatService {
  private readonly apiUrl = environment.apiUrl + '/patient';
  constructor(private http: HttpClient) {}

  // GET

  getPatient(id: string): Observable<Patient> {
    return this.http.get<Patient>(this.apiUrl + '/profile/' + id);
  }

  getDoctor(id: string, doc_id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}/doc/${doc_id}`);
  }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/view-doctors`);
  }

  getWard(id: string): Observable<PatientRegister> {
    return this.http.get<PatientRegister>(`${this.apiUrl}/${id}/ward`);
  }

  getReports(id: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/${id}/reports`);
  }
  getFollowups(id: string): Observable<Followup[]> {
    return this.http.get<Followup[]>(`${this.apiUrl}/${id}/followups`);
  }
  getRemarks(id: string): Observable<Remark[]> {
    return this.http.get<Remark[]>(`${this.apiUrl}/${id}/remarks`);
  }

  getComplaints(id: string): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(`${this.apiUrl}/${id}/complaints`);
  }

  getPatDocs(id: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/${id}/getPatientDoctors`);
  }

  // POST
  postFollowup(id: string, followup: Omit<Followup, 'id'>): Observable<string> {
    return this.http.post(`${this.apiUrl}/${id}/followups`, followup, {
      responseType: 'text',
    });
  }

  postComplaint(
    id: string,
    complaint: Omit<Complaint, 'id'>
  ): Observable<string> {
    return this.http.post(`${this.apiUrl}/${id}/report`, complaint, {
      responseType: 'text',
    });
  }
}
