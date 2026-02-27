package org.example.dat251project.models;

import lombok.Getter;
import lombok.Setter;
import org.example.dat251project.configs.Role;

import java.util.UUID;
@Getter
@Setter
public class User {
    private UUID id;
    private String name;
    private String email;
    private String password;
    private Role role;

    public User(String name, String email, String password, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
