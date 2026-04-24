package org.example.dat251project.configs;


import org.example.dat251project.models.User;
import org.example.dat251project.repositories.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Optional;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity security, JWTFilter jwtFilter) throws Exception {
        return security
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> {
                })// TODO TODO fix the matches
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/users/staff/**").hasAnyAuthority(Role.ADMIN.getAuthority(), Role.STAFF.getAuthority())
                        .requestMatchers("/users/admin/**").hasAnyAuthority(Role.ADMIN.getAuthority())
                        .requestMatchers("/dashboard/**").hasAnyAuthority(Role.ADMIN.getAuthority())
                        .anyRequest().permitAll())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }


    /**
     * Load users from the jpa db
     *
     * @param userRepository
     * @return
     */
    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                Optional<User> maybeUser = userRepository.findByName(username);
                if (maybeUser.isEmpty()) {
                    throw new UsernameNotFoundException("User does not exist");
                }
                return maybeUser.get();
            }

        };
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //Ignore h2 console needing security
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers("/h2-console/**");
    }

    /**
     * The authentication provider which manages
     * and checks tokens with the configured {@link UserDetails} and {@link PasswordEncoder}
     *
     * @param userDetailsService
     * @param passwordEncoder
     * @return
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    /**
     * Spring security authentication manager?
     *
     * @param config
     * @return
     * @throws Exception
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
