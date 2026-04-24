package org.example.dat251project.services;

import org.example.dat251project.configs.JWTService;
import org.example.dat251project.configs.Role;
import org.example.dat251project.models.User;
import org.example.dat251project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
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

    /**
     * Create a valid Cookie used for authentication and authorization
     *
     * @param name
     * @param password
     * @return
     */
    public ResponseCookie userLogin(String name, String password) {
        // Create the session token
        String token = generateAuthToken(name, password);
        // If session token was created successfully, then create a cookie for it and return it
        if (token != null) {
            return jwtService.loginCookie(token);
        }
        return null;
    }

    public ResponseCookie userLogOut() {
        return jwtService.logOutCookie();

    }

    private String generateAuthToken(String name, String password) {
        User user = userRepo.findByName(name).orElse(null);
        if (user != null) {

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
                return jwtService.generateToken(name, user.getRole());
            }
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
