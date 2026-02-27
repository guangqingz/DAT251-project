package org.example.dat251project.models;

import org.example.dat251project.services.OrderingService;

import java.nio.file.Path;
import java.util.List;


public class Website {
    private Restaurant restaurant;
    private Path menu;
    private List<OrderingService> orderingServices;

    public Website(Restaurant restaurant, Path menu, List<OrderingService> orderingServices) {
        this.restaurant = restaurant;
        this.menu = menu;
        this.orderingServices = orderingServices;
    }
//upload menu: Path.of("link");

}
