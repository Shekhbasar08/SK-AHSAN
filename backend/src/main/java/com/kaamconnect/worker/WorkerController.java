package com.kaamconnect.worker;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;

    @GetMapping
    public List<WorkerProfile> search(@RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String city) {
        return workerService.search(categoryId, city);
    }

    @GetMapping("/{id}")
    public WorkerProfile getById(@PathVariable Long id) {
        return workerService.getById(id);
    }

    @PostMapping
    public WorkerProfile create(@RequestParam Long userId, @RequestBody WorkerDtos.CreateRequest request) {
        return workerService.createProfile(userId, request);
    }

    @PutMapping("/{id}")
    public WorkerProfile update(@PathVariable Long id, @RequestBody WorkerDtos.UpdateRequest request) {
        return workerService.update(id, request);
    }

    @PutMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public WorkerProfile verify(@PathVariable Long id, @RequestParam boolean verified) {
        return workerService.setVerified(id, verified);
    }
}
