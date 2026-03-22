package org.example.dat251project.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.dat251project.services.OpeningHours;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
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
    private Integer restaurantCapacity;

    @ElementCollection
    @MapKeyColumn(name = "day_of_week")
    @Column(name = "openingDays")
    private Map<DayOfWeek, OpeningHours> openingDays = new HashMap<>();
    @Embedded
    private OpeningHours normalOpeningHours;

    @ElementCollection
    @Column(name = "time_slots")
    private List<LocalTime> timeSlots;


    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<Tables> tables;

    @Transient
    private List<Tables> smallTables;
    @Transient
    private List<Tables> bigTables;
    @Transient
    private Map<Tables, List<Tables>> combination;

    public Restaurant(String name, String address, Integer phoneNumber,
                      Integer restaurantCapacity, Map<DayOfWeek, OpeningHours> openingDays, OpeningHours normalOpeningHours,
                      List<LocalTime> timeSlots, List<Tables> tables, HashMap<Tables, List<Tables>> combination) {
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.restaurantCapacity = restaurantCapacity;
        this.openingDays = openingDays;
        this.normalOpeningHours = normalOpeningHours;
        this.timeSlots = timeSlots;
        this.tables = tables;
        this.smallTables = divideTableSize(tables, 1, 2);
        this.bigTables = divideTableSize(tables, 3, 4);
        this.combination = combination;
    }

    private List<Tables> divideTableSize(List<Tables> tables, int min, int max) {
        List<Tables> tableDivision = new ArrayList<>();
        for (Tables t : tables) {
            if (t.getNumOfSeats() >= min && t.getNumOfSeats() <= max) {
                tableDivision.add(t);
            }
        }
        return tableDivision;
    }

    /**
     * In case the Restaurant object is lazy initialized, the fields aren't defined yet, thus will call this method
     */
    @PostLoad
    private void postLoad() {
        if (tables != null) {
            this.smallTables = divideTableSize(tables, 1, 2);
            this.bigTables = divideTableSize(tables, 3, 4);
        } else {
            this.smallTables = new ArrayList<>();
            this.bigTables = new ArrayList<>();
        }
        if (combination == null) combination = new HashMap<>();
    }

    public void setTables(List<Tables> tables) {
        this.tables = tables;
        this.smallTables = divideTableSize(tables, 1, 2);
        this.bigTables = divideTableSize(tables, 3, 4);
    }

}