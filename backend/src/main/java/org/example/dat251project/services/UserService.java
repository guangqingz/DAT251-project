package org.example.dat251project.services;

import org.example.dat251project.configs.JWTService;
import org.example.dat251project.configs.Role;
import org.example.dat251project.models.User;
import org.example.dat251project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    UserRepository userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private JWTService jwtService;

    public String userLogin(String name, String password) {
        // Create token by name and password
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                name,
                password
        );
        //Authentication Object
        Authentication authentication = authManager.authenticate(token);
        //Check that user and password matches
        // Only generate session token if it matches
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(name);
        }
        return null;
    }

    public User createUser(String name, String email, String password, Role role) {
        // Can't have two of the same name
        if (userRepo.findByName(name).isEmpty()) {
            User user = new User(name, email, passwordEncoder.encode(password), role);
            userRepo.save(user);
            return user;
        }
        return null;
    }
}
