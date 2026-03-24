package org.example.dat251project.services;

import org.example.dat251project.models.Restaurant;
import org.example.dat251project.models.Tables;
import org.example.dat251project.repositories.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.*;

@Service
public class RestaurantService {
    @Autowired
    RestaurantRepository restaurantRepo;

    public Restaurant createRestaurant(String name, String address, Integer phonenumber,
                                       Integer tableCapacity, OpeningHours opHours, Integer minuteInterval,
                                       Set<DayOfWeek> closedDays, List<Tables> tables, HashMap<Tables, List<Tables>> combo, Integer sittingDurationInHour) {
        if (restaurantRepo.findByName(name).isEmpty()) {
            Map<DayOfWeek, OpeningHours> openingDays = generateOpeningDays(opHours, closedDays);
            Restaurant restaurant = new Restaurant(
                    name, address, phonenumber, tableCapacity, openingDays, opHours,
                    generateTimeSlots(opHours, minuteInterval, sittingDurationInHour), tables, combo
            );
            addRestaurantToTables(restaurant);
            restaurantRepo.save(restaurant);
            return restaurant;
        }
        return null;
    }

    /**
     * Set each {@link Tables table} to be linked to the {@link Restaurant restaurant}
     *
     * @param restaurant
     */
    private void addRestaurantToTables(Restaurant restaurant) {
        for (Tables t : restaurant.getTables()) {
            t.setRestaurant(restaurant);
        }
    }

    /**
     * Generate a list of timeslots between the opening hour and the closing hour, given a minute interval
     *
     * @param opHours
     * @param minuteInterval
     * @return
     */
    private List<LocalTime> generateTimeSlots(OpeningHours opHours, Integer minuteInterval, Integer sittingDurationInHour) {
        List<LocalTime> timeSlots = new ArrayList<>();
        LocalTime current = opHours.getOpen();
        while (!current.isAfter(opHours.getClose().minusHours(sittingDurationInHour))) {
            timeSlots.add(current);
            current = current.plusMinutes(minuteInterval);
        }
        return timeSlots;
    }

    /**
     * Generate a map of days that are open, with their {@link OpeningHours openingHours}
     * also avoids including days that are closed
     *
     * @param normalOpeningHours
     * @param closedDays
     * @return
     */
    private Map<DayOfWeek, OpeningHours> generateOpeningDays(OpeningHours normalOpeningHours, Set<DayOfWeek> closedDays) {
        Map<DayOfWeek, OpeningHours> openingDays = new HashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            // Don't add closed days
            if (!closedDays.contains(day)) {
                openingDays.put(day, normalOpeningHours);
            }
        }
        return openingDays;
    }
}
