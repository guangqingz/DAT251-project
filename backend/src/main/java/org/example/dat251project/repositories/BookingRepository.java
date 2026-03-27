package org.example.dat251project.repositories;

import org.example.dat251project.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByDateAndTime(LocalDate date, LocalTime time);

    @Query("SELECT b from Booking b WHERE b.time >= :t AND b.date = :d")
    List<Booking> findAllByDateAndTime(@Param("d") LocalDate date, @Param("t") LocalTime time);
}