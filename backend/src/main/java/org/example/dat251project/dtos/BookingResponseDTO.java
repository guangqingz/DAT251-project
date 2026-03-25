package org.example.dat251project.dtos;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponseDTO {
    private UUID id;
    private String email;
    private Integer phoneNumber;
    private int numberGuest;
    private LocalTime time;
    private LocalDate date;
    private String comment;
}
