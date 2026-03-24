package org.example.dat251project.controllers;

import org.example.dat251project.dtos.BookingDTO;
import org.example.dat251project.dtos.BookingResponseDTO;
import org.example.dat251project.models.Booking;
import org.example.dat251project.models.Tables;
import org.example.dat251project.services.BookingService;
import org.example.dat251project.services.BookingSystem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.net.URL;
import java.util.List;

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

    @GetMapping("booking")
    public ResponseEntity<String> bookingPage() {
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
                        .tableNames(bookingSystem.getTableNames(booking.getTables()))
                        .build();
                return ResponseEntity.ok().body(bookingResponseDTO);
            }
        }
        return ResponseEntity.badRequest().build();

    }
}