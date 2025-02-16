package com.example.DocTech.Repository;

import com.example.DocTech.Model.Patient_Register;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRegisterRepository extends JpaRepository<Patient_Register, Long> {


}
