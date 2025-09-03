package com.example.DocTech.Service;

import com.example.DocTech.Model.Doctor;
import com.example.DocTech.Model.LoginRequest;
import com.example.DocTech.Model.LoginResponse;
import com.example.DocTech.Model.Patient;
import com.example.DocTech.Repository.DoctorRepository;
import com.example.DocTech.Repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        if ("DOCTOR".equals(request.getUserType())) {
            return authenticateDoctor(request);
        } else if ("PATIENT".equals(request.getUserType())) {
            return authenticatePatient(request);
        }
        throw new IllegalArgumentException("Invalid user type: " + request.getUserType());
    }

    public String registerDoctor(DoctorRegisterRequest registerRequest) {
            if (doctorRepository.findByEmail(registerRequest.email()).isPresent()) {
                throw new IllegalArgumentException("Doctor with this email already exists.");
            }
        byte[] imageBytes = null;
        if (registerRequest.image().isPresent() && !registerRequest.image().get().isEmpty()) {
            try {
                String base64Image = registerRequest.image().get();
                imageBytes = Base64.getDecoder().decode(base64Image);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid Base64 image data", e);
            }
        }

        Doctor doc = Doctor.builder()
                .firstName(registerRequest.firstName())
                .lastName(registerRequest.lastName())
                .specialisation(registerRequest.specialisation())
                .password(passwordEncoder.encode(registerRequest.password()))
                .joinDate(registerRequest.joinDate())
                .retirementDate(registerRequest.retirementDate().orElse(null))
                .rating((float) 0.0)
                .image(imageBytes)
                .gender(registerRequest.gender())
                .email(registerRequest.email())
                    .licenseNumber(registerRequest.licenseNumber())
                .phoneNumber(registerRequest.phoneNumber())
                .build();

        Doctor saveDoc = doctorRepository.save(doc);

        return jwtService.generateToken(registerRequest.email(), saveDoc.getId(),"ROLE_DOCTOR"); // C1
    }

    public String registerPatient(PatientRegisterRequest registerRequest) {
        if (patientRepository.findByEmail(registerRequest.email()).isPresent()) {
            throw new IllegalArgumentException("Patient with this email already exists.");
        }
        Patient pat = Patient.builder()
                .firstName(registerRequest.firstName())
                .lastName(registerRequest.lastName())
                .middleName(registerRequest.middleName().orElse(null))
                .dob(registerRequest.dob())
                .gender(registerRequest.gender())
                .height(registerRequest.height())
                .weight(registerRequest.weight())
                .bloodGroup(registerRequest.bloodGroup())
                .number(registerRequest.number())
                .email(registerRequest.email())
                .emergencyNumber(registerRequest.emergencyNumber().orElse(null))
                .address(registerRequest.address().orElse(null))
                .aadhar(registerRequest.aadhar())
                .password(passwordEncoder.encode(registerRequest.password()))
                .build();

        Patient savPat = patientRepository.save(pat);
        return jwtService.generateToken(registerRequest.email(), savPat.getId(), "ROLE_PATIENT");
    }

    private LoginResponse authenticateDoctor(LoginRequest request) {
        Doctor doctor = doctorRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new NoSuchElementException("Doctor not found"));

        String token = jwtService.generateToken(doctor.getEmail(), doctor.getId(), "ROLE_DOCTOR");

        return LoginResponse.builder()
                .token(token)
                .userType("DOCTOR")
                .email(doctor.getEmail())
                .name(doctor.getFirstName() + " " + doctor.getLastName())
                .build();
    }

    private LoginResponse authenticatePatient(LoginRequest request) {
        Patient patient = patientRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new NoSuchElementException("Patient not found"));

        String token = jwtService.generateToken(patient.getEmail(), patient.getId(), "ROLE_PATIENT");

        return LoginResponse.builder()
                .token(token)
                .userType("PATIENT")
                .email(patient.getEmail())
                .name(patient.getFirstName() + " " + patient.getLastName())
                .build();
    }

    public record DoctorRegisterRequest(
            String email,
            String password,
            String firstName,
            String lastName,
            Doctor.Specialisation specialisation,
            LocalDate joinDate,
            Doctor.Gender gender,
            String phoneNumber,
            String licenseNumber,
            Optional<LocalDate> retirementDate,
            Optional<String> image
    ) {}

    public record PatientRegisterRequest(
            String email,
            String password,
            String firstName,
            Optional<String> middleName,
            String lastName,
            LocalDate dob,
            Patient.Gender gender,
            BigDecimal height,
            BigDecimal weight,
            Patient.BloodGroup bloodGroup,
            String number,
            Optional<String> emergencyNumber,
            Optional<String> address,
            String aadhar
    ) {}
}
