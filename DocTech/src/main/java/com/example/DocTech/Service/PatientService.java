package com.example.DocTech.Service;

import com.example.DocTech.Model.*;
import com.example.DocTech.Repository.*;
import org.springframework.stereotype.Service;

import javax.print.Doc;
import java.util.List;
import java.util.Optional;

@Service
public class PatientService {


    private final PatientRepository patientRepository;
    private final ReportRepository reportRepository;
    private final DoctorRepository doctorRepository;
    private final ComplaintRepository complaintRepository;
    private final RemarkRepository remarkRepository;
    private final FollowupRepository followupRepository;


    PatientService(
            PatientRepository patientRepository,
            ReportRepository reportRepository,
            DoctorRepository doctorRepository,
            ComplaintRepository complaintRepository,
            RemarkRepository remarkRepository,
            FollowupRepository followupRepository
    ){
        this.patientRepository = patientRepository;
        this.reportRepository = reportRepository;
        this.doctorRepository = doctorRepository;
        this.complaintRepository = complaintRepository;
        this.remarkRepository = remarkRepository;
        this.followupRepository = followupRepository;
    }


    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

//    public boolean validatePatientId(Long id) {
//        if(doctorService.getDoctorById(id).isEmpty()){
//
//        }
//    }

    public void deletePatient(Long pat_id) {
        patientRepository.deleteById(pat_id);
    }

    public Optional<Doctor> getDoctor(Long doc_id) {
        return doctorRepository.findById(doc_id);
    }

    public Patient_Register getWard(Long pat_id) {
        return patientRepository.findById(pat_id).get().getPatientRegister();
    }

    public List<Report> getReports(Long id) {
        return patientRepository.findById(id).get().getReports();
    }

    public Optional<Report> getReport(Long rep_id) {
        return reportRepository.findById(rep_id);
    }




    // RATE AND COMPLAINT
    public void rateDoctor(Float rating, Long doc_id) {
        Doctor doc = doctorRepository.findById(doc_id).get();
        doc.setRating((doc.getRating() + rating)/2);
        doctorRepository.save(doc);

    }

    public void reportDoctor(Complaint complaint) {
        complaintRepository.save(complaint);
    }

    // REMARKS
    public List<Remark> getRemarks(Long pat_id) {
        return remarkRepository.findByPatient_IdOrderByTimestampDesc(pat_id);
    }

    public List<Remark> getFilteredRemarksByDoctorId(Long pat_id, Long doc_id) {
        return remarkRepository.findByDoctor_IdAndPatient_IdOrderByTimestampDesc(doc_id, pat_id);
    }

    // followups

    public List<Followup> getFollowups(Long pat_id) {
        return followupRepository.findByPatient_IdOrderByFollowupDateDesc(pat_id);
    }

    public void requestFollowup(Followup followup) {
        followupRepository.save(followup);
    }


}
