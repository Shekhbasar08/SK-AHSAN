package com.kaamconnect.service;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class ServiceCategoryController {

    private final ServiceCategoryService service;

    @GetMapping
    public List<ServiceCategory> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ServiceCategory getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ServiceCategory create(@RequestBody ServiceCategory category) {
        return service.create(category);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
