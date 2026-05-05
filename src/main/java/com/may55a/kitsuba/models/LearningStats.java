package com.may55a.kitsuba.models;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Embeddable
public class LearningStats implements Serializable {

    private int quizzesAttempted = 0;
    private int testsPassed = 0;
    private int currentGrade = 1;
    private int gradeProgress = 0;
    private int totalLearnedKanji = 0;
    private int xp = 0;
    private int errors = 0;
    private int correctAnswers = 0;

    public void addXp(int amount) {
        this.xp += Math.max(amount, 0); // Ensure non-negative XP
    }

    public void updateGradeProgress(int progress) {
        this.gradeProgress = Math.min(Math.max(progress, 0), 100); // Ensure 0 <= progress <= 100
    }

    public void advanceGrade() {
        if (this.gradeProgress >= 100) {
            this.currentGrade++;
            this.gradeProgress = 0;
        }
    }

    public void incrementTotalLearnedKanji() {
        this.totalLearnedKanji++;
    }
}
