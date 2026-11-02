package com.kaamconnect.worker;

import com.kaamconnect.common.ApiException;
import com.kaamconnect.service.ServiceCategory;
import com.kaamconnect.service.ServiceCategoryRepository;
import com.kaamconnect.user.User;
import com.kaamconnect.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerProfileRepository workerRepository;
    private final UserRepository userRepository;
    private final ServiceCategoryRepository categoryRepository;

    public List<WorkerProfile> search(Long categoryId, String city) {
        List<WorkerProfile> result = workerRepository.findAll();
        if (categoryId != null) {
            result = result.stream().filter(w -> w.getCategory() != null && w.getCategory().getId().equals(categoryId))
                    .toList();
        }
        if (city != null && !city.isBlank()) {
            result = result.stream().filter(w -> w.getCity() != null && w.getCity().equalsIgnoreCase(city)).toList();
        }
        return result;
    }

    public WorkerProfile getById(Long id) {
        return workerRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Worker not found"));
    }

    public WorkerProfile getByUserId(Long userId) {
        return workerRepository.findByUserId(userId)
                .orElseThrow(() -> ApiException.notFound("Worker profile not found"));
    }

    public WorkerProfile createProfile(Long userId, WorkerDtos.CreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found"));
        if (workerRepository.findByUserId(userId).isPresent()) {
            throw ApiException.badRequest("Worker profile already exists");
        }
        WorkerProfile profile = new WorkerProfile();
        profile.setUser(user);
        if (request.getCategoryId() != null) {
            ServiceCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> ApiException.notFound("Category not found"));
            profile.setCategory(category);
        }
        profile.setSkills(request.getSkills());
        profile.setExperienceYears(request.getExperienceYears());
        profile.setHourlyRate(request.getHourlyRate());
        profile.setVisitCharge(request.getVisitCharge());
        profile.setCity(request.getCity());
        profile.setArea(request.getArea());
        profile.setBio(request.getBio());
        profile.setPhotoUrl(request.getPhotoUrl());
        profile.setRating(0);
        profile.setReviewCount(0);
        profile.setCompletedJobs(0);
        profile.setVerified(false);
        return workerRepository.save(profile);
    }

    public WorkerProfile update(Long id, WorkerDtos.UpdateRequest request) {
        WorkerProfile profile = getById(id);
        if (request.getHourlyRate() != null)
            profile.setHourlyRate(request.getHourlyRate());
        if (request.getVisitCharge() != null)
            profile.setVisitCharge(request.getVisitCharge());
        if (request.getBio() != null)
            profile.setBio(request.getBio());
        if (request.getAvailableToday() != null)
            profile.setAvailableToday(request.getAvailableToday());
        if (request.getSkills() != null)
            profile.setSkills(request.getSkills());
        return workerRepository.save(profile);
    }

    public WorkerProfile setVerified(Long id, boolean verified) {
        WorkerProfile profile = getById(id);
        profile.setVerified(verified);
        return workerRepository.save(profile);
    }
}
