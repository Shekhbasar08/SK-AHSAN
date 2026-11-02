package com.kaamconnect.notification;

import com.kaamconnect.booking.Booking;
import com.kaamconnect.booking.BookingStatus;
import com.kaamconnect.worker.WorkerProfile;
import com.kaamconnect.user.User;
import com.kaamconnect.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public void notifyWorker(WorkerProfile worker, Booking booking) {
        create(worker.getUser().getId(), "New Booking Request",
                "New " + booking.getCategory().getName() + " booking on " + booking.getDate() + " ("
                        + booking.getTimeSlot() + ").");
    }

    public void notifyCustomer(Booking booking, BookingStatus status) {
        String message = switch (status) {
            case ACCEPTED -> booking.getWorker().getUser().getName() + " accepted your booking.";
            case REJECTED -> booking.getWorker().getUser().getName() + " could not accept your booking.";
            case ON_THE_WAY -> booking.getWorker().getUser().getName() + " is on the way.";
            case IN_PROGRESS -> "Work has started at your location.";
            case COMPLETED -> "Job completed. Please pay and rate your experience.";
            case CANCELLED -> "Your booking has been cancelled.";
            default -> "Booking status updated to " + status + ".";
        };
        create(booking.getCustomer().getId(), "Booking " + status, message);
    }

    public void create(Long userId, String title, String message) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setTitle(title);
        n.setMessage(message);
        n.setCreatedAt(LocalDate.now());
        n.setRead(false);
        notificationRepository.save(n);
    }

    public java.util.List<Notification> forUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
