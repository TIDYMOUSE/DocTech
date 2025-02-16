package com.example.DocTech.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
public class Followup {

    public enum Status {
        Pending,
        Missed,
        Acheived
    }

    @Id
    @GeneratedValue(strategy =  GenerationType.AUTO)
    @Column(name = "followup_id")
    private Long id;

    private LocalDate followupDate;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "registration_id", referencedColumnName = "registration_id")
    private Patient_Register register;

    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToOne(mappedBy = "followup")
    private Report report;

}
