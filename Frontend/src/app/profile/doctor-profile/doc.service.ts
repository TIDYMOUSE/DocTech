import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MqttClient, IClientOptions } from 'mqtt';
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
export class DocService {
  private readonly apiUrl = environment.apiUrl + '/doctor';
  private http = inject(HttpClient);

  getDoctor(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(this.apiUrl + '/profile/' + id);
  }

  getPatients(id: string): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/${id}/view-patient`);
  }

  getWards(id: string): Observable<PatientRegister[]> {
    return this.http.get<PatientRegister[]>(`${this.apiUrl}/${id}/view-ward`);
  }

  getReports(id: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/${id}/view-report`);
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

  getReport(followup_id: string): Observable<Report> {
    return this.http.get<Report>(
      `${this.apiUrl}/view-report-by-followup/${followup_id}`
    );
  }

  // POST
  addressFollowup(followup: Followup): Observable<string> {
    return this.http.put(`${this.apiUrl}/addressFollowup`, followup, {
      responseType: 'text',
    });
  }

  createReport(report: Omit<Report, 'id'>): Observable<Report> {
    return this.http.post<Report>(this.apiUrl + '/create-report', report);
  }

  addressComplaint(complaint: Complaint): Observable<string> {
    return this.http.put(`${this.apiUrl}/complaints/address`, complaint, {
      responseType: 'text',
    });
  }
}
