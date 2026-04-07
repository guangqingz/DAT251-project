package org.example.dat251project.services;

import org.example.dat251project.dtos.BookingDTO;
import org.example.dat251project.models.Booking;
import org.example.dat251project.models.Table;
import org.example.dat251project.repositories.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {
    @Autowired
    BookingRepository bookingRepo;

    public Booking createBooking(BookingDTO bookingDTO, List<Table> tables) {
        Booking booking = new Booking(
                bookingDTO.getEmail(),
                bookingDTO.getPhoneNumber(),
                bookingDTO.getNumberGuest(),
                bookingDTO.getTime(),
                bookingDTO.getDate(),
                bookingDTO.getComment(),
                tables
        );
        return bookingRepo.save(booking);
    }

    /**
     * Find all {@link Booking bookings} that are between the {@link LocalTime start} and {@link LocalTime end}
     * for a specific {@link LocalDate date}
     * @param date
     * @param start
     * @param end
     * @return list of {@link Booking bookings}
     */
    public List<Booking> findByDateAndTimeBetween(LocalDate date, LocalTime start, LocalTime end) {
        return bookingRepo.findByDateAndTimeBetween(date, start, end);
    }

    /**
     * Find all {@link Booking bookings} that are at the {@link LocalDate date} and all past {@link LocalTime time}
     * @param date
     * @param time
     * @return list of {@link Booking bookings}
     */
    public List<Booking> findAllByDateAndTime(LocalDate date, LocalTime time) {
        return bookingRepo.findAllByDateAndTime(date, time);
    }

    public Booking getBookingById(UUID id) {
        return bookingRepo.findById(id).orElse(null);
    }
}
