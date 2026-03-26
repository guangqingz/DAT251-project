package org.example.dat251project.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Request for checking available time slots at the restaurant")
public class TimeSlotRequestDTO {
    @JsonFormat(pattern = "uuuu-MM-dd")
    @Schema(description = "Date of the reservation", example = "2026-02-10")
    private LocalDate date;
    @Schema(description = "Number of guests", example = "2")
    private int numGuests;
}
