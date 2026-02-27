package org.example.dat251project.models;

import java.nio.file.Path;


public class Website {
    private Restaurant restaurant;
    private Path menu;

    public Website(Restaurant restaurant, Path menu) {
        this.restaurant = restaurant;
        this.menu = menu;
    }
//upload menu: Path.of("link");

}
