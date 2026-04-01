package org.example.dat251project.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Request for checking all available time slots in the restaurant that can seat that amount of guests for a specific date",
        requiredProperties = {"date", "numGuests"})
public class TimeSlotRequestDTO {
    @Schema(description = "Date of the reservation", format = "date", example = "2026-02-10")
    @JsonFormat(pattern = "uuuu-MM-dd")
    @NotNull
    @FutureOrPresent
    private LocalDate date;
    @Schema(description = "Number of guests", example = "2", minimum = "1", maximum = "6")
    @NotNull
    @Min(1)
    private int numGuests;
}
