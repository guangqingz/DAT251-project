package org.example.dat251project.models;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotNull
    @Email
    private String email;
    @NotNull
    private Integer phoneNumber;
    private int numberGuest;
    private LocalTime time;
    private Date date;

    public Booking(String email, Integer phoneNumber, int numberGuest, LocalTime time, Date date) {
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.numberGuest = numberGuest;
        this.time = time;
        this.date = date;
    }
}
