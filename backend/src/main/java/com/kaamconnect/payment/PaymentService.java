package com.kaamconnect.payment;

import com.kaamconnect.booking.Booking;
import com.kaamconnect.booking.BookingRepository;
import com.kaamconnect.common.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public Payment pay(Long bookingId, Payment.PaymentMethod method) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> ApiException.notFound("Booking not found"));
        Payment payment = paymentRepository.findById(bookingId).orElse(null);
        if (payment == null) {
            payment = new Payment();
            payment.setBooking(booking);
        }
        payment.setAmount(booking.getTotal());
        payment.setMethod(method);
        payment.setStatus(Payment.PaymentStatus.PAID);
        payment.setPaidAt(LocalDate.now());
        return paymentRepository.save(payment);
    }

    public List<Payment> history() {
        return paymentRepository.findAll();
    }
}
