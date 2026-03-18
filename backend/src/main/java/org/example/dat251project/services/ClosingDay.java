package org.example.dat251project.services;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class ClosingDay {
    private LocalDate date;
    private boolean isClosed;

    public ClosingDay(LocalDate date, boolean isClosed) {
        this.date = date;
        this.isClosed = isClosed;
    }
}
