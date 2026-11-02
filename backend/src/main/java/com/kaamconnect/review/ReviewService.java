package com.kaamconnect.review;

import com.kaamconnect.booking.Booking;
import com.kaamconnect.booking.BookingRepository;
import com.kaamconnect.booking.BookingStatus;
import com.kaamconnect.common.ApiException;
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
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final WorkerProfileRepository workerRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public List<Review> forWorker(Long workerId) {
        return reviewRepository.findByWorkerId(workerId);
    }

    @Transactional
    public Review create(String customerEmail, Long workerId, int rating, String comment) {
        if (rating < 1 || rating > 5) {
            throw ApiException.badRequest("Rating must be between 1 and 5");
        }
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> ApiException.notFound("Customer not found"));
        WorkerProfile worker = workerRepository.findById(workerId)
                .orElseThrow(() -> ApiException.notFound("Worker not found"));

        // only customers with a completed booking can review
        boolean hasCompleted = bookingRepository.findByCustomerId(customer.getId()).stream()
                .anyMatch(b -> b.getWorker().getId().equals(workerId) && b.getStatus() == BookingStatus.COMPLETED);
        if (!hasCompleted) {
            throw ApiException.forbidden("You can only review workers after a completed booking");
        }

        Review review = new Review();
        review.setWorker(worker);
        review.setCustomer(customer);
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(LocalDate.now());
        Review saved = reviewRepository.save(review);

        double newRating = (worker.getRating() * worker.getReviewCount() + rating) / (worker.getReviewCount() + 1);
        worker.setRating(Math.round(newRating * 10) / 10.0);
        worker.setReviewCount(worker.getReviewCount() + 1);
        workerRepository.save(worker);
        return saved;
    }
}
