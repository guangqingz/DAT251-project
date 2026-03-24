package org.example.dat251project.dtos;


import lombok.*;

import java.time.LocalTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TimeSlotDTO {
    private LocalTime time;
    private Boolean available;

}
