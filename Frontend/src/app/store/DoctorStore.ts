import { inject } from '@angular/core';
import {
  Complaint,
  Doctor,
  Followup,
  Patient,
  PatientRegister,
  Remark,
  Report,
} from '../utils/models';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { DocService } from '../profile/doctor-profile/doc.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

import { EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { handleError } from '../utils/util';
import { Router } from '@angular/router';
import { getCurrentUserId } from '../utils/jwt';

type DoctorDTO = {
  isLoadingDoc: boolean;
  isLoadingWard: boolean;
  isLoadingPat: boolean;
  isLoadingComp: boolean;
  isLoadingFol: boolean;
  isLoadingRep: boolean;
  isLoadingRem: boolean;
  id: string | null;
  doc: Doctor | null;
  patientRegister: PatientRegister[];
  followups: Followup[];
  patients: Patient[];
  reports: Report[];
  complaints: Complaint[];
  remarks: Remark[];
};

const initialState: DoctorDTO = {
  isLoadingDoc: true,
  isLoadingComp: true,
  isLoadingRem: true,
  isLoadingRep: true,
  isLoadingFol: true,
  isLoadingPat: true,
  isLoadingWard: true,
  id: null,
  doc: null,
  patientRegister: [],
  patients: [],
  followups: [],
  reports: [],
  complaints: [],
  remarks: [],
};

export const DoctorStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      docService = inject(DocService),
      messageService = inject(MessageService),
      router = inject(Router)
    ) => ({
      loadId() {
        let id = getCurrentUserId();
        if (!id) {
          console.error('No id');
          messageService.add({
            summary: 'Unauthorized',
            life: 3000,
            severity: 'error',
            detail: 'Please Login to proceed',
          });
          router.navigate(['/login/doctor']);
          return;
        }
        patchState(store, { id });
      },
      loadDoc: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoadingDoc: true })),
          switchMap(() => {
            let id = store.id();
            if (!id) return EMPTY;
            return docService.getDoctor(id).pipe(
              tapResponse({
                next: (doc) => patchState(store, { doc }),
                error: (err: HttpErrorResponse) => {
                  handleError(err, messageService);
                  if (err.status === 401) router.navigate(['/login/doctor']);
                },
              }),
              finalize(() => {
                patchState(store, { isLoadingDoc: false });
              })
            );
          })
        )
      ),
      loadWards: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoadingWard: true })),
          switchMap(() => {
            let id = store.id();
            if (!id) return EMPTY;
            return docService.getWards(id).pipe(
              tapResponse({
                next: (ward) => patchState(store, { patientRegister: ward }),
                error: (err: HttpErrorResponse) =>
                  handleError(err, messageService),
              }),
              finalize(() => {
                patchState(store, { isLoadingWard: false });
              })
            );
          })
        )
      ),
      loadPatients: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoadingPat: true })),
          switchMap(() => {
            let id = store.id();
            if (!id) return EMPTY;
            return docService.getPatients(id).pipe(
              tapResponse({
                next: (patients) => patchState(store, { patients }),
                error: (err: HttpErrorResponse) =>
                  handleError(err, messageService),
              }),
              finalize(() => {
                patchState(store, { isLoadingPat: false });
              })
            );
          })
        )
      ),
      loadReports: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoadingRep: true })),
          switchMap(() => {
            let id = store.id();
            if (!id) return EMPTY;
            return docService.getReports(id).pipe(
              tapResponse({
                next: (reports) => patchState(store, { reports }),
                error: (err: HttpErrorResponse) =>
                  handleError(err, messageService),
              }),
              finalize(() => {
                patchState(store, { isLoadingRep: false });
              })
            );
          })
        )
      ),
      loadFollowups: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoadingFol: true })),
          switchMap(() => {
            let id = store.id();
            if (!id) return EMPTY;
            return docService.getFollowups(id).pipe(
              tapResponse({
                next: (followups) => {
                  console.log(followups);
                  patchState(store, { followups });
                },
                error: (err: HttpErrorResponse) =>
                  handleError(err, messageService),
              }),
              finalize(() => {
                patchState(store, { isLoadingFol: false });
              })
            );
          })
        )
      ),
      loadRemarks: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoadingRem: true })),
          switchMap(() => {
            let id = store.id();
            if (!id) return EMPTY;
            return docService.getRemarks(id).pipe(
              tapResponse({
                next: (remarks) => patchState(store, { remarks }),
                error: (err: HttpErrorResponse) =>
                  handleError(err, messageService),
              }),
              finalize(() => {
                patchState(store, { isLoadingRem: false });
              })
            );
          })
        )
      ),
      loadComplaints: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoadingComp: true })),
          switchMap(() => {
            let id = store.id();
            if (!id) return EMPTY;
            return docService.getComplaints(id).pipe(
              tapResponse({
                next: (complaints) => patchState(store, { complaints }),
                error: (err: HttpErrorResponse) =>
                  handleError(err, messageService),
              }),
              finalize(() => {
                patchState(store, { isLoadingComp: false });
              })
            );
          })
        )
      ),
    })
  )
);
