package org.example.dat251project.services;

import org.junit.jupiter.api.Test;

import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class TestOpeningHours {
    @Test
    public void withinOpeningHours(){
        LocalTime open = LocalTime.of(9,0,0);
        LocalTime close = LocalTime.of(22,0,0);
        OpeningHours openingHours = new OpeningHours(open,close);
        LocalTime currentTime = LocalTime.of(12,3,30);
        assertTrue(openingHours.withinOpeningHours(currentTime));
    }
    @Test
    public void outsideOpeningHours(){
        LocalTime open = LocalTime.of(9,0,0);
        LocalTime close = LocalTime.of(22,0,0);
        OpeningHours openingHours = new OpeningHours(open,close);
        LocalTime currentTime = LocalTime.of(23,59,30);
        assertFalse(openingHours.withinOpeningHours(currentTime));
    }

}
