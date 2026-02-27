package org.example.dat251project.controllers;

import org.example.dat251project.models.User;
import org.springframework.http.RequestEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/users")
public class UserController {
    @PostMapping("/login")
    public RequestEntity<User> login(String name, String password) {
        return null;
    }

    @PostMapping("/logout")
    public RequestEntity<User> logout() {
        return null;
    }

    @PostMapping("/admin/createUser")
    public RequestEntity<User> createUser(User user) {
        return null;
    }

    @PostMapping("/admin/deleteUser")
    public RequestEntity<User> deleteUser(User user) {
        return null;
    }
}
