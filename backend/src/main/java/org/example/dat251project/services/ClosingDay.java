package org.example.dat251project.services;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ClosingDay {
    private Date date;
    private boolean isClosed;

    public ClosingDay(Date date, boolean isClosed) {
        this.date = date;
        this.isClosed = isClosed;
    }
}
