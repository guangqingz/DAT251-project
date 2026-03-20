package org.example.dat251project.controllers;

import org.example.dat251project.models.Booking;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URL;

@RestController
@RequestMapping("/")
public class Controller {
    @GetMapping("menu")
    public ResponseEntity<URL> menu() {
        return null;
    }

    @GetMapping("booking")
    public ResponseEntity<String> bookingPage() {
        return null;
    }

    @PostMapping("booking")
    public ResponseEntity<String> createBooking(@RequestBody Booking booking) {
        return null;
    }
}
