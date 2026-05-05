package com.may55a.kitsuba.dto;

import com.may55a.kitsuba.models.LearningStats;
import lombok.Getter;

@Getter
public class UserUpdateDTO {
    private final String username;
    private final String description;
    private final String profilePicture;
    private final LearningStats learningStats;
    private final String favourites;

    public UserUpdateDTO(String username, String description, String profilePicture, LearningStats learningStats, String favourites) {
        this.username = username;
        this.description = description;
        this.profilePicture = profilePicture;
        this.learningStats = learningStats;
        this.favourites = favourites;
    }

}
