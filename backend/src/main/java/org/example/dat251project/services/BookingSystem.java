package org.example.dat251project.services;

import jakarta.mail.MessagingException;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.dat251project.algorithms.BigTableAlgorithm;
import org.example.dat251project.algorithms.ComboTableAlgorithm;
import org.example.dat251project.algorithms.SmallTableAlgorithm;
import org.example.dat251project.algorithms.TableSelectionAlgorithm;
import org.example.dat251project.dtos.BookingDTO;
import org.example.dat251project.dtos.BookingResponseDTO;
import org.example.dat251project.dtos.TimeSlotDTO;
import org.example.dat251project.models.Booking;
import org.example.dat251project.models.Restaurant;
import org.example.dat251project.models.Table;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    @Autowired
    private UserService userService;

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
     * Check that the time for booking is within the opening hour, and also not a passed time
     * In addition, also check that the date is present or future. Not a past
     *
     * @param bookingTime
     * @param bookingDate
     * @return
     */
    public Boolean checkValidBookingTimeAndDate(LocalTime bookingTime, LocalDate bookingDate) {
        LocalDateTime dt = LocalDateTime.of(bookingDate, bookingTime);
        return dt.isAfter(LocalDateTime.now()) && restaurant.getNormalOpeningHours().withinOpeningHours(bookingTime);
    }

    /**
     * Helper method for checking if the timeslots given are within the {@link OpeningHours openingHours}
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
        List<Table> possibleTables = findAvailableTables(date, time, numGuests);
        return !possibleTables.isEmpty();

    }

    /**
     * Get all timeslots that are available to serve the {@link Integer numGuests} at the {@link LocalDate date}
     *
     * @param date
     * @param numGuests
     * @return list of all timeslots as a list of {@link TimeSlotDTO timeslotDTOs}
     */
    public List<TimeSlotDTO> getAvailabilityForDate(LocalDate date, int numGuests) {
        List<TimeSlotDTO> availabilityList = new ArrayList<>();
        // If current date, then have to ensure that all timeslots passed the current time is true
        if (Objects.equals(date, LocalDate.now())) {
            LocalTime currTime = LocalTime.now().plusHours(restaurant.BOOKING_DURATION);
            for (LocalTime timeslot : restaurant.getTimeSlots()) {
                if (timeslot.isAfter(currTime)) {
                    availabilityList.add(TimeSlotDTO.builder().time(timeslot).available(checkAvailability(date, timeslot, numGuests)).pastTime(false).build());
                } else {
                    // all past timeslots will not be available thus pastTime is true
                    availabilityList.add(TimeSlotDTO.builder().time(timeslot).available(false).pastTime(true).build());
                }
            }
        } else {
            // If the booking is in a future date, then don't need to worry about the current time of booking
            for (LocalTime timeslot : restaurant.getTimeSlots()) {
                availabilityList.add(TimeSlotDTO.builder().time(timeslot).available(checkAvailability(date, timeslot, numGuests)).pastTime(false).build());
            }
        }

        return availabilityList;
    }

    public Booking createBooking(BookingDTO bookingDTO, List<Table> tables) {
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

    /**
     * Get all tables that are occupied given a date and time.
     * It takes into account the duration of a booking, ensuring that no bookings can occur during a booked tables timeframe.
     *
     * @param date
     * @param time
     * @return Set of all tables that are occupied during that date and time
     */
    private Set<Table> getOccupiedTables(LocalDate date, LocalTime time) {
        HashSet<Table> occupiedTables = new HashSet<>();
        LocalTime startWindow = time.minusHours(restaurant.BOOKING_DURATION);
        LocalTime endWindow = time.plusHours(restaurant.BOOKING_DURATION);
        List<Booking> bookings = bookingService.findByDateAndTimeBetween(date, startWindow, endWindow);
        for (Booking b : bookings) {
            LocalTime startTime = b.getTime();
            LocalTime endTime = startTime.plusHours(restaurant.BOOKING_DURATION);
            // Starting time before the ending window and also doesn't end after the starting window
            if (startTime.isBefore(endWindow) && endTime.isAfter(startWindow)) {
                occupiedTables.addAll(b.getTables());
            }
        }
        return occupiedTables;
    }


    /**
     * Find an available {@link Table table}/{@link Table tables} that can seat
     * the amount of {@link Integer numGuests} given the {@link LocalDate date} and {@link LocalTime time} of the
     * booking they want to have. Finding available tables is dependent on the different {@link TableSelectionAlgorithm algorithms}
     * which will find the most optimal one.
     *
     * @param date
     * @param time
     * @param numGuests
     * @return List of Table/Tables. If there are none available, it will return an empty list. Will also return empty list if {@link Integer numGuest} exceeds max group size
     */
    public List<Table> findAvailableTables(LocalDate date, LocalTime time, int numGuests) {
        Set<Table> occupiedTables = getOccupiedTables(date, time);
        return getAvailableTables(occupiedTables, numGuests);
    }

    /**
     * Find an available {@link Table table}/{@link Table tables} that can seat
     * the amount of {@link Integer numGuests} given the {@link LocalDate date} and {@link LocalTime time} of the
     * booking they want to have. Finding available tables is dependent on the different {@link TableSelectionAlgorithm algorithms}
     * which will find the most optimal one, and it will include their existing table
     *
     * @param date of booking
     * @param time of booking
     * @param numGuests of booking
     * @param id of booking
     * @return List of Table/Tables. If there are none available, it will return an empty list. Will also return empty list if {@link Integer numGuest} exceeds max group size
     */
    public List<Table> findAvailableTablesForUpdate(LocalDate date, LocalTime time, int numGuests, UUID id) {
        Set<Table> occupiedTables = getOccupiedTables(date, time);
        // exclude their old table/tables to get actual available tables
        List<Table> existingTables = bookingService.bookingRepo.findAllTablesByBookingId(id);
        occupiedTables.removeIf(existingTables::contains);
        return getAvailableTables(occupiedTables, numGuests);
    }

    private List<Table> getAvailableTables(Set<Table> occupiedTables, int numGuests){
        List<Table> nonAvailable = new ArrayList<>();
        List<TableSelectionAlgorithm> strategies = List.of(
                new SmallTableAlgorithm(),
                new BigTableAlgorithm(),
                new ComboTableAlgorithm()
        );
        if (numGuests > restaurant.MAX_GROUP_SIZE) return nonAvailable;
        for (TableSelectionAlgorithm algorithm : strategies) {
            List<Table> bestTables = algorithm.findTables(restaurant, occupiedTables, numGuests);
            if (!bestTables.isEmpty()) {
                return bestTables;
            }
        }
        // Will only return if there are no tables available
        return nonAvailable;
    }

    public Booking getBookingById(UUID id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            throw new IllegalArgumentException("Cannot find booking with id: " + id.toString());
        }
        return booking;
    }

    /**
     * Deletes a booking with given id
     * @param id of booking
     * @return True upon successful deletion, otherwise false
     */
    public boolean deleteBookingById(UUID id){
        Optional<Booking> existingBooking = bookingService.bookingRepo.findById(id);
        if (existingBooking.isPresent()){
            Booking booking = existingBooking.get();
            bookingService.bookingRepo.deleteById(id);
            // send confirmation about successful deletion on email
            try {
                emailService.createEmailBookingCancellation(booking);
                return true;
            } catch (MessagingException e) {
                return false;
            }
        }
        return false;
    }

    /**
     * Updates an existing booking
     * @param booking - to be updated
     * @return updated booking or null if not valid
     */
    public Booking updateExistingBooking(BookingResponseDTO booking, UUID id){
        if (!booking.getId().equals(id)){
            return null;
        }
        Optional<Booking> existingBooking = bookingService.bookingRepo.findById(booking.getId());
        if (existingBooking.isPresent()){
            Booking bookingToUpdate = existingBooking.get();

            // Check whether the time and date are valid inputs
            if (!this.checkValidBookingTimeAndDate(booking.getTime(), booking.getDate())) {
                return null;
            }

            // Check that time is at least 2 hours before booking on the same day
            LocalDate todayDate = LocalDate.now();
            if (todayDate.equals(booking.getDate())){
                LocalTime earliestTime = LocalTime.now().plusHours(restaurant.BOOKING_DURATION);
                if (!booking.getTime().isAfter(earliestTime)){
                    return null;
                }
            }

            // Check if there are available table for this update
            List<Table> bookedTables = this.findAvailableTablesForUpdate(booking.getDate(), booking.getTime(), booking.getNumberGuest(), booking.getId());
            if (!bookedTables.isEmpty()) {
                bookingToUpdate.setEmail(booking.getEmail());
                bookingToUpdate.setPhoneNumber(booking.getPhoneNumber());
                bookingToUpdate.setCountryCode(booking.getCountryCode());
                bookingToUpdate.setNumberGuest(booking.getNumberGuest());
                bookingToUpdate.setTime(booking.getTime());
                bookingToUpdate.setDate(booking.getDate());
                bookingToUpdate.setComment(booking.getComment());
                bookingToUpdate.setTables(bookedTables);

                // send new confirmation email after successful update
                try {
                    Booking updatedBooking = bookingService.bookingRepo.save(bookingToUpdate);
                    emailService.createEmailBooking(updatedBooking);
                    return updatedBooking;
                } catch (MessagingException e) {
                    return null;
                }
            }
        }
        return null;
    }

    /**
     * Get all {@link Booking booking} that are in that date and past {@link LocalTime time}
     * This also includes booking taking place at {@link LocalTime time}
     *
     * @param date
     * @param time
     * @return List of {@link BookingDTO bookingDTOs} sorted by their time ascending
     */
    public List<BookingDTO> getBookingByDateAndTime(LocalDate date, LocalTime time) {
        ArrayList<Booking> list = new ArrayList<>(bookingService.findAllByDateAndTime(date, time));
        list.sort(Comparator.comparing(Booking::getTime));
        return convertBookingToDTO(list);
    }

    /**
     * Get all {@link Booking bookings}
     *
     * @return List of {@link Booking bookings} sorted by their time descending
     */
    public List<Booking> getAllBookings() {
        ArrayList<Booking> bookings = new ArrayList<>(bookingService.findAllBookings());
        bookings.sort(Comparator.comparing(Booking::getTime).reversed());
        return bookings;
    }

    /**
     * Get all {@link Booking bookings} on the given date
     *
     * @param date
     * @return List of {@link Booking bookings} sorted by their time descending
     */
    public List<Booking> getAllBookingsByDate(LocalDate date) {
        ArrayList<Booking> bookings = new ArrayList<>(bookingService.findAllBookingsByDate(date));
        bookings.sort(Comparator.comparing(Booking::getTime).reversed());
        return bookings;
    }

    /**
     * Convert Booking to BookingDTO
     *
     * @param list List with Booking
     * @return List with BookingDTO
     */
    private List<BookingDTO> convertBookingToDTO(List<Booking> list) {
        List<BookingDTO> result = new ArrayList<>();
        for (Booking b : list) {
            BookingDTO dto = BookingDTO.builder()
                    .email(b.getEmail())
                    .phoneNumber(b.getPhoneNumber())
                    .numberGuest(b.getNumberGuest())
                    .time(b.getTime())
                    .date(b.getDate())
                    .comment(b.getComment())
                    .build();
            result.add(dto);
        }
        return result;
    }

    public ResponseCookie userLogin(String name, String password) {
        return userService.userLogin(name, password);

    }

    public ResponseCookie userLogOut() {
        return userService.userLogOut();
    }
}
