package org.example.dat251project.services;

import org.example.dat251project.dtos.BookingDTO;
import org.example.dat251project.dtos.TimeSlotDTO;
import org.example.dat251project.models.Booking;
import org.example.dat251project.models.Restaurant;
import org.example.dat251project.models.Tables;
import org.example.dat251project.repositories.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ExtendWith(SpringExtension.class)
public class TestBookingSystem {
    private final String email = "email@email.com";
    private final Integer phoneNumber = 1234;
    private Restaurant restaurant;
    private BookingSystem bookingSystem;
    @Mock
    private BookingRepository bookingRepo;
    @Mock
    private BookingService bookingService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        restaurant = new Restaurant();
        List<Tables> restTables = new ArrayList<>();

        Tables t1 = new Tables("T1", 4);
        Tables t2 = new Tables("T2", 2);
        Tables t3 = new Tables("T3", 4);
        Tables t4 = new Tables("T4", 2);
        Tables t5 = new Tables("T5", 4);
        Tables t6 = new Tables("T6", 4);
        restTables.add(t1);
        restTables.add(t2);
        restTables.add(t3);
        restTables.add(t4);
        restTables.add(t5);
        restTables.add(t6);
        restaurant.setTables(restTables);
        HashMap<Tables, List<Tables>> combo = new HashMap<>();
        combo.put(t2, new ArrayList<>(Arrays.asList(t1, t3)));
        combo.put(t3, new ArrayList<>(List.of(t4)));
        restaurant.setCombination(combo);
        bookingService = Mockito.mock(BookingService.class);
        bookingSystem = new BookingSystem();
    }

    private void mockBooking(LocalDate date, LocalTime time, int numGuests, List<Tables> bookedTables) {
        Mockito.when(bookingService.findByDateAndTime(date, time))
                .thenReturn(List.of(
                        new Booking(email, phoneNumber, numGuests, time, date, "", bookedTables)
                ));
    }

    @Test
    public void remainingSeatsNonNegative() {
        Integer negativeSeat = -5;
        restaurant.setRestaurantCapacity(negativeSeat);

        assertThrows(IllegalArgumentException.class, () ->
                bookingSystem.initializeRestaurant(restaurant));
    }

    @Test
    public void timeSlotWithinOpeningHours() {
        List<LocalTime> timeSlots = new ArrayList<>();
        timeSlots.add(LocalTime.of(23, 0, 0));
        timeSlots.add(LocalTime.of(20, 30, 21));
        OpeningHours openingHours = new OpeningHours(
                LocalTime.of(9, 0, 0),
                LocalTime.of(22, 0, 0));
        restaurant.setTimeSlots(timeSlots);
        restaurant.setRestaurantCapacity(5);
        restaurant.setNormalOpeningHours(openingHours);

        assertThrows(IllegalArgumentException.class, () ->
                bookingSystem.initializeRestaurant(restaurant));

    }

    @Test
    public void checkAvailability() {
        // Set up timeslots and opening hours
        List<LocalTime> timeSlots = List.of(LocalTime.of(18, 0), LocalTime.of(20, 30));
        OpeningHours openingHours = new OpeningHours(LocalTime.of(9, 0), LocalTime.of(23, 0));
        restaurant.setNormalOpeningHours(openingHours);
        restaurant.setRestaurantCapacity(5);
        restaurant.setTimeSlots(timeSlots);

        bookingSystem.initializeRestaurant(restaurant);
        bookingSystem.setBookingService(bookingService);
        // If refactor to using DTO, remember to change it here as well
        LocalDate date = LocalDate.of(2026, 3, 10);
        LocalTime time = LocalTime.of(18, 0);
        int numGuests = 2;
        // Mock the availability
        for (LocalTime timeslot : restaurant.getTimeSlots()) {
            Mockito.when(bookingService.findByDateAndTime(date, timeslot))
                    .thenReturn(new ArrayList<>()); // No bookings yet, all tables free
        }
        List<TimeSlotDTO> availableTime = bookingSystem.getAvailabilityForDate(date, numGuests);
        assertTrue(availableTime.getFirst().getAvailable());
    }


    @Test
    public void testSmallBooking() {
        // Set up timeslots and opening hours
        List<LocalTime> timeSlots = List.of(LocalTime.of(18, 0), LocalTime.of(20, 30));
        OpeningHours openingHours = new OpeningHours(LocalTime.of(9, 0), LocalTime.of(23, 0));
        restaurant.setNormalOpeningHours(openingHours);
        restaurant.setRestaurantCapacity(20);
        restaurant.setTimeSlots(timeSlots);


        bookingSystem.initializeRestaurant(restaurant);
        bookingSystem.setBookingService(bookingService);

        LocalDate date = LocalDate.of(2026, 3, 10);
        LocalTime time = LocalTime.of(18, 0);
        int numGuests = 2;
        List<Tables> booking1 = bookingSystem.findAvailableTables(date, time, numGuests);
        assertEquals(1, booking1.size());
        assertTrue(restaurant.getSmallTables().contains(booking1.getFirst()));

        // Mock that there has been a booking created in the db
        mockBooking(date, time, numGuests, booking1);
        List<Tables> booking2 = bookingSystem.findAvailableTables(date, time, 1);
        assertEquals(1, booking2.size());
        assertNotEquals(booking1.getFirst(), booking2.getFirst());
        assertTrue(restaurant.getSmallTables().contains(booking2.getFirst()));

    }

    @Test
    public void testBigBooking() {
        // Set up timeslots and opening hours
        List<LocalTime> timeSlots = List.of(LocalTime.of(18, 0), LocalTime.of(20, 30));
        OpeningHours openingHours = new OpeningHours(LocalTime.of(9, 0), LocalTime.of(23, 0));
        restaurant.setNormalOpeningHours(openingHours);
        restaurant.setRestaurantCapacity(20);
        restaurant.setTimeSlots(timeSlots);


        bookingSystem.initializeRestaurant(restaurant);
        bookingSystem.setBookingService(bookingService);

        LocalDate date = LocalDate.of(2026, 3, 10);
        LocalTime time = LocalTime.of(18, 0);
        int numGuests = 3;

        List<Tables> booking1 = bookingSystem.findAvailableTables(date, time, numGuests);
        assertEquals(1, booking1.size());
        assertTrue(restaurant.getBigTables().contains(booking1.getFirst()));

        // Mock that there has been a booking created in the db
        mockBooking(date, time, numGuests, booking1);
        List<Tables> booking2 = bookingSystem.findAvailableTables(date, time, 4);
        assertEquals(1, booking2.size());
        assertNotEquals(booking1.getFirst(), booking2.getFirst());
        assertTrue(restaurant.getBigTables().contains(booking2.getFirst()));

    }

    @Test
    public void testComboBooking() {
        // Set up timeslots and opening hours
        List<LocalTime> timeSlots = List.of(LocalTime.of(18, 0), LocalTime.of(20, 30));
        OpeningHours openingHours = new OpeningHours(LocalTime.of(9, 0), LocalTime.of(23, 0));
        restaurant.setNormalOpeningHours(openingHours);
        restaurant.setRestaurantCapacity(20);
        restaurant.setTimeSlots(timeSlots);

        bookingSystem.initializeRestaurant(restaurant);
        bookingSystem.setBookingService(bookingService);

        LocalDate date = LocalDate.of(2026, 3, 10);
        LocalTime time = LocalTime.of(18, 0);
        int numGuests = 5;


        List<Tables> booking1 = bookingSystem.findAvailableTables(date, time, numGuests);
        assertEquals(2, booking1.size());
        // Mock that there has been a booking created in the db
        mockBooking(date, time, numGuests, booking1);
        // TODO don't know how to test which combination was used, but since the second assertEquals passed, we can guarantee we didn't get (t2,t3)
        List<Tables> booking2 = bookingSystem.findAvailableTables(date, time, numGuests);
        assertEquals(2, booking2.size());
        // Mock that there has been a booking created in the db
        mockBooking(date, time, numGuests, booking2);

    }

    @Test
    public void testBookingByDateAndTime() {
        // Set up timeslots and opening hours
        List<LocalTime> timeSlots = List.of(LocalTime.of(10, 0), LocalTime.of(20, 0));
        OpeningHours openingHours = new OpeningHours(LocalTime.of(9, 0), LocalTime.of(23, 0));
        restaurant.setNormalOpeningHours(openingHours);
        restaurant.setRestaurantCapacity(20);
        restaurant.setTimeSlots(timeSlots);

        bookingSystem.initializeRestaurant(restaurant);
        bookingSystem.setBookingService(bookingService);

        LocalTime time1 = timeSlots.getFirst();
        LocalTime time2 = timeSlots.getLast();
        LocalDate date = LocalDate.of(2026, 3, 10);
        int numGuests = 3;

        List<Tables> tables1 = bookingSystem.findAvailableTables(date, time1, numGuests);
        List<Tables> tables2 = bookingSystem.findAvailableTables(date, time2, numGuests);

        Booking booking1 = new Booking("alice@gmail.com", 123,
                numGuests, time1, date, "Hello", tables1);
        Booking booking2 = new Booking("bob@gmail.com", 321,
                numGuests, time2, date, "Hello 2", tables2);

        List<Booking> bookings = new ArrayList<>();
        bookings.add(booking1);
        bookings.add(booking2);

        Mockito.when(bookingService.findAllByDateAndTime(date, time1))
                .thenReturn(bookings);

        List<BookingDTO> result = bookingSystem.getBookingByDataAndTime(date, time1);
        assertEquals(2, result.size());
        assertEquals("alice@gmail.com", result.getFirst().getEmail());

    }
}
