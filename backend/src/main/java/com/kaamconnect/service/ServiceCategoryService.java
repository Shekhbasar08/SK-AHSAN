package com.kaamconnect.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceCategoryService {

    private final ServiceCategoryRepository repository;

    public List<ServiceCategory> findAll() {
        return repository.findAll();
    }

    public ServiceCategory findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> com.kaamconnect.common.ApiException.notFound("Category not found"));
    }

    public ServiceCategory create(ServiceCategory category) {
        if (repository.existsByName(category.getName())) {
            throw com.kaamconnect.common.ApiException.badRequest("Category already exists");
        }
        return repository.save(category);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
