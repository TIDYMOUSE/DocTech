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
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { handleError } from '../utils/util';
import { Router } from '@angular/router';
import { getCurrentUserId } from '../utils/jwt';
import { PatService } from '../profile/patient-profile/pat-service.service';

type PatientDTO = {
  isLoadingPat: boolean;
  isLoadingWard: boolean;
  isLoadingDoc: boolean;
  isLoadingDoctors: boolean;
  isLoadingFol: boolean;
  isLoadingComp: boolean;
  isLoadingRep: boolean;
  isLoadingRem: boolean;
  id: string | null;
  pat: Patient | null;
  patientRegister: PatientRegister | null;
  followups: Followup[];
  doctors: Doctor[];
  patDoctors: Doctor[];
  reports: Report[];
  remarks: Remark[];
  complaints: Complaint[];
};

const initialState: PatientDTO = {
  isLoadingPat: true,
  isLoadingRem: true,
  isLoadingRep: true,
  isLoadingComp: true,
  isLoadingFol: true,
  isLoadingDoc: true,
  isLoadingDoctors: true,
  isLoadingWard: true,
  id: null,
  pat: null,
  patientRegister: null,
  doctors: [],
  patDoctors: [],
  followups: [],
  complaints: [],
  reports: [],
  remarks: [],
};

export const PatStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      patService = inject(PatService),
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
          router.navigate(['/login/patient']);
          return;
        }
        patchState(store, { id });
      },
      loadPat: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoadingPat: true })),
          switchMap(() => {
            let id = store.id();
            if (!id) return EMPTY;
            return patService.getPatient(id).pipe(
              tapResponse({
                next: (pat) => patchState(store, { pat }),
                error: (err: HttpErrorResponse) => {
                  handleError(err, messageService);
                  if (err.status === 401) router.navigate(['/login/patient']);
                },
              }),
              finalize(() => {
                patchState(store, { isLoadingPat: false });
              })
            );
          })
        )
      ),
      loadWard: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoadingWard: true })),
          switchMap(() => {
            let id = store.id();
            if (!id) return EMPTY;
            return patService.getWard(id).pipe(
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
      loadDoctors: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoadingDoctors: true })),
          switchMap(() => {
            return patService.getDoctors().pipe(
              tapResponse({
                next: (doctors) => patchState(store, { doctors }),
                error: (err: HttpErrorResponse) =>
                  handleError(err, messageService),
              }),
              finalize(() => {
                patchState(store, { isLoadingDoctors: false });
              })
            );
          })
        )
      ),
      loadPatDoctors: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoadingDoc: true })),
          switchMap(() => {
            let id = store.id();
            if (!id) return EMPTY;
            return patService.getPatDocs(id).pipe(
              tapResponse({
                next: (doctors) => patchState(store, { patDoctors: doctors }),
                error: (err: HttpErrorResponse) =>
                  handleError(err, messageService),
              }),
              finalize(() => {
                patchState(store, { isLoadingDoc: false });
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
            return patService.getReports(id).pipe(
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
            return patService.getFollowups(id).pipe(
              tapResponse({
                next: (followups) => patchState(store, { followups }),
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
            return patService.getRemarks(id).pipe(
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
            return patService.getComplaints(id).pipe(
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
