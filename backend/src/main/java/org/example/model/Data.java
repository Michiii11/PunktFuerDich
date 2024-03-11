package org.example.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Data {
    @Id
    @GeneratedValue
    private int id;

    private int yanik_points;
    private int michi_points;
    private String password;

    public Data(){}

    public boolean isPasswordValid(String password){
        return true;
    }

    public int getYanik_points() {
        return yanik_points;
    }

    public void setYanik_points(int yanik_points) {
        this.yanik_points = yanik_points;
    }

    public int getMichi_points() {
        return michi_points;
    }

    public void setMichi_points(int michi_points) {
        this.michi_points = michi_points;
    }
}
