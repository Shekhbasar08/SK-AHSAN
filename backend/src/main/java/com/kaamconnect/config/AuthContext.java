package com.kaamconnect.config;

import com.kaamconnect.user.AppUserDetails;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
public class AuthContext {

    public static AppUserDetails currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof AppUserDetails details) {
            return details;
        }
        return null;
    }
}
