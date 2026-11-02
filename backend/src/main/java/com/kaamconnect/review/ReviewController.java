package com.kaamconnect.review;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/worker/{workerId}")
    public List<Review> forWorker(@PathVariable Long workerId) {
        return reviewService.forWorker(workerId);
    }

    @PostMapping
    public Review create(@AuthenticationPrincipal UserDetails principal, @RequestBody Map<String, Object> body) {
        Long workerId = Long.valueOf(body.get("workerId").toString());
        int rating = Integer.parseInt(body.get("rating").toString());
        String comment = body.getOrDefault("comment", "").toString();
        return reviewService.create(principal.getUsername(), workerId, rating, comment);
    }
}
