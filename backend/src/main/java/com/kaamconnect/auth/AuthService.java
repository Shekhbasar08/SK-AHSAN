package com.kaamconnect.auth;

import com.kaamconnect.common.ApiException;
import com.kaamconnect.common.Role;
import com.kaamconnect.security.JwtService;
import com.kaamconnect.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AppUserDetailsService userDetailsService;

    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw ApiException.badRequest("An account with this email already exists");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() == null ? Role.CUSTOMER : request.getRole());
        user.setCreatedAt(LocalDate.now().toString());
        userRepository.save(user);
        return buildResponse(user);
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userDetailsService.getByEmail(request.getEmail());
        return buildResponse(user);
    }

    public void forgotPassword(AuthDtos.ForgotPasswordRequest request) {
        // In production: generate reset token, persist it and send an email link.
        if (!userRepository.existsByEmail(request.getEmail())) {
            // Do not leak account existence.
            return;
        }
    }

    private AuthDtos.AuthResponse buildResponse(User user) {
        UserDetailsAdapter adapter = new UserDetailsAdapter(user);
        String token = jwtService.generateToken(adapter, user.getRole().name());
        AuthDtos.AuthResponse response = new AuthDtos.AuthResponse();
        response.setToken(token);
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        return response;
    }
}
