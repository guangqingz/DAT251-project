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
        sanityCheck(remainingSeats, timeSlots, openingHours);
        this.timeSlots = timeSlots;
        this.remainingSeats = remainingSeats;
        this.openingHours = openingHours;
        this.closingDays = closingDays;
    }


    private void sanityCheck(Integer remainingSeats, List<LocalTime> timeSlots, OpeningHours openingHours) {
        if (remainingSeats < 0) {
            throw new IllegalArgumentException("Negative numbers of seat not allowed");
        }
        if (!timeSlotsWithinOpeningHours(timeSlots, openingHours)) {
            throw new IllegalArgumentException("TimeSlot is out of the opening hours");
        }
    }

    private boolean timeSlotsWithinOpeningHours(List<LocalTime> timeSlots, OpeningHours openingHours) {
        for (LocalTime time : timeSlots) {
            if (!openingHours.withinOpeningHours(time)) {
                return false;
            }
        }
        return true;
    }
//algorithm part
}
