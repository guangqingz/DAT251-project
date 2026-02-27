package org.example.dat251project.controllers;

import org.example.dat251project.models.Booking;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URL;

@RestController
@RequestMapping("")
public class Controller {
    @GetMapping("/menu")
    public ResponseEntity<URL> menu() {
        return null;
    }

    @GetMapping("/booking")
    public ResponseEntity<String> bookingPage() {
        return ResponseEntity.ok("Hello");
    }

    @PostMapping("/booking/createBooking")
    public ResponseEntity<String> createBooking(Booking booking) {
        return null;

    }
}
