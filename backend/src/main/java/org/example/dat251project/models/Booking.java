package org.example.dat251project.models;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
public class Booking {
    private UUID id;
    private String email;
    private int numberGuest;
    private LocalTime time;
    private Date date;

    public Booking(String email, int numberGuest, LocalTime time, Date date) {
        this.email = email;
        this.numberGuest = numberGuest;
        this.time = time;
        this.date = date;
    }
}
