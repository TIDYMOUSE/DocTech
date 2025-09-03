package com.example.DocTech.Config;

import com.example.DocTech.Service.CustomUserDetailsService;
import com.example.DocTech.Service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.AuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            System.out.println("\n===== JWT FILTER START =====");
            final String authHeader = request.getHeader("Authorization");
            System.out.println("Authorization Header: " + authHeader);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("No JWT token found or incorrect format");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                filterChain.doFilter(request, response);
                return;
            }

            final String jwt = authHeader.substring(7);
            System.out.println("Extracted JWT: " + jwt);

            final String userEmail = jwtService.extractEmail(jwt);
            final String userRole = jwtService.extractRole(jwt);
            System.out.println("Decoded Email: " + userEmail);
            System.out.println("Decoded Role: " + userRole);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                System.out.println("Loaded User Details: " + userDetails.getUsername());

                if (jwtService.validateToken(jwt, userDetails.getUsername())) {
                    System.out.println("JWT Token is valid!");

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    System.out.println("User authenticated: " + userDetails.getUsername());
                    System.out.println("Authorities: " + userDetails.getAuthorities());
                } else {
                    System.out.println("JWT Token is invalid or expired");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                }
            }

        } catch (Exception e) {
            System.out.println("Exception in JwtAuthenticationFilter: " + e.getMessage());
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }

        System.out.println("===== JWT FILTER END =====\n");
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/auth/");
    }

}
