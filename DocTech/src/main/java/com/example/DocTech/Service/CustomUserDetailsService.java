package com.example.DocTech.Service;

import com.example.DocTech.Model.CustomUserDetails;
import com.example.DocTech.Model.Doctor;
import com.example.DocTech.Model.Patient;
import com.example.DocTech.Repository.DoctorRepository;
import com.example.DocTech.Repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return doctorRepository.findByEmail(email)
                .map(doc -> new CustomUserDetails(doc.getEmail(), doc.getPassword(), "DOCTOR"))
                .orElseGet(() -> patientRepository.findByEmail(email)
                        .map(pat -> new CustomUserDetails(pat.getEmail(), pat.getPassword(), "PATIENT"))
                        .orElseThrow(() -> new UsernameNotFoundException("User does not exist")));
    }
}
