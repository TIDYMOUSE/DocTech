package com.example.DocTech.Model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Data
public class Patient {

    public enum Gender {
        Male,
        Female
    }

    @Getter
    @AllArgsConstructor
    public enum BloodGroup {
        A_POSITIVE("A+"),
        A_NEGATIVE("A-"),
        B_POSITIVE("B+"),
        B_NEGATIVE("B-"),
        O_POSITIVE("O+"),
        O_NEGATIVE("O-"),
        AB_POSITIVE("AB+"),
        AB_NEGATIVE("AB-");

        private final String label;

        public static BloodGroup fromLabel(String label) {
            for (BloodGroup bg : values()) {
                if (bg.label.equals(label)) {
                    return bg;
                }
            }
            throw new IllegalArgumentException("Unknown blood group: " + label);
        }
    }


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "patient_id")
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;


    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "dob", nullable = false)
    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "height", nullable = false, precision = 5, scale = 2)
    private BigDecimal height;

    @Column(name = "weight", nullable = false, precision = 5, scale = 2)
    private BigDecimal weight;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group")
    private BloodGroup bloodGroup;

    @Column(name= "number", nullable = false)
    private Integer number;

    @Column(unique = true)
    private String email;
    private Integer emergencyNumber;
    private String address;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column(unique = true)
    private String aadhar;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY)
    private List<Report> reports;

    @OneToOne(mappedBy = "patient")
    private Patient_Register patientRegister;

    @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY)
    private List<Followup>  followups;

    @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY)
    private List<Remark>  remarks;

    @OneToMany(mappedBy = "patient", fetch = FetchType.LAZY)
    private List<Complaint> complaints;
}
