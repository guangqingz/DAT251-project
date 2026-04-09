package org.example.dat251project.controllers;

import java.net.URI;
import java.net.URL;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.example.dat251project.dtos.BookingDTO;
import org.example.dat251project.dtos.BookingResponseDTO;
import org.example.dat251project.dtos.TimeSlotDTO;
import org.example.dat251project.dtos.TimeSlotRequestDTO;
import org.example.dat251project.models.Booking;
import org.example.dat251project.models.Table;
import org.example.dat251project.services.BookingSystem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

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
    @ApiResponse(responseCode = "201", useReturnTypeSchema = true)
    @PostMapping("booking")
    public ResponseEntity<BookingResponseDTO> createBooking(@Valid @RequestBody BookingDTO bookingDTO) {
        // Check whether the time and date are valid inputs
        if (!bookingSystem.checkValidBookingTimeAndDate(bookingDTO.getTime(), bookingDTO.getDate())) {
            return ResponseEntity.badRequest().build();
        }
        List<Table> bookedTables = bookingSystem.findAvailableTables(bookingDTO.getDate(), bookingDTO.getTime(), bookingDTO.getNumberGuest());
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
                URI location = URI.create("/booking/" + booking.getId());
                return ResponseEntity.created(location).body(bookingResponseDTO);
            }
        }
        // Will only trigger if it is not possible to create that booking
        return ResponseEntity.unprocessableContent().build();

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

    @Operation(summary = "Get today's bookings")
    @ApiResponse(responseCode = "200", useReturnTypeSchema = true)
    @GetMapping("booking/today")
    public ResponseEntity<List<BookingResponseDTO>> getTodayBookings() {
        List<Booking> bookings = bookingSystem.getAllBookingsByDate(LocalDate.now());

        List<BookingResponseDTO> bookingResponseDTOs = bookings.stream()
            .map(booking -> BookingResponseDTO.builder()
                    .id(booking.getId())
                    .email(booking.getEmail())
                    .phoneNumber(booking.getPhoneNumber())
                    .numberGuest(booking.getNumberGuest())
                    .time(booking.getTime())
                    .date(booking.getDate())
                    .comment(booking.getComment())
                    .build())
            .toList();
        return ResponseEntity.ok(bookingResponseDTOs);
    }

    @Operation(summary = "Get all bookings")
    @ApiResponse(responseCode = "200", useReturnTypeSchema = true)
    @GetMapping("booking/history")
    public ResponseEntity<List<BookingResponseDTO>> getBookingHistory() {
        List<Booking> bookings = bookingSystem.getAllBookings();

        List<BookingResponseDTO> bookingResponseDTOs = bookings.stream()
            .map(booking -> BookingResponseDTO.builder()
                    .id(booking.getId())
                    .email(booking.getEmail())
                    .phoneNumber(booking.getPhoneNumber())
                    .numberGuest(booking.getNumberGuest())
                    .time(booking.getTime())
                    .date(booking.getDate())
                    .comment(booking.getComment())
                    .build())
            .toList();
        return ResponseEntity.ok(bookingResponseDTOs);
    }

    @Operation(summary = "Get all bookings on the given date")
    @ApiResponse(responseCode = "200", useReturnTypeSchema = true)
    @GetMapping("booking/history/{date}")
    public ResponseEntity<List<BookingResponseDTO>> getBookingHistoryByDate(@PathVariable LocalDate date) {
        List<Booking> bookings = bookingSystem.getAllBookingsByDate(date);

        List<BookingResponseDTO> bookingResponseDTOs = bookings.stream()
            .map(booking -> BookingResponseDTO.builder()
                    .id(booking.getId())
                    .email(booking.getEmail())
                    .phoneNumber(booking.getPhoneNumber())
                    .numberGuest(booking.getNumberGuest())
                    .time(booking.getTime())
                    .date(booking.getDate())
                    .comment(booking.getComment())
                    .build())
            .toList();
        return ResponseEntity.ok(bookingResponseDTOs);
    }

    @Schema(description = "Get all timeslots that are able to seat the number of guests at a specific date")
    @ApiResponse(responseCode = "200", useReturnTypeSchema = true)
    @PostMapping("booking/timeslot")
    public ResponseEntity<List<TimeSlotDTO>> getAvailableTimeSlot(@Valid @RequestBody TimeSlotRequestDTO timeSlotRequestDTO) {
        List<TimeSlotDTO> timeSlotDTO = bookingSystem.getAvailabilityForDate(timeSlotRequestDTO.getDate(),
                timeSlotRequestDTO.getNumGuests());
        return ResponseEntity.ok().body(timeSlotDTO);
    }

}