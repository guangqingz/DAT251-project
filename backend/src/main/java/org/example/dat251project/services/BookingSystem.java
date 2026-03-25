package org.example.dat251project.services;

import jakarta.mail.MessagingException;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.dat251project.dtos.BookingDTO;
import org.example.dat251project.dtos.TimeSlotDTO;
import org.example.dat251project.models.Booking;
import org.example.dat251project.models.Restaurant;
import org.example.dat251project.models.Tables;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@Service
public class BookingSystem {
    private Restaurant restaurant;
    private Integer remainingSeats;
    @Autowired
    private BookingService bookingService;
    @Autowired
    private EmailService emailService;

    public BookingSystem(Restaurant restaurant) {
        if (restaurant != null) {
            initializeRestaurant(restaurant);
        }
    }

    // Add a method to initialize the fields
    public void initializeRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
        this.remainingSeats = restaurant.getRestaurantCapacity();
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
     * @return true if there is a table available, false otherwise
     */
    private boolean checkAvailability(LocalDate date, LocalTime time, int numGuests) {
        List<Tables> possibleTables = findAvailableTables(date, time, numGuests);
        return !possibleTables.isEmpty();

    }

    public List<TimeSlotDTO> getAvailabilityForDate(LocalDate date, int numGuests) {
        List<TimeSlotDTO> availabilityList = new ArrayList<>();
        for (LocalTime timeslot : restaurant.getTimeSlots()) {
            availabilityList.add(TimeSlotDTO.builder()
                            .time(timeslot)
                            .available(checkAvailability(date, timeslot, numGuests))
                            .build());

        }
        return availabilityList;
    }

    public Booking createBooking(BookingDTO bookingDTO, List<Tables> tables) {
        Booking booking = bookingService.createBooking(bookingDTO, tables);
        if (booking != null) {
            try {
                emailService.createEmailBooking(booking);
                return booking;
            } catch (MessagingException e) {
                return null;
            }
        }
        return null;
    }

    private Set<Tables> getOccupiedTables(LocalDate date, LocalTime time) {
        HashSet<Tables> occupiedTables = new HashSet<>();
        List<Booking> bookings = bookingService.findByDateAndTime(date, time);
        for (Booking b : bookings) {
            occupiedTables.addAll(b.getTables());
        }
        return occupiedTables;
    }


    //algorithm part
    public List<Tables> findAvailableTables(LocalDate date, LocalTime time, int numGuests) {
        List<Tables> bestTables = new ArrayList<>();
        Set<Tables> occupiedTables = getOccupiedTables(date, time);

        if (numGuests > restaurant.MAXGROUPSIZE) return bestTables;
        if (numGuests <= restaurant.SMALLTABLEMAX) {
            bestTables = restaurant.findBestSmallTables(occupiedTables, numGuests);
        }
        if (numGuests <= restaurant.BIGTABLEMAX && bestTables.isEmpty()) {
            bestTables = restaurant.findBestBigTables(occupiedTables, numGuests);
        }
        if (bestTables.isEmpty()) {
            bestTables = restaurant.findBestComboTables(occupiedTables, numGuests);
        }
        return bestTables;
    }

    public List<String> getTableNames(List<Tables> tables) {
        ArrayList<String> tableNames = new ArrayList<>();
        for (Tables t : tables) {
            tableNames.add(t.getName());
        }
        return tableNames;
    }

    public Booking getBookingById(UUID id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            throw new IllegalArgumentException("Cannot find booking with id: " + id.toString());
        }
        return booking;
    }
}
