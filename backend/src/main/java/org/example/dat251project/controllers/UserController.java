package org.example.dat251project.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.dat251project.dtos.UserDTO;
import org.example.dat251project.models.User;
import org.example.dat251project.services.BookingSystem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users/")
@Tag(name = "User controller")
public class UserController {
    @Autowired
    BookingSystem bookingSystem;
    @PostMapping("login")
    public ResponseEntity<String> login(@Valid @RequestBody UserDTO userDTO) {
        String sessionToken = bookingSystem.userLogin(userDTO.getName(),userDTO.getPassword());
        if(sessionToken!=null){
            return ResponseEntity.ok(sessionToken);
        }
        return ResponseEntity.badRequest().build();
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
