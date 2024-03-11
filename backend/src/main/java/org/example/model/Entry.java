package org.example.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.List;

@Entity
public class Entry {
    @Id
    private String name;
    private int points;

    public Entry(){}

    public Entry(String name){
        this.name = name;
        this.points = 1;
    }

    public void increasePoints(){
        this.points++;
    }
}
