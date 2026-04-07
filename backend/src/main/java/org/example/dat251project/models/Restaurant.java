package org.example.dat251project.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.dat251project.services.OpeningHours;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@jakarta.persistence.Table
public class Restaurant {
    public static final int MAX_GROUP_SIZE = 6;
    public static final int SMALL_TABLE_MAX = 2;
    public static final int BIG_TABLE_MAX = 4;
    // A bookings duration in hours
    public static final int BOOKING_DURATION = 2;
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
    private List<Table> tables;
    @Transient
    private List<Table> smallTables;
    @Transient
    private List<Table> bigTables;
    @Transient
    private Map<Table, List<Table>> combination;

    public Restaurant(String name, String address, Integer phoneNumber,
                      Integer restaurantCapacity, Map<DayOfWeek, OpeningHours> openingDays, OpeningHours normalOpeningHours,
                      List<LocalTime> timeSlots, List<Table> tables, HashMap<Table, List<Table>> combination) {
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.restaurantCapacity = restaurantCapacity;
        this.openingDays = openingDays;
        this.normalOpeningHours = normalOpeningHours;
        this.timeSlots = timeSlots;
        this.tables = tables;
        this.smallTables = divideTableSize(tables, 1, SMALL_TABLE_MAX);
        this.bigTables = divideTableSize(tables, SMALL_TABLE_MAX + 1, BIG_TABLE_MAX);
        this.combination = combination;
    }

    /**
     * Divide {@link List< Table > tables} into a subset of tables that have the amount of seats between {@link Integer min} and {@link Integer max}
     *
     * @param tables
     * @param min
     * @param max
     * @return List of tables with seatings between {@link Integer min} and {@link Integer max}
     */
    private List<Table> divideTableSize(List<Table> tables, int min, int max) {
        List<Table> tableDivision = new ArrayList<>();
        for (Table t : tables) {
            if (t.getNumOfSeats() >= min && t.getNumOfSeats() <= max) {
                tableDivision.add(t);
            }
        }
        return tableDivision;
    }

    /**
     * In case the Restaurant object is lazy initialized, the fields aren't defined yet, thus spring calls this method
     * in order to avoid null fields.
     */
    @PostLoad
    private void postLoad() {
        if (tables != null) {
            this.smallTables = divideTableSize(tables, 1, 2);
            this.bigTables = divideTableSize(tables, 3, 4);
            createCombo(tables);
        } else {
            this.smallTables = new ArrayList<>();
            this.bigTables = new ArrayList<>();
            this.combination = new HashMap<>();
        }
    }

    /**
     * Create table combinations. This is based on the layout of Sze Chuan House
     *
     * @param tables
     * @return
     */
    public void createCombo(List<Table> tables) {
        HashMap<Table, List<Table>> combo = new HashMap<>();
        Table t1 = tables.get(0);
        Table t2 = tables.get(1);
        Table t3 = tables.get(2);
        Table t4 = tables.get(3);
        combo.put(t2, new ArrayList<>(Arrays.asList(t1, t3)));
        combo.put(t3, new ArrayList<>(List.of(t4)));
        this.combination = combo;
    }

    /**
     * Find the best {@link Table table} that is availalbe to serve {@link Integer numGuests}.
     * It will filter away tables that are occupied {@link Set<Table> OccupiedTables}
     * and only consider tables within the {@link List<Table> Tables}
     *
     * @param tables
     * @param occupiedTables
     * @param numGuests
     * @return list of {@link List<Table> tables} able to seat the {@link Integer numGuests}, otherwise an empty list
     */
    private List<Table> findBestTables(List<Table> tables, Set<Table> occupiedTables, int numGuests) {
        int bestWaste = restaurantCapacity + 1;
        List<Table> result = new ArrayList<>();
        for (Table table : tables) {
            if (!occupiedTables.contains(table)) {
                int waste = table.getNumOfSeats() - numGuests;
                if (waste >= 0 && waste < bestWaste) {
                    bestWaste = waste;
                    result = new ArrayList<>();
                    result.add(table);
                }
            }
        }
        return result;
    }

    /**
     * Count the amount of times that {@link Table table} is a part of a combination
     *
     * @param table
     * @return the amount of combinations it is a part of
     */
    private int countCombinations(Table table) {
        int count = 0;
        for (Map.Entry<Table, List<Table>> entry : combination.entrySet()) {
            if (entry.getKey().equals(table)) {
                count++;
            }
            if (entry.getValue().contains(table)) {
                count++;
            }
        }
        return count;
    }


    public List<Table> findBestSmallTables(Set<Table> occupiedTables, int numGuests) {
        return findBestTables(smallTables, occupiedTables, numGuests);

    }

    public List<Table> findBestBigTables(Set<Table> occupiedTables, int numGuests) {
        return findBestTables(bigTables, occupiedTables, numGuests);
    }

    public List<Table> findBestComboTables(Set<Table> occupiedTables, int numGuests) {
        int bestWaste = restaurantCapacity + 1;
        int bestComboImpact = restaurantCapacity;
        List<Table> bestComboTable = new ArrayList<>();
        for (Map.Entry<Table, List<Table>> entry : combination.entrySet()) {
            Table key = entry.getKey();
            List<Table> values = entry.getValue();
            if (!occupiedTables.contains(key)) {
                for (Table table2 : values) {
                    if (!occupiedTables.contains(table2)) {
                        //Have to check if the combination even can satisfy the number of guests
                        int totalSeatings = key.getNumOfSeats() + table2.getNumOfSeats();
                        int combinationImpact = countCombinations(key) + countCombinations(table2);
                        int waste = totalSeatings - numGuests;

                        if (waste >= 0 && waste < bestWaste && combinationImpact < bestComboImpact) {
                            bestWaste = waste;
                            bestComboImpact = combinationImpact;
                            bestComboTable = new ArrayList<>();
                            bestComboTable.add(key);
                            bestComboTable.add(table2);
                        }
                    }
                }
            }
        }
        return bestComboTable;
    }

    public void setTables(List<Table> tables) {
        this.tables = tables;
        this.smallTables = divideTableSize(tables, 1, SMALL_TABLE_MAX);
        this.bigTables = divideTableSize(tables, SMALL_TABLE_MAX + 1, BIG_TABLE_MAX);
    }
}