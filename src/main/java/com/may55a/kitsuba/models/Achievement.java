package com.may55a.kitsuba.models;


import lombok.Getter;

@Getter
public enum Achievement {
    FIRST_KANJI("First Kanji", "Learned your first Kanji!"),
    KANJI_BEGINNER("Kanji Beginner", "Mastered 10 basic Kanji."),
    KANJI_EXPLORER("Kanji Explorer", "Explored 50 Kanji characters."),
    KANJI_MASTER("Kanji Master", "Mastered 100 Kanji with readings and meanings."),
    RADICAL_EXPERT("Radical Expert", "Understood the radicals of 20 Kanji."),
    AUDIO_CHAMP("Audio Champ", "Practiced the pronunciation of 30 Kanji."),
    WRITING_WIZARD("Writing Wizard", "Practiced writing 50 Kanji characters.");

    private final String title;
    private final String description;

    // Constructor for the enum
    Achievement(String title, String description) {
        this.title = title;
        this.description = description;
    }

    @Override
    public String toString() {
        return title + ": " + description;
    }
}
