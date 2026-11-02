package com.kaamconnect.payment;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/{bookingId}/pay")
    public Payment pay(@PathVariable Long bookingId, @RequestBody Map<String, String> body) {
        Payment.PaymentMethod method = Payment.PaymentMethod.valueOf(
                body.getOrDefault("method", "CARD").toUpperCase());
        return paymentService.pay(bookingId, method);
    }

    @GetMapping
    public List<Payment> history() {
        return paymentService.history();
    }
}
