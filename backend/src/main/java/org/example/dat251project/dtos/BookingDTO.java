package org.example.dat251project.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Booking request from a customer",
        requiredProperties = {"email", "phoneNumber", "numberGuest", "time", "date"})
public class BookingDTO {
    @Schema(format = "email", example = "alice123@email.com")
    @NotNull
    @Email(message = "Email must be a valid email address")
    private String email;
    @Schema(format = "phone number", example = "123456767")
    @NotNull
    private Integer phoneNumber;
    @Schema(example = "4", minimum = "1", maximum = "6")
    @NotNull
    @Min(1)
    private int numberGuest;
    @Schema(description = "The time of the booking", format = "time", example = "18:30:00")
    @NotNull
    private LocalTime time;
    @Schema(description = "The date of the booking", format = "date", example = "2026-03-20")
    @NotNull
    @FutureOrPresent
    private LocalDate date;
    @Schema(description = "Additional comment the customer wants to notify", example = "This is a birthday dinner, please surprise us")
    private String comment;
}
