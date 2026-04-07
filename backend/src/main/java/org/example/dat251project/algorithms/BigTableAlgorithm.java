package org.example.dat251project.algorithms;

import org.example.dat251project.models.Restaurant;
import org.example.dat251project.models.Table;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class BigTableAlgorithm implements TableSelectionAlgorithm {
    /**
     * find a table or a table combination that isn't occupied and can seat {@link Integer numGuests}
     *
     * @param restaurant
     * @param occupiedTables
     * @param numGuests
     * @return a list of tables
     */
    @Override
    public List<Table> findTables(Restaurant restaurant, Set<Table> occupiedTables, int numGuests) {
        List<Table> bestTables = new ArrayList<>();
        if (numGuests <= restaurant.BIG_TABLE_MAX) {
            bestTables = restaurant.findBestBigTables(occupiedTables, numGuests);
        }
        return bestTables;
    }
}
