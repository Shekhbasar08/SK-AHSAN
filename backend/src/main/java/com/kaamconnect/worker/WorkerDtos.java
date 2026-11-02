package com.kaamconnect.worker;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class WorkerDtos {

    @Getter
    @Setter
    public static class CreateRequest {
        private Long categoryId;
        private List<String> skills;
        private int experienceYears;
        private double hourlyRate;
        private double visitCharge;
        private String city;
        private String area;
        private String bio;
        private String photoUrl;
    }

    @Getter
    @Setter
    public static class UpdateRequest {
        private Double hourlyRate;
        private Double visitCharge;
        private String bio;
        private Boolean availableToday;
        private List<String> skills;
    }
}
