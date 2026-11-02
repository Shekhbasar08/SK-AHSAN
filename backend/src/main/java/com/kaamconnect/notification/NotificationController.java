package com.kaamconnect.notification;

import com.kaamconnect.common.ApiException;
import com.kaamconnect.user.User;
import com.kaamconnect.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<Notification> myNotifications(@AuthenticationPrincipal UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> ApiException.notFound("User not found"));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }
}
