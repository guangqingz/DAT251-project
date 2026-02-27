package org.example.dat251project.services;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class BookingSystem {
    private List<LocalTime> timeSlots;
    private Integer remainingSeats;
    private OpeningHours openingHours;
    private List<ClosingDay> closingDays;

    public BookingSystem(List<LocalTime> timeSlots, Integer remainingSeats,
                         OpeningHours openingHours, List<ClosingDay> closingDays) {
        this.timeSlots = timeSlots;
        this.remainingSeats = remainingSeats;
        this.openingHours = openingHours;
        this.closingDays = closingDays;
    }
//algorithm part
}
