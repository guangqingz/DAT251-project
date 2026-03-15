package org.example.dat251project.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.dat251project.services.OpeningHours;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table
public class Restaurant {
    @Id
    @NotNull
    private String name;

    @NotNull
    private String address;

    @NotNull
    private Integer phoneNumber;

    @NotNull
    private Integer tableCapacity;

    @ElementCollection
    @MapKeyColumn(name = "day_of_week")
    @Column(name = "openingDays")
    private Map<DayOfWeek, OpeningHours> openingDays = new HashMap<>();

    private OpeningHours normalOpeningHours;

    @ElementCollection
    @Column(name = "time_slots")
    private List<LocalTime> timeSlots;

    public Restaurant(String name, String address, Integer phoneNumber,
                      Integer tableCapacity, Map<DayOfWeek, OpeningHours> openingDays, OpeningHours normalOpeningHours,
                      List<LocalTime> timeSlots) {
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.tableCapacity = tableCapacity;
        this.openingDays = openingDays;
        this.normalOpeningHours = normalOpeningHours;
        this.timeSlots = timeSlots;
    }
}