package org.example.dat251project.services;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.net.URL;
@Getter
@Setter
public class OrderingService {
    private String name;
    private URL url;
    public OrderingService(String name, URL url) {
        this.name = name;
        this.url = url;
    }
}
