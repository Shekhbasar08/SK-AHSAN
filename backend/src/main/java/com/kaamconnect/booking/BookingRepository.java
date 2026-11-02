package com.kaamconnect.booking;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(Long customerId);

    List<Booking> findByWorkerId(Long workerId);

    List<Booking> findByWorkerIdAndDateAndTimeSlotAndStatusIn(Long workerId, LocalDate date, String timeSlot,
            List<BookingStatus> statuses);

    List<Booking> findByStatus(BookingStatus status);
}
