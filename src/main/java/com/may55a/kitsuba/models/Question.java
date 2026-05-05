package com.may55a.kitsuba.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
abstract public class Question {
    String text;
    String word;
    String correctAnswer;
    String audio;
    QuestionType type;
    int points;

    abstract boolean checkAnswer(String userAnswer);
}

