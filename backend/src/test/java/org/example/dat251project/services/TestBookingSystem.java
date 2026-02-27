package org.example.dat251project.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;

public class TestBookingSystem {

    @Test
    public void remainingSeatsNonNegative() {
        Integer negativeSeat = -5;
        assertThrows(IllegalArgumentException.class, () ->
                new BookingSystem(null, negativeSeat,
                        null, null));
    }

    @Test
    public void timeSlotWithinOpeningHours() {
        List<LocalTime> timeSlots = new ArrayList<>();
        timeSlots.add(LocalTime.of(23, 0, 0));
        timeSlots.add(LocalTime.of(20, 30, 21));
        OpeningHours openingHours = new OpeningHours(
                LocalTime.of(9, 0, 0),
                LocalTime.of(22, 0, 0));
        assertThrows(IllegalArgumentException.class, () ->
                new BookingSystem(timeSlots, 5,
                        openingHours, null));

    }
}
