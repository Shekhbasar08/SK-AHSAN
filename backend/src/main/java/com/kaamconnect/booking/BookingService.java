package com.kaamconnect.booking;

import com.kaamconnect.common.ApiException;
import com.kaamconnect.notification.NotificationService;
import com.kaamconnect.service.ServiceCategory;
import com.kaamconnect.service.ServiceCategoryRepository;
import com.kaamconnect.user.User;
import com.kaamconnect.user.UserRepository;
import com.kaamconnect.worker.WorkerProfile;
import com.kaamconnect.worker.WorkerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private static final double PLATFORM_FEE = 49.0;

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final WorkerProfileRepository workerRepository;
    private final ServiceCategoryRepository categoryRepository;
    private final NotificationService notificationService;

    @Transactional
    public Booking create(String customerEmail, BookingDtos.CreateRequest request) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> ApiException.notFound("Customer not found"));
        WorkerProfile worker = workerRepository.findById(request.getWorkerId())
                .orElseThrow(() -> ApiException.notFound("Worker not found"));

        LocalDate date = LocalDate.parse(request.getDate());
        if (date.isBefore(LocalDate.now())) {
            throw ApiException.badRequest("Booking date cannot be in the past");
        }
        if (worker.getCategory() == null) {
            throw ApiException.badRequest("Worker has no service category configured");
        }

        // Prevent double booking of the same worker for the same slot
        List<BookingStatus> blocking = List.of(BookingStatus.PENDING, BookingStatus.ACCEPTED,
                BookingStatus.ON_THE_WAY, BookingStatus.IN_PROGRESS);
        List<Booking> clashes = bookingRepository
                .findByWorkerIdAndDateAndTimeSlotAndStatusIn(worker.getId(), date, request.getTimeSlot(), blocking);
        if (!clashes.isEmpty()) {
            throw ApiException.badRequest("This time slot is already booked. Please choose another slot.");
        }

        ServiceCategory category = worker.getCategory();
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setWorker(worker);
        booking.setCategory(category);
        booking.setDate(date);
        booking.setTimeSlot(request.getTimeSlot());
        booking.setAddress(request.getAddress());
        booking.setCity(request.getCity());
        booking.setNotes(request.getNotes());
        double base = worker.getHourlyRate() * Math.max(1, request.getHours()) + worker.getVisitCharge();
        booking.setBasePrice(base);
        booking.setServiceFee(PLATFORM_FEE);
        booking.setTotal(base + PLATFORM_FEE);
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDate.now());

        Booking saved = bookingRepository.save(booking);
        notificationService.notifyWorker(worker, saved);
        return saved;
    }

    public List<Booking> forCustomer(String email) {
        User customer = userRepository.findByEmail(email)
                .orElseThrow(() -> ApiException.notFound("Customer not found"));
        return bookingRepository.findByCustomerId(customer.getId());
    }

    public List<Booking> forWorker(Long userId) {
        WorkerProfile worker = workerRepository.findByUserId(userId)
                .orElseThrow(() -> ApiException.notFound("Worker profile not found"));
        return bookingRepository.findByWorkerId(worker.getId());
    }

    public List<Booking> all() {
        return bookingRepository.findAll();
    }

    public List<Booking> forWorkerByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> ApiException.notFound("User not found"));
        WorkerProfile worker = workerRepository.findByUserId(user.getId())
                .orElseThrow(() -> ApiException.notFound("Worker profile not found"));
        return bookingRepository.findByWorkerId(worker.getId());
    }

    @Transactional
    public Booking updateStatus(Long bookingId, String email, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> ApiException.notFound("Booking not found"));
        booking.setStatus(newStatus);
        Booking saved = bookingRepository.save(booking);
        notificationService.notifyCustomer(booking, newStatus);
        return saved;
    }

    @Transactional
    public Booking reschedule(Long bookingId, BookingDtos.RescheduleRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> ApiException.notFound("Booking not found"));
        LocalDate date = LocalDate.parse(request.getDate());
        List<BookingStatus> blocking = List.of(BookingStatus.PENDING, BookingStatus.ACCEPTED,
                BookingStatus.ON_THE_WAY, BookingStatus.IN_PROGRESS);
        List<Booking> clashes = bookingRepository.findByWorkerIdAndDateAndTimeSlotAndStatusIn(
                booking.getWorker().getId(), date, request.getTimeSlot(), blocking);
        if (!clashes.isEmpty() && clashes.stream().noneMatch(b -> b.getId().equals(booking.getId()))) {
            throw ApiException.badRequest("Worker is already booked for that slot.");
        }
        booking.setDate(date);
        booking.setTimeSlot(request.getTimeSlot());
        booking.setRescheduled(true);
        return bookingRepository.save(booking);
    }
}
