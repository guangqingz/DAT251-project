package org.example.dat251project.configs;

import jakarta.transaction.Transactional;
import org.example.dat251project.models.Restaurant;
import org.example.dat251project.models.Table;
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
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Configuration
public class DataInitializer {
    @Autowired
    private RestaurantService restaurantService;
    @Autowired
    private UserService userService;
    @Autowired
    private RestaurantRepository restaurantRepo;
    @Autowired
    private UserRepository userRepo;


    @Bean
    CommandLineRunner init(BookingSystemInitializer initializer) {
        return args -> {
            // If no restaurant is being created
            if (restaurantRepo.count() == 0) {
                OpeningHours opHours = new OpeningHours(
                        LocalTime.of(13, 30, 0),
                        LocalTime.of(21, 30, 0)
                );
                HashSet<DayOfWeek> closedDays = new HashSet<>();
                closedDays.add(DayOfWeek.MONDAY);
                List<Table> tables = createTables();
                Restaurant res = restaurantService.createRestaurant(
                        "Sze Chuan House", "Nedre Korskirkeallmenningen 9",
                        55313690, 20, opHours, 30, closedDays,
                        tables, null, 2);
                res.createCombo(tables);
                initializer.initialize();
            }
            if (userRepo.count() == 0) {
                userService.createUser("admin", "admin123@email.com", "admin123", Role.ADMIN);
            }
        };
    }

    private List<Table> createTables() {
        List<Table> restTables = new ArrayList<>();
        Table t1 = new Table("T1", 4);
        Table t2 = new Table("T2", 2);
        Table t3 = new Table("T3", 4);
        Table t4 = new Table("T4", 2);
        Table t5 = new Table("T5", 4);
        Table t6 = new Table("T6", 4);
        restTables.add(t1);
        restTables.add(t2);
        restTables.add(t3);
        restTables.add(t4);
        restTables.add(t5);
        restTables.add(t6);
        return restTables;
    }


    @Service
    public class BookingSystemInitializer {

        @Autowired
        private RestaurantRepository restaurantRepo;
        @Autowired
        private BookingSystem bookingSystem;

        @Transactional
        public void initialize() {
            Restaurant restaurant = restaurantRepo.findByName("Sze Chuan House")
                    .orElseThrow(() -> new IllegalStateException("Restaurant not found"));
            bookingSystem.setRestaurant(restaurant);
            bookingSystem.initializeRestaurant(restaurant);
        }
    }
}

