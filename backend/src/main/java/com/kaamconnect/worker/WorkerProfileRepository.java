package com.kaamconnect.worker;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkerProfileRepository extends JpaRepository<WorkerProfile, Long> {
    Optional<WorkerProfile> findByUserId(Long userId);

    List<WorkerProfile> findByCategoryId(Long categoryId);

    List<WorkerProfile> findByCityIgnoreCase(String city);

    List<WorkerProfile> findByVerifiedTrue();
}
