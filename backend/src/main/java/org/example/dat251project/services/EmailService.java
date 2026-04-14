package org.example.dat251project.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.example.dat251project.models.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;
    @Value("${spring.mail.username}")
    private String fromEmailUser;

    public void createEmailBooking(Booking booking) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(fromEmailUser);
        helper.setTo(booking.getEmail());
        // TODO make it prettier?

        String link = "http://localhost:3000/booking/" + booking.getId(); // TODO update link after deployment

        helper.setSubject("Booking confirmation " + booking.getDate());
        String msg = "<h1> Booking Confirmation </h1>" +
                "<p> Your booking has been confirmed </p>" +
                "<ul> <li> Date: " + booking.getDate() + "</li>" +
                "<li> Time: " + booking.getTime() + "</li>" +
                "<li> Number of Guests: " + booking.getNumberGuest() + "</li> </ul>" +
                "<a href=" + link + " >" + "Click on this link to change your booking</a>";
        helper.setText(msg, true);
        javaMailSender.send(message);
    }

    public void createEmailBookingCancellation(Booking booking) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(fromEmailUser);
        helper.setTo(booking.getEmail());

        helper.setSubject("Your booking at Sze Chuan House was canceled");
        String msg = "<h1>Booking Cancellation</h1>" +
                "<p>Your booking has been canceled</p>" +
                "<ul><li>Date: " + booking.getDate() + "</li>" +
                "<li>Time: " + booking.getTime() + "</li>" +
                "<li>Number of Guests: " + booking.getNumberGuest() + "</li></ul>";
        helper.setText(msg, true);
        javaMailSender.send(message);
    }
}
