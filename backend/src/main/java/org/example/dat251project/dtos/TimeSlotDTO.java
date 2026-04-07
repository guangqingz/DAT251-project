package org.example.dat251project.dtos;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Shows a timeslot and whether it is available or not",
        requiredProperties = {"time", "available"})
public class TimeSlotDTO {
    @Schema(description = "the timeslot", format = "time", example = "17:30")
    private LocalTime time;
    @Schema(description = "Whether the timeslot is available or not", example = "true")
    private Boolean available;
    @Schema(description = "Whether the timeslot has passed the current time of booking or not", example = "false")
    private Boolean pastTime;
}
