package org.example.dat251project.configs;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JWTService {
    //Metric is in minutes
    private final Integer EXPIREYTIME = 15;
    private final String KEYALGORITHM = "HMACSHA256";
    private final Key SECRETKEY;

    public JWTService() {
        this.SECRETKEY = generateKey();
    }

    public String generateToken(String username, Role role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        Instant now = Instant.now();
        Instant expiry = now.plus(Duration.ofMinutes(EXPIREYTIME));
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiry))
                .signWith(SECRETKEY)
                .compact();

    }

    /**
     * Generate the {@link Key} used to sign the JWT
     * Currently uses the algorithm in KEYALGORITHM
     *
     * @return {@link Key}
     */
    private Key generateKey() {
        try {
            KeyGenerator keyGen = KeyGenerator.getInstance(KEYALGORITHM);
            return keyGen.generateKey();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Get the claims given the token
     *
     * @param token
     * @return
     */
    private Claims getClaim(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRETKEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    public String getUsernameByToken(String token) {
        Claims claims = getClaim(token);
        if (claims != null) {
            return claims.getSubject();
        }
        return null;
    }

    /**
     * Check if the token username is the same as the username from {@link UserDetails}
     * and also check whether the token has been expired
     *
     * @param token       token value
     * @param userDetails details of the user
     * @return true if the token connected to the {@link UserDetails} is valid, false otherwise
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        String usernameFromToken = getUsernameByToken(token);
        Claims claims = getClaim(token);
        return (claims.getExpiration().after(Date.from(Instant.now())))
                &&
                (usernameFromToken.equals(userDetails.getUsername()));

    }

    /**
     * Create a Cookie that matches the {@link String token} for login
     *
     * @param token
     * @return
     */
    public ResponseCookie loginCookie(String token) {
        return generateCookie(token, EXPIREYTIME);
    }

    /**
     * Create a Cookie for logging out
     *
     * @return
     */
    public ResponseCookie logOutCookie() {
        return generateCookie("", 0);
    }

    private ResponseCookie generateCookie(String token, Integer time) {
        return ResponseCookie.from("auth_token", token)
                .httpOnly(true)       // Blocks JS access
                .secure(true)         // Transmit only over HTTPS
                .path("/")
                .maxAge(time)
                .sameSite("Lax")
                .build();
    }
}

