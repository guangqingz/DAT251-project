package org.example.dat251project.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.dat251project.dtos.BookingDTO;
import org.example.dat251project.dtos.BookingResponseDTO;
import org.example.dat251project.dtos.TimeSlotDTO;
import org.example.dat251project.dtos.TimeSlotRequestDTO;
import org.example.dat251project.models.Booking;
import org.example.dat251project.models.Tables;
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
@Tag(name = "Main controller")
public class Controller {
    @Autowired
    BookingSystem bookingSystem;


    @GetMapping("menu")
    public ResponseEntity<URL> menu() {
        return null;
    }

    @Operation(summary = "Create a new Booking")
    @ApiResponse(responseCode = "200", useReturnTypeSchema = true)
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

    @Operation(summary = "Get a specific Booking by their booking id")
    @ApiResponse(responseCode = "200", useReturnTypeSchema = true)
    @GetMapping("booking/{id}")
    public ResponseEntity<BookingResponseDTO> getBooking(
            @Parameter(
                    description = "ID of the booking",
                    example = "c3f559eb-1bc8-44dd-bb06-294e567da010"
            )
            @PathVariable UUID id) {

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

    @Schema(description = "Get all timeslots that are able to seat the number of guests at a specific date")
    @ApiResponse(responseCode = "200", useReturnTypeSchema = true)
    @PostMapping("booking/timeslot")
    public ResponseEntity<List<TimeSlotDTO>> getAvailableTimeSlot(@RequestBody TimeSlotRequestDTO timeSlotRequestDTO) {
        List<TimeSlotDTO> timeSlotDTO = bookingSystem.getAvailabilityForDate(timeSlotRequestDTO.getDate(),
                timeSlotRequestDTO.getNumGuests());
        System.out.println(timeSlotDTO);
        return ResponseEntity.ok().body(timeSlotDTO);
    }

}