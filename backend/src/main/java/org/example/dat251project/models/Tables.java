package org.example.dat251project.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "tables")
public class Tables {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    private Integer numOfSeats;
    @ManyToOne
    private Restaurant restaurant;

    public Tables(String name, Integer numOfSeats) {
        this.name = name;
        this.numOfSeats = numOfSeats;
    }
}
