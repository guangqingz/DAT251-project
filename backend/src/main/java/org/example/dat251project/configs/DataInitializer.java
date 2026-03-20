package org.example.dat251project.configs;

import org.example.dat251project.models.Restaurant;
import org.example.dat251project.repositories.BookingRepository;
import org.example.dat251project.repositories.RestaurantRepository;
import org.example.dat251project.repositories.UserRepository;
import org.example.dat251project.services.BookingSystem;
import org.example.dat251project.services.OpeningHours;
import org.example.dat251project.services.RestaurantService;
import org.example.dat251project.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.HashSet;

@Configuration
public class DataInitializer {
    @Autowired
    RestaurantService restaurantService;
    @Autowired
    UserService userService;
    @Autowired
    RestaurantRepository restaurantRepo;
    @Autowired
    UserRepository userRepo;
    @Autowired
    BookingRepository bookingRepo;

    @Bean
    CommandLineRunner init() {
        return args -> {
            // If no restaurant is being created
            if (restaurantRepo.count() == 0) {
                OpeningHours opHours = new OpeningHours(
                        LocalTime.of(13, 30, 0),
                        LocalTime.of(21, 30, 0)
                );
                HashSet<DayOfWeek> closedDays = new HashSet<>();
                closedDays.add(DayOfWeek.MONDAY);
                restaurantService.createRestaurant(
                        "Sze Chuan House", "Nedre Korskirkeallmenningen 9",
                        55313690, 20, opHours, 30, closedDays
                );
            }
            if (userRepo.count() == 0) {
                userService.createUser("admin", "admin123@email.com", "admin123", Role.ADMIN);
            }
        };
    }

    @Bean
    @Lazy
    public BookingSystem bookingSystem() {
        Restaurant restaurant = restaurantRepo.findByName("Sze Chuan House")
                .orElseThrow(() -> new IllegalStateException("Restaurant not found"));
        return new BookingSystem(bookingRepo, restaurant);
    }


}

