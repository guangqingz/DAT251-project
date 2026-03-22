package org.example.dat251project.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.example.dat251project.dtos.BookingDTO;
import org.example.dat251project.models.Booking;
import org.example.dat251project.models.Tables;
import org.example.dat251project.repositories.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingService {
    @Autowired
    BookingRepository bookingRepo;
    @Autowired
    private JavaMailSender javaMailSender;
    @Value("${spring.mail.username}")
    private String fromEmailUser;

    public Booking createBooking(BookingDTO bookingDTO, List<Tables> tables) {
        Booking booking = new Booking(
                bookingDTO.getEmail(),
                bookingDTO.getPhoneNumber(),
                bookingDTO.getNumberGuest(),
                bookingDTO.getTime(),
                bookingDTO.getDate(),
                bookingDTO.getComment(),
                tables
        );
        bookingRepo.save(booking);
        return booking;
    }

    public void createEmailBooking(Booking booking) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(fromEmailUser);
        helper.setTo(booking.getEmail());
        // TODO make it prettier?
        helper.setSubject("Booking confirmation " + booking.getDate());
        String msg = "<h1> Booking Confirmation </h2>" +
                "<p> Your booking has been confirmed </p>" +
                "<ul> <li> Date: " + booking.getDate() + "</li>" +
                "<li> Time: " + booking.getTime() + "</li>" +
                "<li> Number of Guests: " + booking.getNumberGuest() + "</li> </ul>";
        helper.setText(msg, true);
        javaMailSender.send(message);
    }

    public List<Booking> findByDateAndTime(LocalDate date, LocalTime time) {
        return bookingRepo.findByDateAndTime(date, time);
    }
}
