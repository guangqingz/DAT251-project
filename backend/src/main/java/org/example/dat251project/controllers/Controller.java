package org.example.dat251project.controllers;

import org.example.dat251project.dtos.BookingDTO;
import org.example.dat251project.dtos.BookingResponseDTO;
import org.example.dat251project.dtos.TimeSlotDTO;
import org.example.dat251project.dtos.TimeSlotRequestDTO;
import org.example.dat251project.models.Booking;
import org.example.dat251project.models.Tables;
import org.example.dat251project.repositories.BookingRepository;
import org.example.dat251project.services.BookingService;
import org.example.dat251project.services.BookingSystem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.util.List;
import java.util.UUID;

@CrossOrigin()
@RestController
@RequestMapping("/")
public class Controller {
    @Autowired
    BookingSystem bookingSystem;
    @Autowired
    private BookingService bookingService;

    @GetMapping("menu")
    public ResponseEntity<URL> menu() {
        return null;
    }

    @PostMapping("booking")
    public ResponseEntity<BookingResponseDTO> createBooking(@RequestBody BookingDTO bookingDTO) {
        List<Tables> bookedTables = bookingSystem.findAvailableTables(bookingDTO.getDate(), bookingDTO.getTime(), bookingDTO.getNumberGuest());
        if (!bookedTables.isEmpty()) {
            Booking booking = bookingSystem.createBooking(bookingDTO, bookedTables);
            if (booking != null) {
                BookingResponseDTO bookingResponseDTO = BookingResponseDTO.builder()
                        .id(booking.getId())
                        .email(booking.getEmail())
                        .phoneNumber(booking.getPhoneNumber())
                        .numberGuest(booking.getNumberGuest())
                        .time(booking.getTime())
                        .date(booking.getDate())
                        .comment(booking.getComment())
                        .build();
                return ResponseEntity.ok().body(bookingResponseDTO);
            }
        }
        return ResponseEntity.badRequest().build();

    }

    @GetMapping("booking/{id}")
    public ResponseEntity<BookingResponseDTO> getBooking(@PathVariable UUID id) {
        Booking booking = bookingSystem.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.badRequest().build();
        }
        BookingResponseDTO bookingResponseDTO = BookingResponseDTO.builder()
                .id(booking.getId())
                .email(booking.getEmail())
                .phoneNumber(booking.getPhoneNumber())
                .numberGuest(booking.getNumberGuest())
                .time(booking.getTime())
                .date(booking.getDate())
                .comment(booking.getComment())
                .build();
        return ResponseEntity.ok().body(bookingResponseDTO);
    }

    @PostMapping("booking/timeslot")
    public ResponseEntity<List<TimeSlotDTO>> getAvailableTimeSlot(@RequestBody TimeSlotRequestDTO timeSlotRequestDTO) {
        List<TimeSlotDTO> timeSlotDTO = bookingSystem.getAvailabilityForDate(timeSlotRequestDTO.getDate(),
                timeSlotRequestDTO.getNumGuests());
        System.out.println(timeSlotDTO);
        return ResponseEntity.ok().body(timeSlotDTO);
    }

}