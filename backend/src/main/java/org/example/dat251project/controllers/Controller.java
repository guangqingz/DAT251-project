package org.example.dat251project.controllers;

import org.example.dat251project.models.Booking;
import org.springframework.http.RequestEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URL;

@RestController
@RequestMapping()
public class Controller {
    @GetMapping("/menu")
    public RequestEntity<URL> menu() {
        return null;
    }

    @GetMapping("/booking")
    public RequestEntity<String> bookingPage() {
        return null;
    }

    @PostMapping("/booking/createBooking")
    public RequestEntity<String> createBooking(Booking booking) {
        return null;

    }
}
