package org.example.dat251project.models;

import lombok.Getter;
import lombok.Setter;
import org.example.dat251project.services.ClosingDay;
import org.example.dat251project.services.OpeningHours;
import org.springframework.context.annotation.Bean;

import java.time.DayOfWeek;
import java.util.Date;
import java.util.HashMap;

@Getter
@Setter
public class Restaurant {
    private String name;
    private String address;
    private Integer phoneNumber;
    // max amount of guests that can be at the restaurant
    private Integer tableCapacity;
    private HashMap<DayOfWeek, OpeningHours> normalOpeningHours;
    private HashMap<Date, ClosingDay> closingDays;

    public Restaurant(String name, String address,
                      Integer phoneNumber, Integer tableCapacity,
                      HashMap<DayOfWeek, OpeningHours> normalOpeningHours,
                      HashMap<Date, ClosingDay> closingDays) {
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.tableCapacity = tableCapacity;
        this.normalOpeningHours = normalOpeningHours;
        this.closingDays = closingDays;
    }
}
