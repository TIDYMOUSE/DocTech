package com.example.DocTech.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient_Register {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "registration_id")
    private Long id;

    @Column(name = "room_no", nullable = false)
    private String roomNo;

    @Column(name = "isadmitted", nullable = false)
    private boolean isAdmitted;

    @Column(updatable = false)
    private LocalDateTime admissionDate;

    private LocalDateTime dischargeDate;

    @ManyToOne
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id")
    private Doctor doctor;

    @OneToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id")
    private Patient patient;

    private String bedNumber;

    @OneToMany(mappedBy = "register", fetch = FetchType.LAZY)
    private List<Report> reports;

    @OneToMany(mappedBy = "register", fetch = FetchType.LAZY)
    private List<Followup>  followups;

    @OneToMany(mappedBy = "register", fetch = FetchType.LAZY)
    private List<Remark>  remarks;

    @OneToMany(mappedBy = "patientRegister", fetch = FetchType.LAZY)
    private List<Complaint> complaints;
}
