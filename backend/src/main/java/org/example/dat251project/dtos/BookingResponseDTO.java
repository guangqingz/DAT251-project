package org.example.dat251project.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Booking response object")
public class BookingResponseDTO {
    @Schema(description = "Generated Id of the booking",example = "c3f559eb-1bc8-44dd-bb06-294e567da010")
    private UUID id;
    @Schema(example = "alice123@email.com")
    private String email;
    @Schema(example = "123456767")
    private Integer phoneNumber;
    @Schema(example = "4")
    private int numberGuest;
    @Schema(description = "The time of the booking",example = "18:30:00")
    private LocalTime time;
    @Schema(description = "The date of the booking",example = "2026-03-20")
    private LocalDate date;
    @Schema(description = "Comments about the booking",example = "This is a birthday dinner, please surprise us")
    private String comment;
}
