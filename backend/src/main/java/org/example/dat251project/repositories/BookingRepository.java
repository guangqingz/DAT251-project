package org.example.dat251project.repositories;

import org.example.dat251project.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    @Query(value = """
            SELECT SUM(b.numberGuest) FROM Booking b WHERE b.date = :date AND b.time = :time
            """)
    Integer sumGuestsByDateAndTime(@Param("date") LocalDate date, @Param("time") LocalTime time);
}