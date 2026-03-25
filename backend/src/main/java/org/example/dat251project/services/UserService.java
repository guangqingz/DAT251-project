package org.example.dat251project.services;

import org.example.dat251project.configs.Role;
import org.example.dat251project.models.User;
import org.example.dat251project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    UserRepository userRepo;

    public User createUser(String name, String email, String password, Role role) {
        // Can't have two of the same restaurant name
        if (userRepo.findByName(name).isEmpty()) {
            User user = new User(name, email, password, role);
            userRepo.save(user);
            return user;
        }
        return null;
    }
}
