package org.example.dat251project.configs;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    STAFF,
    ADMIN;

    @Override
    public String getAuthority() {
        return name();
    }
}
