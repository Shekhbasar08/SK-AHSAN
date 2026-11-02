package com.kaamconnect.service;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {
    boolean existsByName(String name);
}
