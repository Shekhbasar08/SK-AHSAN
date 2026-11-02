package com.kaamconnect.admin;

import com.kaamconnect.booking.Booking;
import com.kaamconnect.booking.BookingRepository;
import com.kaamconnect.common.ApiException;
import com.kaamconnect.payment.Payment;
import com.kaamconnect.payment.PaymentRepository;
import com.kaamconnect.user.User;
import com.kaamconnect.user.UserRepository;
import com.kaamconnect.worker.WorkerProfile;
import com.kaamconnect.worker.WorkerProfileRepository;
import com.kaamconnect.worker.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final WorkerProfileRepository workerRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final WorkerService workerService;

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalWorkers", workerRepository.count());
        stats.put("totalBookings", bookingRepository.count());
        stats.put("revenue", paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.PAID)
                .mapToDouble(Payment::getAmount).sum());
        return stats;
    }

    @GetMapping("/users")
    public List<User> users() {
        return userRepository.findAll();
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id))
            throw ApiException.notFound("User not found");
        userRepository.deleteById(id);
    }

    @GetMapping("/workers")
    public List<WorkerProfile> workers() {
        return workerRepository.findAll();
    }

    @PutMapping("/workers/{id}/verify")
    public WorkerProfile verifyWorker(@PathVariable Long id, @RequestParam boolean verified) {
        return workerService.setVerified(id, verified);
    }

    @GetMapping("/bookings")
    public List<Booking> bookings() {
        return bookingRepository.findAll();
    }

    @GetMapping("/payments")
    public List<Payment> payments() {
        return paymentRepository.findAll();
    }
}
