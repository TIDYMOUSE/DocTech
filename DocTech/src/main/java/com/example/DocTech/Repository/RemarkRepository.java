package com.example.DocTech.Repository;

import com.example.DocTech.Model.Remark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RemarkRepository extends JpaRepository<Remark, Long> {

    List<Remark> findByDoctor_IdOrderByTimestampDesc(Long doctorId);

    List<Remark> findByPatient_IdOrderByTimestampDesc(Long patientId);

    List<Remark> findByDoctor_IdAndPatient_IdOrderByTimestampDesc(Long doctorId, Long patientId);

    // TODO: find by firstname, lastname, latest
}
