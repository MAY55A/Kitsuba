package com.may55a.kitsuba.models;

import java.util.Arrays;
import java.util.List;

public class FillInBlankQuestion extends Question {
    public FillInBlankQuestion(String text, String word, String correctAnswer) {
        this.text = text;
        this.word = word;
        this.correctAnswer = correctAnswer;
        this.points = 10;
        this.type = QuestionType.SHOW_KANJI;
    }

    @Override
    public boolean checkAnswer(String userAnswer) {
        List<String> correctAnswers = Arrays.stream(correctAnswer.split(", ")).toList();
        return correctAnswers.contains(userAnswer.trim().toLowerCase());
    }
}
