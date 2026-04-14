package org.example.dat251project.models;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
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
@jakarta.persistence.Table
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotNull
    @Email
    private String email;
    @NotNull
    private String phoneNumber;
    @NotNull
    private String countryCode;
    @NotNull
    @Min(1)
    private int numberGuest;

    @JsonFormat(pattern = "HH:mm")
    @NotNull
    private LocalTime time;

    @JsonFormat(pattern = "uuuu-MM-dd")
    @NotNull
    @FutureOrPresent
    private LocalDate date;

    private String comment;

    @ManyToMany
    @JoinTable(name = "booking_tables")
    private List<Table> tables;

    public Booking(String email, String phoneNumber, String countryCode, int numberGuest, LocalTime time, LocalDate date, String comment, List<Table> tables) {
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.countryCode = countryCode;
        this.numberGuest = numberGuest;
        this.time = time;
        this.date = date;
        this.comment = comment;
        this.tables = tables;
    }
}
