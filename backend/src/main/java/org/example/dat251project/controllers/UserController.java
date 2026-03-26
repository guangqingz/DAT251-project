package org.example.dat251project.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.dat251project.models.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users/")
@Tag(name = "User controller")
public class UserController {
    @PostMapping("login")
    public ResponseEntity<User> login(User user) {
        return null;
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
