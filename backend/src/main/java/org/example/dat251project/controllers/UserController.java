package org.example.dat251project.controllers;

import org.example.dat251project.models.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/users")
public class UserController {
    @PostMapping("/login")
    public ResponseEntity<User> login(String name, String password) {
        return null;
    }

    @PostMapping("/logout")
    public ResponseEntity<User> logout() {
        return null;
    }

    @PostMapping("/admin/createUser")
    public ResponseEntity<User> createUser(User user) {
        return null;
    }

    @PostMapping("/admin/deleteUser")
    public ResponseEntity<User> deleteUser(User user) {
        return null;
    }
}
