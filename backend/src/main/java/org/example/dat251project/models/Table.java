package org.example.dat251project.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@jakarta.persistence.Table(name = "tables")
public class Table {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    private Integer numOfSeats;
    @ManyToOne
    private Restaurant restaurant;

    public Table(String name, Integer numOfSeats) {
        this.name = name;
        this.numOfSeats = numOfSeats;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Table table)) return false;
        return id != null && id.equals(table.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
