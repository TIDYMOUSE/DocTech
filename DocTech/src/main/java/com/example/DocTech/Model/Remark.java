package com.example.DocTech.Model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Collate;

import java.time.LocalDate;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Remark {

    public enum Flag {
        CRITICAL,
        ABNORMAL,
        NORMAL
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "remark_id")
    private Long id;


    @Column(nullable = false)
    private LocalDate timestamp;

    @Column(nullable = false)
    private String readingType;

    @Column(nullable = false)
    private String readingVal;

    @Column(nullable = false)
    private String note;

    @Column(nullable = false)
    private Flag flag;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "registration_id", referencedColumnName = "registration_id")
    private Patient_Register register;

}
