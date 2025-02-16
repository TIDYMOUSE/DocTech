package com.example.DocTech.Controller;

import com.example.DocTech.Model.*;
import com.example.DocTech.Service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.List;

@RestController
@RequestMapping("/patient")
@Validated
public class PatientController {

    private final PatientService patientService;


    PatientController(
            PatientService patientService

    ){
        this.patientService = patientService;
    }


    @GetMapping("/profile/{pat_id}")
    public ResponseEntity<Patient> getPatientProfile(@PathVariable Long pat_id) {
        if(patientService.getPatientById(pat_id).isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(patientService.getPatientById(pat_id).get());
    }

    @GetMapping("/{pat_id}/ward")
    public ResponseEntity<Patient_Register> getPatientWard(@PathVariable Long pat_id) {
        if(patientService.getPatientById(pat_id).isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(patientService.getWard(pat_id));
    }


    @GetMapping("/{pat_id}/reports")
    public ResponseEntity<List<Report>> getReports(@PathVariable Long pat_id) {
        if(patientService.getPatientById(pat_id).isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(patientService.getReports(pat_id));
    }

    @GetMapping("/{pat_id}/report/{rep_id}")
    public ResponseEntity<Report> getReport(@PathVariable Long pat_id, @PathVariable Long rep_id) {
        if(patientService.getPatientById(pat_id).isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return patientService.getReport(rep_id).map(report -> ResponseEntity.ok().body(report)).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{pat_id}/doctor/{doc_id}")
    public ResponseEntity<Doctor> getDoctorInfo(@PathVariable Long pat_id, @PathVariable Long doc_id) {
        if(patientService.getPatientById(pat_id).isEmpty()){
            return ResponseEntity.notFound().build();
        }
        // ERROR DOCNOT FOUND
        return ResponseEntity.ok().body(patientService.getDoctor(doc_id).orElse(null));
    }


    @PostMapping("/{pat_id}/doctor/{doc_id}/rate")
    public ResponseEntity<String> rateDoctor(@PathVariable Long pat_id, @PathVariable Long doc_id, @RequestBody Float rating) {
        if(patientService.getPatientById(pat_id).isEmpty()){
            return ResponseEntity.notFound().build();
        }
        patientService.rateDoctor(rating, doc_id);
        return ResponseEntity.ok().body("Successfully rated the doctor!");
    }

    @DeleteMapping("/{pat_id}/patient/delete")
    public ResponseEntity<String> deletePatient(@PathVariable Long pat_id){
        if(patientService.getPatientById(pat_id).isEmpty()){
            return ResponseEntity.notFound().build();
        }
        patientService.deletePatient(pat_id);
        return ResponseEntity.ok().body("Deleted the patient successfully");
    }

    @PostMapping("/{pat_id}/report/")
    public ResponseEntity<String> registerDoctorComplain(@PathVariable Long pat_id, @RequestBody Complaint complaint) {
        if(patientService.getPatientById(pat_id).isEmpty()){
            return ResponseEntity.notFound().build();
        }
        patientService.reportDoctor(complaint);
        return ResponseEntity.ok().body("Doctor reported successfully");
    }

    // Complaints
    @PostMapping("/{pat_id}/report")
    public ResponseEntity<String> registerDoctorComplaint(@PathVariable Long pat_id, @RequestBody Complaint complaint) {
        if (patientService.getPatientById(pat_id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        patientService.reportDoctor(complaint);
        return ResponseEntity.ok("Doctor reported successfully.");
    }

    // Follow-ups
    @GetMapping("/{pat_id}/followups")
    public ResponseEntity<List<Followup>> getFollowups(@PathVariable Long pat_id) {
        if (patientService.getPatientById(pat_id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(patientService.getFollowups(pat_id));
    }

    @PostMapping("/{pat_id}/followups")
    public ResponseEntity<String> requestFollowup(@PathVariable Long pat_id, @RequestBody Followup followup) {
        if (patientService.getPatientById(pat_id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        patientService.requestFollowup(followup);
        return ResponseEntity.ok("Follow-up requested successfully.");
    }

    // Remarks
    @GetMapping("/{pat_id}/remarks")
    public ResponseEntity<List<Remark>> getRemarks(@PathVariable Long pat_id) {
        if (patientService.getPatientById(pat_id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(patientService.getRemarks(pat_id));
    }

    @GetMapping("/{pat_id}/remarks/{doc_id}")
    public ResponseEntity<List<Remark>> getFilteredRemarksByDoctor(@PathVariable Long pat_id, @PathVariable Long doc_id) {
        if (patientService.getPatientById(pat_id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(patientService.getFilteredRemarksByDoctorId(pat_id, doc_id));
    }


}
