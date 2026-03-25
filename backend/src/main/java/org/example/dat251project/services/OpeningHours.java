package org.example.dat251project.services;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class OpeningHours {
    private LocalTime open;
    private LocalTime close;

    public OpeningHours(LocalTime open, LocalTime close) {
        this.open = open;
        this.close = close;
    }

    public boolean withinOpeningHours(LocalTime currentTime) {
        return (!currentTime.isBefore(open) && currentTime.isBefore(close));
    }
}
