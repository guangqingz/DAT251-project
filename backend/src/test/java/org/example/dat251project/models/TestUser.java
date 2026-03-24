package org.example.dat251project.models;

import org.example.dat251project.configs.Role;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

@SpringBootTest
public class TestUser {
    private String name = "Mona";
    private String email = "mona@email.com";
    private String password = "mona123";

    @Test
    public void checkNameIsEqual() {
        User user = new User(name, email, password, Role.ADMIN);
        assertEquals(name, user.getName());
    }

    @Test
    public void twoUsersNotSame() {
        User user = new User(name, email, password, Role.ADMIN);
        User user1 = new User("Atle", email, password, Role.STAFF);
        assertNotEquals(user, user1);
    }
}
