package com.example.DocTech.Repository;

import com.example.DocTech.Model.Complaint;
import com.example.DocTech.Model.Doctor;
import com.example.DocTech.Model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.print.Doc;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {


    // algorithm works like: subject: find ... By , predicate: afterBy
    // if for eg: findByAddressZipCode, algorithm matches in following order: addressZipCode (camel-case), address.zipCode
    // i.e. first camel-case, then nested lookup
    // ! DO NOT USE PASCAL CASE IN ENTITY ( IT WILL RESULT IN NO MATCH)
    //  also, if findByUser_Name: user.name   INSTEAD findByUser__Name : user_name
//    Optional<Doctor> findByDoctorId(Long doctor_id);

    List<Doctor> findByFirstName(String firstName);

    Optional<Doctor> findByEmail(String email);

    List<Doctor> findByLastName (String lastName);

    @Query("SELECT p FROM Patient p JOIN Patient_Register pr ON p.id = pr.patient.id WHERE pr.doctor.id = :doctorId")
    List<Patient> findPatientsByDoctorId(@Param("doctorId") Long doctorId);


}
