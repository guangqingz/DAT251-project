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
@Table
public class Restaurant {
    public static final int MAXGROUPSIZE = 7;
    public static final int SMALLTABLEMAX = 2;
    public static final int BIGTABLEMAX = 4;
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
        this.smallTables = divideTableSize(tables, 1, SMALLTABLEMAX);
        this.bigTables = divideTableSize(tables, SMALLTABLEMAX + 1, BIGTABLEMAX);
        this.combination = combination;
    }

    /**
     * Divide {@link List<Tables> tables} into a subset of tables that have the amount of seats between {@link Integer min} and {@link Integer max}
     *
     * @param tables
     * @param min
     * @param max
     * @return List of tables with seatings between {@link Integer min} and {@link Integer max}
     */
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
     * In case the Restaurant object is lazy initialized, the fields aren't defined yet, thus spring calls this method
     * in order to avoid null fields.
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

    /**
     * Find the best {@link Tables table} that is availalbe to serve {@link Integer numGuests}.
     * It will filter away tables that are occupied {@link Set<Tables> OccupiedTables}
     * and only consider tables within the {@link List<Tables> Tables}
     *
     * @param tables
     * @param occupiedTables
     * @param numGuests
     * @return list of {@link List<Tables> tables} able to seat the {@link Integer numGuests}, otherwise an empty list
     */
    private List<Tables> findBestTables(List<Tables> tables, Set<Tables> occupiedTables, int numGuests) {
        int bestWaste = restaurantCapacity + 1;
        List<Tables> result = new ArrayList<>();
        for (Tables table : tables) {
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
     * Count the amount of times that {@link Tables table} is a part of a combination
     *
     * @param table
     * @return the amount of combinations it is a part of
     */
    private int countCombinations(Tables table) {
        int count = 0;
        for (Map.Entry<Tables, List<Tables>> entry : combination.entrySet()) {
            if (entry.getKey().equals(table)) {
                count++;
            }
            if (entry.getValue().contains(table)) {
                count++;
            }
        }
        return count;
    }


    public List<Tables> findBestSmallTables(Set<Tables> occupiedTables, int numGuests) {
        return findBestTables(smallTables, occupiedTables, numGuests);

    }

    public List<Tables> findBestBigTables(Set<Tables> occupiedTables, int numGuests) {
        return findBestTables(bigTables, occupiedTables, numGuests);
    }

    public List<Tables> findBestComboTables(Set<Tables> occupiedTables, int numGuests) {
        int bestWaste = restaurantCapacity + 1;
        int bestComboImpact = restaurantCapacity;
        List<Tables> bestComboTable = new ArrayList<>();
        for (Map.Entry<Tables, List<Tables>> entry : combination.entrySet()) {
            Tables key = entry.getKey();
            List<Tables> values = entry.getValue();
            if (!occupiedTables.contains(key)) {
                for (Tables table2 : values) {
                    if (!occupiedTables.contains(table2)) {
                        //Have to check if the combination even can satisfy the number of guests
                        int totalSeatings = key.getNumOfSeats() + table2.getNumOfSeats();
                        int combinationImpact = countCombinations(key) + countCombinations(table2);
                        int waste = totalSeatings - numGuests;

                        if (waste >= 0 && waste < bestWaste && combinationImpact < bestComboImpact) {
                            bestWaste = waste;
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

    public void setTables(List<Tables> tables) {
        this.tables = tables;
        this.smallTables = divideTableSize(tables, 1, SMALLTABLEMAX);
        this.bigTables = divideTableSize(tables, SMALLTABLEMAX + 1, BIGTABLEMAX);
    }
}