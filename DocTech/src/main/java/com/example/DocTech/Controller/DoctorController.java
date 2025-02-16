package com.example.DocTech.Controller;

import com.example.DocTech.Model.*;
import com.example.DocTech.Service.DoctorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService){
        this.doctorService = doctorService;
    }

    // GENERAL
    @GetMapping("/hi")
    public String hi(){
        return "hi";
    }

    @GetMapping("/")
    public List<Doctor> getAllDoctor(){
        return doctorService.getAllDoctors();
    }

    @GetMapping("/column_data")
    public void getColumnData(@RequestParam String columnName){
        doctorService.readCSVColumn(columnName);
    }


    // ACTUAL
    @GetMapping("/profile/{id}")
    public Optional<Doctor> getDoctorInfo(@PathVariable Long id) {
        return doctorService.getDoctorById(id);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<String> updateProfile(@RequestBody Doctor doctor) {
        Optional<Doctor> oldDoc = doctorService.getDoctorById(doctor.getId());
        if(oldDoc.isPresent()){
            Doctor updatedDoc = oldDoc.get();
            updatedDoc.setEmail(doctor.getEmail());
            updatedDoc.setGender(doctor.getGender());
            updatedDoc.setImage(doctor.getImage());
            updatedDoc.setFirstName(doctor.getFirstName());
            updatedDoc.setLastName(doctor.getLastName());
            updatedDoc.setJoinDate(doctor.getJoinDate());
            updatedDoc.setLicenseNumber(doctor.getLicenseNumber());
            // TODO : DO THIS
//            updatedDoc.setPassword();
            updatedDoc.setPhoneNumber(doctor.getPhoneNumber());
            updatedDoc.setSpecialisation(doctor.getSpecialisation());
            updatedDoc.setRetirementDate(doctor.getRetirementDate());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor not found");
        }
    }

    // WARD

    @GetMapping("{doc_id}/view-ward")
    public ResponseEntity<List<Patient_Register>> viewWardList(@PathVariable Long doc_id) {
        if(doctorService.getDoctorById(doc_id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<Patient_Register> register = doctorService.getAllPatientRegister(doc_id);
        if(register == null) {
            return ResponseEntity.noContent().build();
        } else return ResponseEntity.ok().body(register);
    }

    @GetMapping("{doc_id}/view-ward/{id}")
    public ResponseEntity<Patient_Register> viewWard(@PathVariable Long doc_id, @PathVariable Long id) {
        if(doctorService.getDoctorById(doc_id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(doctorService.getPatientRegister(id).orElse(null));
    }


    // PATIENT

    @GetMapping("{doc_id}/view-patient/")
    public ResponseEntity<List<Patient>> viewPatients(@PathVariable Long doc_id) {
        if(doctorService.getDoctorById(doc_id).isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(doctorService.getPatients(doc_id));
    }

    @GetMapping("{doc_id}/view-patient/{pat_id}")
    public ResponseEntity<Patient> viewPatient(@PathVariable Long doc_id, @PathVariable Long pat_id) {
        if(doctorService.getDoctorById(doc_id).isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(doctorService.getPatient(pat_id).orElse(null));
    }


    // REPORTS

    // TODO: REPORTS PUBLIC OR PRIVATE?
    // TODO: proper error for if not found doctor and if not found report
    @GetMapping("{doc_id}/view-report/{rep_id}")
    public ResponseEntity<Report> viewReport(@PathVariable Long doc_id, @PathVariable Long rep_id) {
        if(doctorService.getDoctorById(doc_id).isEmpty()){
            return ResponseEntity.notFound().build();
        }
        Optional<Report> rep = doctorService.getReport(rep_id);
        return rep.map(report -> ResponseEntity.ok().body(report)).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("{doc_id}/view-report/")
    public ResponseEntity<List<Report>> viewReports(@PathVariable Long doc_id) {
        if(doctorService.getDoctorById(doc_id).isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(doctorService.getAllReports(doc_id));
    }


    @GetMapping("{doc_id}/view-report/ward/{reg_id}")
    public ResponseEntity<List<Report>> viewReportsOfWard(@PathVariable Long doc_id, @PathVariable Long reg_id) {
        if(doctorService.getDoctorById(doc_id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(doctorService.getReportsByWard(reg_id));
    }

    @GetMapping("{doc_id}/view-report/patient/{pat_id}")
    public ResponseEntity<List<Report>> viewReportsOfPatient(@PathVariable Long doc_id, @PathVariable Long pat_id) {
        if(doctorService.getDoctorById(doc_id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(doctorService.getReportsByPatient(pat_id));
    }

    @PostMapping("/create-report")
    public ResponseEntity<String> createPatientReport(@RequestBody Report report) {
        if(doctorService.getDoctorById(report.getDoctor().getId()).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        doctorService.createReport(report);
        return ResponseEntity.ok().body("Report created successfully");
    }

    // ================== COMPLAINTS ==================

    @GetMapping("/{doc_id}/complaints")
    public ResponseEntity<List<Complaint>> getComplaints(@PathVariable Long doc_id) {
        if (doctorService.getDoctorById(doc_id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(doctorService.getComplaints(doc_id));
    }

    @PutMapping("/complaints/{comp_id}/address")
    public ResponseEntity<String> addressComplaint(@PathVariable Long comp_id) {
        doctorService.addressComplaint(comp_id);
        return ResponseEntity.ok("Complaint has been addressed successfully.");
    }

    // ================== FOLLOW-UPS ==================

    @GetMapping("/{doc_id}/followups")
    public ResponseEntity<List<Followup>> getFollowups(@PathVariable Long doc_id) {
        if (doctorService.getDoctorById(doc_id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(doctorService.getFollowups(doc_id));
    }

    @PostMapping("/followups")
    public ResponseEntity<String> registerFollowup(@RequestBody Followup followup) {
        doctorService.registerFollowup(followup);
        return ResponseEntity.ok("Follow-up registered successfully.");
    }

    // ================== REMARKS ==================

    @GetMapping("/{doc_id}/remarks")
    public ResponseEntity<List<Remark>> getRemarks(@PathVariable Long doc_id) {
        if (doctorService.getDoctorById(doc_id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(doctorService.getRemarks(doc_id));
    }

    @GetMapping("/{doc_id}/remarks/{pat_id}")
    public ResponseEntity<List<Remark>> getFilteredRemarksByPatient(
            @PathVariable Long doc_id, @PathVariable Long pat_id) {
        if (doctorService.getDoctorById(doc_id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(doctorService.getFilteredRemarksByPatientId(doc_id, pat_id));
    }


}
