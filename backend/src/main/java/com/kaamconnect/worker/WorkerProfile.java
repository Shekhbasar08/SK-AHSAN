package com.kaamconnect.worker;

import com.kaamconnect.service.ServiceCategory;
import com.kaamconnect.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "worker_profiles")
@Getter
@Setter
@NoArgsConstructor
public class WorkerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ServiceCategory category;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "worker_skills", joinColumns = @JoinColumn(name = "worker_id"))
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();

    private int experienceYears;

    private double hourlyRate;

    private double visitCharge;

    private double rating;

    private int reviewCount;

    private int completedJobs;

    @Column(length = 80)
    private String city;

    @Column(length = 80)
    private String area;

    @Column(length = 1000)
    private String bio;

    private boolean verified;

    private boolean availableToday;

    private String photoUrl;
}
