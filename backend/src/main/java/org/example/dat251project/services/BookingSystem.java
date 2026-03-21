package org.example.dat251project.services;

import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.dat251project.models.Booking;
import org.example.dat251project.models.Restaurant;
import org.example.dat251project.models.Tables;
import org.example.dat251project.repositories.BookingRepository;
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
        this.smallTables = restaurant.getSmallTables();
        this.bigTables = restaurant.getBigTables();
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
        // TODO gotta fix
        Map<LocalTime, Boolean> availabilityMap = new HashMap<>();
        for (LocalTime timeslot : restaurant.getTimeSlots()) {
            availabilityMap.put(timeslot, checkAvailability(date, timeslot, numGuests));
        }
        return availabilityMap;
    }

    public boolean createBooking(LocalDate date, LocalTime time, int numGuests) {
        return checkAvailability(date, time, numGuests);
    }

    /**
     * Count the amount of times that {@link Tables table} is a part of a combination
     *
     * @param table
     * @return the amount of combinations it is a part of
     */
    private int countCombinations(Tables table) {
        int count = 0;
        for (Map.Entry<Tables, List<Tables>> entry : combination.entrySet()) {
            if (entry.getKey().equals(table)) {
                count++;
            }
            if (entry.getValue().contains(table)) {
                count++;
            }
        }
        return count;
    }

    //algorithm part
    public List<Tables> findBooking(LocalDate date, LocalTime time, int numGuests) {
        // BookingDTO? instead of three parameters? can be used as refactor step
        List<Tables> result = new ArrayList<>();
        int bestWaste = restaurant.getRestaurantCapacity() + 1;
        int bestComboImpact = restaurant.getRestaurantCapacity();
        if (!checkAvailability(date, time, numGuests)) return result;
        if (numGuests > 7) return result;
        List<Booking> bookings = bookingRepo.findByDateAndTime(date, time);
        Set<Tables> occupiedTables = new HashSet<>();
        for (Booking b : bookings) {
            occupiedTables.addAll(b.getTables());
        }
        if (numGuests <= 2) {
            for (Tables table : smallTables) {
                if (!occupiedTables.contains(table)) {
                    int waste = table.getNumOfSeats() - numGuests;
                    if (waste >= 0 && waste < bestWaste) {
                        bestWaste = waste;
                        result = new ArrayList<>();
                        result.add(table);
                    }
                }
            }
        }
        if (numGuests <= 4) {
            for (Tables table : bigTables) {
                if (!occupiedTables.contains(table)) {
                    int waste = table.getNumOfSeats() - numGuests;
                    if (waste >= 0 && waste < bestWaste) {
                        bestWaste = waste;
                        result = new ArrayList<>();
                        result.add(table);
                    }
                }
            }
        }
        for (Map.Entry<Tables, List<Tables>> entry : combination.entrySet()) {
            Tables key = entry.getKey();
            List<Tables> values = entry.getValue();
            if (!occupiedTables.contains(key)) {
                for (Tables table2 : values) {
                    if (!occupiedTables.contains(table2)) {
                        //Have to check if the combination even can satisfy the number of guests
                        int totalSeatings = key.getNumOfSeats() + table2.getNumOfSeats();
                        int combinationImpact = countCombinations(key) + countCombinations(table2);
                        int waste = totalSeatings - numGuests;

                        if (waste >= 0 && waste < bestWaste && combinationImpact < bestComboImpact) {
                            bestWaste = waste;
                            result = new ArrayList<>();
                            result.add(key);
                            result.add(table2);
                        }
                    }
                }
            }
        }
        return result;
    }
}
