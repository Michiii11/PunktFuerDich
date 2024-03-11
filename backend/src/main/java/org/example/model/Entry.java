package org.example.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.List;

@Entity
public class Entry {
    @Id
    private String name;
    private String displayName;
    private int points;

    public Entry(){}

    public Entry(String name, String displayName){
        this.name = name;
        this.displayName = displayName;
        this.points = 1;
    }

    public void increasePoints(){
        this.points++;
    }

    public void decreasePoints(){
        this.points--;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
