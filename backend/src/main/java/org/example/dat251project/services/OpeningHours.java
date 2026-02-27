package org.example.dat251project.services;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
@Getter
@Setter
public class OpeningHours {
    private LocalTime open;
    private LocalTime close;

    public OpeningHours(LocalTime open, LocalTime close) {
        this.open = open;
        this.close = close;
    }

    public boolean withinOpeningHours(LocalTime currentTime) {
        return (currentTime.isAfter(open) && currentTime.isBefore(close));
    }
}
