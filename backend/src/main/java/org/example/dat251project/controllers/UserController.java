package org.example.dat251project.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.dat251project.dtos.UserDTO;
import org.example.dat251project.models.User;
import org.example.dat251project.services.BookingSystem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/users/")
@Tag(name = "User controller")
public class UserController {
    @Autowired
    BookingSystem bookingSystem;

    @PostMapping("login")
    public ResponseEntity<String> login(@Valid @RequestBody UserDTO userDTO) {
        String sessionToken = bookingSystem.userLogin(userDTO.getName(), userDTO.getPassword());
        ResponseCookie cookie = ResponseCookie.from("auth_token", sessionToken)
                .httpOnly(true)       // Blocks JS access
                .secure(true)         // Transmit only over HTTPS
                .path("/")            // Global scope
                .maxAge(3600)         // Expiration in seconds
                .sameSite("Lax")      // CSRF protection
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }

    // logout frontend side? Since clear session token
    @PostMapping("logout")
    public ResponseEntity<User> logout() {
        return null;
    }

    @PostMapping("admin/createUser")
    public ResponseEntity<User> createUser(User user) {
        return null;
    }

    @PostMapping("admin/deleteUser")
    public ResponseEntity<User> deleteUser(User user) {
        return null;
    }
}
