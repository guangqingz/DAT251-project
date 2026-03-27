package org.example.dat251project.algorithms;

import org.example.dat251project.models.Restaurant;
import org.example.dat251project.models.Tables;

import java.util.List;
import java.util.Set;

public class ComboTableAlgorithm implements TableSelectionAlgorithm {
    /**
     * find a table or a table combination that isn't occupied and can seat {@link Integer numGuests}
     *
     * @param restaurant
     * @param occupiedTables
     * @param numGuests
     * @return a list of tables
     */
    @Override
    public List<Tables> findTables(Restaurant restaurant, Set<Tables> occupiedTables, int numGuests) {
        return restaurant.findBestComboTables(occupiedTables, numGuests);
    }


}
