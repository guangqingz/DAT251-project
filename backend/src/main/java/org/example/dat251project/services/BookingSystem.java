package org.example.dat251project.services;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.dat251project.models.Restaurant;
import org.example.dat251project.repositories.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@Service
public class BookingSystem {
    private BookingRepository bookingRepo;
    private Restaurant restaurant;
    private Integer remainingSeats;

    public BookingSystem(BookingRepository bookingRepo, Restaurant restaurant) {
        this.bookingRepo = bookingRepo;
        this.restaurant = restaurant;
        this.remainingSeats = restaurant.getTableCapacity();
        // Sanity checks to ensure restaurant is valid
        sanityCheck(remainingSeats, restaurant.getTimeSlots(), restaurant.getNormalOpeningHours());
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

    private boolean checkAvailability(LocalDate date, LocalTime time, int numGuests) {
        Integer totalGuests = bookingRepo.sumGuestsByDateAndTime(date, time);
        if (totalGuests == null) totalGuests = 0;

        return numGuests + totalGuests <= restaurant.getTableCapacity();
    }

    public Map<LocalTime, Boolean> getAvailabilityForDate(LocalDate date, int numGuests) {
        Map<LocalTime, Boolean> availabilityMap = new HashMap<>();
        for (LocalTime timeslot : restaurant.getTimeSlots()) {
            availabilityMap.put(timeslot, checkAvailability(date, timeslot, numGuests));
        }
        return availabilityMap;
    }

    //algorithm part
    public boolean createBooking(LocalDate date, LocalTime time, int numGuests) {
        // TODO complex algorithm must be in place
        return checkAvailability(date, time, numGuests);
    }
}
