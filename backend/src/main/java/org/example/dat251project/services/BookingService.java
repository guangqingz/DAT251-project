package org.example.dat251project.services;

import org.example.dat251project.dtos.BookingDTO;
import org.example.dat251project.models.Booking;
import org.example.dat251project.models.Tables;
import org.example.dat251project.repositories.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingService {
    @Autowired
    BookingRepository bookingRepo;

    public Booking createBooking(BookingDTO bookingDTO, List<Tables> tables) {
        Booking booking = new Booking(
                bookingDTO.getEmail(),
                bookingDTO.getPhoneNumber(),
                bookingDTO.getNumberGuest(),
                bookingDTO.getTime(),
                bookingDTO.getDate(),
                bookingDTO.getComment(),
                tables
        );
        bookingRepo.save(booking);
        return booking;
    }

    public List<Booking> findByDateAndTime(LocalDate date, LocalTime time) {
        return bookingRepo.findByDateAndTime(date, time);
    }
}
