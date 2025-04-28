package com.example.DocTech.Model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginRequest {
    private String email;
    private String password;
    private String userType; // DOCTOR or PATIENT
}
