package org.example.dat251project.repositories;

import org.example.dat251project.models.Booking;
import org.example.dat251project.models.Table;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByDateAndTimeBetween(LocalDate date, LocalTime start, LocalTime end);

    @Query("SELECT b from Booking b WHERE b.time >= :t AND b.date = :d")
    List<Booking> findAllByDateAndTime(@Param("d") LocalDate date, @Param("t") LocalTime time);

    List<Booking> findAllByDate(LocalDate date);

    @Query("select t from Booking b join b.tables t where b.id = :id")
    List<Table> findAllTablesByBookingId(@Param("id") UUID id);
}