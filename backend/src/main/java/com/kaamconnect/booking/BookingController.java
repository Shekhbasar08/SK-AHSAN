package com.kaamconnect.booking;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> create(@AuthenticationPrincipal UserDetails principal,
            @RequestBody BookingDtos.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.create(principal.getUsername(), request));
    }

    @GetMapping("/my")
    public List<Booking> myBookings(@AuthenticationPrincipal UserDetails principal) {
        return bookingService.forCustomer(principal.getUsername());
    }

    @GetMapping("/worker")
    public List<Booking> workerBookings(@AuthenticationPrincipal UserDetails principal) {
        return bookingService.forWorkerByEmail(principal.getUsername());
    }

    @PutMapping("/{id}/status")
    public Booking updateStatus(@PathVariable Long id, @RequestBody BookingDtos.StatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails principal) {
        return bookingService.updateStatus(id, principal.getUsername(),
                BookingStatus.valueOf(request.getStatus()));
    }

    @PutMapping("/{id}/reschedule")
    public Booking reschedule(@PathVariable Long id, @RequestBody BookingDtos.RescheduleRequest request) {
        return bookingService.reschedule(id, request);
    }
}
