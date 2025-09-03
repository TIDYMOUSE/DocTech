package com.example.DocTech.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@NoArgsConstructor
@Data
@Entity
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "report_id")
    private Integer id;

    private String diagnosis;
    private String tests;
    private String medication;

    private Boolean followupRequired;

    private String remarks;

    @CreatedDate
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "registration_id", referencedColumnName = "registration_id")
    private Patient_Register register;

    @OneToOne
    @JoinColumn(name = "followup_id", referencedColumnName = "followup_id")
    @JsonBackReference
    private Followup followup;

}
