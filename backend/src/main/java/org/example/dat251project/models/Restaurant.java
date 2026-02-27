package org.example.dat251project.models;

import lombok.Getter;
import lombok.Setter;
import org.example.dat251project.services.OpeningHours;

import java.time.DayOfWeek;
import java.util.Date;
import java.util.HashMap;
@Getter
@Setter
public class Restaurant {
    private String name;
    private String address;
    private Integer phoneNumber;
    private Integer tableCapacity;
    private HashMap<DayOfWeek, OpeningHours> normalOpeningHours;
    private HashMap<Date, OpeningHours> specialOpeningHours;

    public Restaurant(String name, String address,
                      Integer phoneNumber, Integer tableCapacity,
                      HashMap<DayOfWeek, OpeningHours> normalOpeningHours,
                      HashMap<Date, OpeningHours> specialOpeningHours) {
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.tableCapacity = tableCapacity;
        this.normalOpeningHours = normalOpeningHours;
        this.specialOpeningHours = specialOpeningHours;
    }
}
