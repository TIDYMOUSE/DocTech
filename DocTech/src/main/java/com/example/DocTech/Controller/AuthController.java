package com.example.DocTech.Controller;


import com.example.DocTech.Model.Doctor;
import com.example.DocTech.Model.LoginRequest;
import com.example.DocTech.Model.LoginResponse;
import com.example.DocTech.Repository.DoctorRepository;
import com.example.DocTech.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.webauthn.api.AuthenticatorResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Base64;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

//    @PostMapping("/login")
//    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
//        Authentication authenticationRequest = UsernamePasswordAuthenticationToken.unauthenticated(loginRequest.email(), loginRequest.password());
//        Authentication authenticationResponse = this.authenticationManager.authenticate(authenticationRequest);
//
//        if(authenticationResponse.isAuthenticated()){
//            return ResponseEntity.ok("LOGIN SUCCESSFUL");
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
//        }
//
//    }
//
//    @PostMapping("/register")
//    public ResponseEntity<String> register(@RequestBody DoctorRegisterRequest registerRequest) {
//        if(doctorRepository.findByEmail(registerRequest.email()).isPresent()) {
//            return ResponseEntity.status(HttpStatus.SEE_OTHER).body("Email already exists, please login");
//        }
//
//        byte[] imageBytes = registerRequest.image().map(image -> Base64.getDecoder().decode(image)).orElse(null);
//
//        Doctor doc = Doctor.builder()
//                .firstName(registerRequest.firstName())
//                .lastName(registerRequest.lastName())
//                .specialisation(registerRequest.specialisation())
//                .password(passwordEncoder.encode(registerRequest.password()))
//                .joinDate(registerRequest.joinDate())
//                .retirementDate(registerRequest.retirementDate().orElse(null))
//                .rating((float) 0.0)
//                .image(imageBytes)
//                .gender(registerRequest.gender())
//                .email(registerRequest.email())
//                .phoneNumber(registerRequest.phoneNumber())
//                .build();
//
//        doctorRepository.save(doc);
//        return ResponseEntity.status(HttpStatus.CREATED).body("Successful registration");
//    }
//
//    public record LoginRequest(String email, String password) {}
//    public record DoctorRegisterRequest(
//            String email,
//            String password,
//            String firstName,
//            String lastName,
//            Doctor.Specialisation specialisation,
//            LocalDate joinDate,
//            Doctor.Gender gender,
//            String phoneNumber,
//            Optional<LocalDate> retirementDate,
//            Optional<byte[]> image
//    ) {}

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/registerDoctor")
    public ResponseEntity<String> registerDoc(@RequestBody AuthService.DoctorRegisterRequest doctorRegisterRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerDoctor(doctorRegisterRequest));
    }

    @PostMapping("/registerPatient")
    public ResponseEntity<String> registerPat(@RequestBody AuthService.PatientRegisterRequest patientRegisterRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerPatient(patientRegisterRequest));
    }
}
