package com.example.DocTech.Service;

import com.example.DocTech.Model.*;
import com.example.DocTech.Repository.*;
import com.example.DocTech.Util.CSVREADER;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorService implements UserDetailsService {

    private final DoctorRepository doctorRepository;
    private final PatientRegisterRepository patientRegisterRepository;
    private final PatientRepository patientRepository;
    private final ReportRepository reportRepository;
    private final RemarkRepository remarkRepository;
    private final ComplaintRepository complaintRepository;
    private final FollowupRepository followupRepository;
    private final CSVREADER csvreader;

    public DoctorService(DoctorRepository doctorRepository, CSVREADER csvreader, PatientRegisterRepository patientRegisterRepository, PatientRepository patientRepository, ReportRepository reportRepository, RemarkRepository remarkRepository, ComplaintRepository complaintRepository, FollowupRepository followupRepository){
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.reportRepository = reportRepository;
        this.followupRepository = followupRepository;
        this.complaintRepository = complaintRepository;
        this.remarkRepository = remarkRepository;
        this.csvreader = csvreader;
        this.patientRegisterRepository  = patientRegisterRepository;
    }

    public List<Doctor> getAllDoctors(){
        return doctorRepository.findAll();
    }

    @Transactional(rollbackFor = Exception.class)
    public Optional<Doctor> getDoctorById(Long id){

        try {
            return doctorRepository.findById(id);
        } catch (Exception e) {
            // Log the exception to see what caused the transaction to fail
            System.out.println("Error fetching doctor by ID" + e.toString());
            throw e;  // Re-throw the exception to mark the transaction for rollback
        }
    }

    public void readCSVColumn(String columnName) {
        csvreader.getData(columnName);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return doctorRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Doctor not found with email: " + email)); // Doctor implements UserDetails
    }


    // ward
    public List<Patient_Register> getAllPatientRegister(Long id) {
        Optional<Doctor> doctor = doctorRepository.findById(id);
        return doctor.get().getPatientRegister();
    }

    public Optional<Patient_Register> getPatientRegister(Long registrationId) {
        return patientRegisterRepository.findById(registrationId);
    }

    // patient
    public List<Patient> getPatients(Long doc_id) {
        return doctorRepository.findPatientsByDoctorId(doc_id);
    }

    public Optional<Patient> getPatient(Long patient_id) {
        return patientRepository.findById(patient_id);
    }

    // reports
    public Optional<Report> getReport(Long id) {
        return reportRepository.findById(id);
    }

    public List<Report> getAllReports(Long doc_id) {
        return doctorRepository.findById(doc_id).get().getReports();
    }

    public List<Report> getReportsByWard(Long reg_id) {
        Optional<Patient_Register> pr = patientRegisterRepository.findById(reg_id);
        return pr.map(Patient_Register::getReports).orElse(null);
    }

    public List<Report> getReportsByPatient(Long pat_id) {
        Optional<Patient> p = patientRepository.findById(pat_id);
        return p.map(Patient::getReports).orElse(null);
    }

    public void createReport(Report report) {
        reportRepository.save(report);
    }

    // Complaints

    public List<Complaint> getComplaints (Long doc_id) {
        return complaintRepository.findByDoctorId(doc_id);
    }

    public void addressComplaint(Long comp_id) {
        Complaint complaint = complaintRepository.findById(comp_id).get();
        complaint.setAddressed(true);
        complaintRepository.save(complaint);
    }

    // followups

    public List<Followup> getFollowups(Long doc_id) {
        return followupRepository.findByDoctor_IdOrderByFollowupDateDesc(doc_id);
    }

    public void registerFollowup(Followup followup) {
        followupRepository.save(followup);
    }

    // remarks
    public List<Remark> getRemarks(Long doc_id) {
        return remarkRepository.findByDoctor_IdOrderByTimestampDesc(doc_id);
    }

    public List<Remark> getFilteredRemarksByPatientId(Long doc_id, Long pat_id) {
        return remarkRepository.findByDoctor_IdAndPatient_IdOrderByTimestampDesc(doc_id, pat_id);
    }

}
