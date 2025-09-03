import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  DoctorRegisterRequest,
  PatientRegisterRequest,
} from '../utils/authTypes';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authToken = environment.authToken;
  private readonly apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  async init() {}

  login(req: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl + '/auth/login', req);
  }

  registerDoctor(req: DoctorRegisterRequest): Observable<string> {
    return this.http.post(this.apiUrl + '/auth/registerDoctor', req, {
      responseType: 'text',
    });
  }

  registerPatient(req: PatientRegisterRequest): Observable<string> {
    return this.http.post(this.apiUrl + '/auth/registerPatient', req, {
      responseType: 'text',
    });
  }
}
