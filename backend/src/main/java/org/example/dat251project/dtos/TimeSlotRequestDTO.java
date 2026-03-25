package org.example.dat251project.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TimeSlotRequestDTO {
    @JsonFormat(pattern = "uuuu-MM-dd")
    private LocalDate date;

    private int numGuests;
}
