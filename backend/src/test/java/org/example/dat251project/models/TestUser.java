package org.example.dat251project.models;

import org.example.dat251project.configs.Role;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

public class TestUser {
    @Test
    public void checkNameIsEqual() {
        String name = "Mona";
        String email = "mona@email.com";
        String password = "mona123";
        User user = new User(name, email, password, Role.ADMIN);
        assertEquals(name, user.getName());
    }

    @Test
    public void twoUsersNotSame() {
        String name = "Mona";
        String email = "mona@email.com";
        String password = "mona123";
        User user = new User(name, email, password, Role.ADMIN);
        User user1 = new User("Atle", email, password, Role.STAFF);
        assertNotEquals(user, user1);
    }
}
