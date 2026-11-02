package com.kaamconnect.booking;

import com.kaamconnect.service.ServiceCategory;
import com.kaamconnect.worker.WorkerProfile;
import com.kaamconnect.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private WorkerProfile worker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ServiceCategory category;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 40)
    private String timeSlot;

    @Column(length = 255)
    private String address;

    @Column(length = 80)
    private String city;

    @Column(length = 1000)
    private String notes;

    private double basePrice;
    private double serviceFee;
    private double total;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private boolean rescheduled;

    @Column(name = "created_at", updatable = false)
    private LocalDate createdAt;
}
