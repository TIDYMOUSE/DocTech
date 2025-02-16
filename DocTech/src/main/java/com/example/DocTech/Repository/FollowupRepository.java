package com.example.DocTech.Repository;

import com.example.DocTech.Model.Followup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowupRepository extends JpaRepository<Followup, Long> {

    List<Followup> findByDoctor_IdOrderByFollowupDateDesc(Long doctorId);

    List<Followup> findByPatient_IdOrderByFollowupDateDesc(Long patientId);
}
