package org.example.dat251project.services;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.dat251project.models.Booking;
import org.example.dat251project.models.Restaurant;
import org.example.dat251project.models.Tables;
import org.example.dat251project.repositories.BookingRepository;
import org.springframework.data.annotation.Transient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@Service
public class BookingSystem {
    private BookingRepository bookingRepo;
    private Restaurant restaurant;
    private Integer remainingSeats;

    @Transient
    private List<Tables> smallTables;
    @Transient
    private List<Tables> bigTables;
    @Transient
    private Map<Tables, List<Tables>> combination = new HashMap<>();

    public BookingSystem(BookingRepository bookingRepo, Restaurant restaurant) {
        this.bookingRepo = bookingRepo;
        this.restaurant = restaurant;
        this.remainingSeats = restaurant.getRestaurantCapacity();
        this.smallTables = divideTableSize(restaurant.getTables(), 1, 2);
        this.bigTables = divideTableSize(restaurant.getTables(), 3, 4);
        this.combination = restaurant.getCombination();
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

    private List<Tables> divideTableSize(List<Tables> tables, int min, int max) {
        List<Tables> tableDivision = new ArrayList<>();
        for (Tables t : tables) {
            if (t.getNumOfSeats() >= min && t.getNumOfSeats() <= max) {
                tableDivision.add(t);
            }
        }
        return tableDivision;
    }

    /**
     * helper method for checking if the timeslots given are within the {@link OpeningHours openingHours}
     *
     * @param timeSlots
     * @param openingHours
     * @return true if all the timeslots are within opening and closing hours
     */
    private boolean timeSlotsWithinOpeningHours(List<LocalTime> timeSlots, OpeningHours openingHours) {
        for (LocalTime time : timeSlots) {
            if (!openingHours.withinOpeningHours(time)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get the number of available seatings on that specific {@link LocalDate date} and {@link LocalTime time}
     * and check whether it is available to handle a booking of {@link Integer numGuests}
     *
     * @param date
     * @param time
     * @param numGuests
     * @return true if there is enough capacity, false otherwise
     */
    private boolean checkAvailability(LocalDate date, LocalTime time, int numGuests) {
        // TODO gottta fix
        Integer totalGuests = bookingRepo.sumGuestsByDateAndTime(date, time);
        if (totalGuests == null) totalGuests = 0;

        return numGuests + totalGuests <= restaurant.getRestaurantCapacity();
    }

    public Map<LocalTime, Boolean> getAvailabilityForDate(LocalDate date, int numGuests) {
        Map<LocalTime, Boolean> availabilityMap = new HashMap<>();
        for (LocalTime timeslot : restaurant.getTimeSlots()) {
            availabilityMap.put(timeslot, checkAvailability(date, timeslot, numGuests));
        }
        return availabilityMap;
    }

    public boolean createBooking(LocalDate date, LocalTime time, int numGuests) {
        return checkAvailability(date, time, numGuests);
    }

    //algorithm part
    public List<Tables> findBooking(LocalDate date, LocalTime time, int numGuests) {
        // BookingDTO? instead of three parameters? can be used as refactor step
        List<Tables> result = new ArrayList<>();

        if (!checkAvailability(date, time, numGuests)) return result;
        if (numGuests > 7) return result;
        List<Booking> bookings = bookingRepo.findByDateAndTime(date, time);
        Set<Tables> occupiedTables = new HashSet<>();
        for (Booking b : bookings) {
            occupiedTables.addAll(b.getTables());
        }
        if (numGuests <= 2) {
            for (Tables t : smallTables) {
                if (!occupiedTables.contains(t)) {
                    result.add(t);
                    return result;
                }
            }
        }
        if (numGuests <= 4) {
            for (Tables t : bigTables) {
                if (!occupiedTables.contains(t)) {
                    result.add(t);
                    return result;
                }
            }
        }

        combination.forEach((key, values) -> {
            if (!occupiedTables.contains(key)) {
                for (Tables t : values) {
                    if (!occupiedTables.contains(t)) {
                        //Have to check if the combination even can satisfy the number of guests
                        int totalSeatings = key.getNumOfSeats() + t.getNumOfSeats();
                        // Greedy atm, can later fix it to minimize the difference
                        if (totalSeatings >= numGuests) {
                            result.add(t);
                            result.add(key);
                        }
                        break;
                    }
                }
            }
        });
        return result;
    }
}
