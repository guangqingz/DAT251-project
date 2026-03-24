package org.example.dat251project.models;


import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
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
    private LocalDate date;
    private String comment;
    @ManyToMany
    @JoinTable(name = "booking_tables")
    private List<Tables> tables;

    public Booking(String email, Integer phoneNumber, int numberGuest, LocalTime time, LocalDate date, String comment, List<Tables> tables) {
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.numberGuest = numberGuest;
        this.time = time;
        this.date = date;
        this.comment = comment;
        this.tables = tables;
    }
}
