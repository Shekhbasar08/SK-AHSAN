package com.kaamconnect.auth;

import com.kaamconnect.common.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

public class AuthDtos {

    @Getter
    @Setter
    public static class RegisterRequest {
        @NotBlank
        private String name;
        @NotBlank
        @Email
        private String email;
        @NotBlank
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;
        @NotBlank
        @Pattern(regexp = "^[0-9+\\s-]{10,15}$", message = "Invalid phone number")
        private String phone;
        private Role role;
    }

    @Getter
    @Setter
    public static class LoginRequest {
        @NotBlank
        @Email
        private String email;
        @NotBlank
        private String password;
    }

    @Getter
    @Setter
    public static class ForgotPasswordRequest {
        @NotBlank
        @Email
        private String email;
    }

    @Getter
    @Setter
    public static class AuthResponse {
        private String token;
        private Long id;
        private String name;
        private String email;
        private String phone;
        private Role role;
    }
}
