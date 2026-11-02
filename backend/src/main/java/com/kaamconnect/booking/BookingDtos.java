package com.kaamconnect.booking;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingDtos {

    @Getter
    @Setter
    public static class CreateRequest {
        private Long workerId;
        private String date;
        private String timeSlot;
        private String address;
        private String city;
        private String notes;
        private int hours;
    }

    @Getter
    @Setter
    public static class StatusUpdateRequest {
        private String status;
    }

    @Getter
    @Setter
    public static class RescheduleRequest {
        private String date;
        private String timeSlot;
    }
}
