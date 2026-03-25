package org.example.dat251project.models;


import com.fasterxml.jackson.annotation.JsonFormat;
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

    @JsonFormat(pattern = "HH:mm")
    private LocalTime time;

    @JsonFormat(pattern = "uuuu-MM-dd")
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

    /**
     * Testing below on bruno:
     {
     "comment": "efwefs",
     "date": "2026-02-18",
     "email": "hello@email.com",
     "numberGuest": 2,
     "phoneNumber": "78709870",
     "time": "20:00"
     }
     */
}
