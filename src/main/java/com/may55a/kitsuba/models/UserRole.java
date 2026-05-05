package com.may55a.kitsuba.models;

public enum UserRole {
    USER,
    ADMIN;

    @Override
    public String toString() {
        return name();
    }
}
