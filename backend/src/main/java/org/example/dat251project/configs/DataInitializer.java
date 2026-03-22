package org.example.dat251project.configs;

import jakarta.transaction.Transactional;
import org.example.dat251project.models.Restaurant;
import org.example.dat251project.models.Tables;
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
import java.util.*;

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
                List<Tables> tables = createTables();
                restaurantService.createRestaurant(
                        "Sze Chuan House", "Nedre Korskirkeallmenningen 9",
                        55313690, 20, opHours, 30, closedDays,
                        tables, createCombo(tables), 2);
                initializer.initialize();
            }
            if (userRepo.count() == 0) {
                userService.createUser("admin", "admin123@email.com", "admin123", Role.ADMIN);
            }
        };
    }

    private List<Tables> createTables() {
        List<Tables> restTables = new ArrayList<>();
        Tables t1 = new Tables("T1", 4);
        Tables t2 = new Tables("T2", 2);
        Tables t3 = new Tables("T3", 4);
        Tables t4 = new Tables("T4", 2);
        Tables t5 = new Tables("T5", 4);
        Tables t6 = new Tables("T6", 4);
        restTables.add(t1);
        restTables.add(t2);
        restTables.add(t3);
        restTables.add(t4);
        restTables.add(t5);
        restTables.add(t6);
        return restTables;
    }

    private HashMap<Tables, List<Tables>> createCombo(List<Tables> tables) {
        HashMap<Tables, List<Tables>> combo = new HashMap<>();
        Tables t1 = tables.get(0);
        Tables t2 = tables.get(1);
        Tables t3 = tables.get(2);
        Tables t4 = tables.get(3);
        combo.put(t2, new ArrayList<>(Arrays.asList(t1, t3)));
        combo.put(t3, new ArrayList<>(List.of(t4)));
        return combo;
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

