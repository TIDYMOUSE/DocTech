package com.example.DocTech.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

// TODO: NOT NULL FOR ALL ENTITIES!!!!!!!

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Doctor {

    public enum Specialisation {
        Cardiologist,
        Dermatologist,
        Gynaecologist,
        Oncologist,
        Ophthalmologist,
        Pathologist,
        Pediatrician,
        Psychiatrist
    }

    public enum Gender {
        Male,
        Female,
        Polygender,
        Genderfluid,
        Other
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "doctor_id")
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "specialisation", nullable = false)
    private Specialisation specialisation;

    @Column(nullable = false)
    private String password;

    @Column(name = "join_date", nullable = false)
    private LocalDate joinDate;

    @Column(name = "retirement_date")
    private LocalDate retirementDate;


    private Float rating;
    private byte[] image;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "email", unique = true)
    private String email;

    @Column(unique = true)
    private String licenseNumber;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @OneToMany(mappedBy = "doctor", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Patient_Register> patientRegister;

    @OneToMany(mappedBy = "doctor", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Report> reports;

    @OneToMany(mappedBy = "doctor", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Followup> followups;

    @OneToMany(mappedBy = "doctor", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Remark>  remarks;

    @OneToMany(mappedBy = "doctor", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Complaint> complaints;


}
