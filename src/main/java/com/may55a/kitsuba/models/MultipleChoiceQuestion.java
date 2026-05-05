package com.may55a.kitsuba.models;

import lombok.Getter;

import java.util.List;
import java.util.Objects;

@Getter
public class MultipleChoiceQuestion extends Question {
    List<String> options;

    public MultipleChoiceQuestion(QuestionType type, String text, String word, String correctAnswer, List<String> options, String audio) {
        this.text = text;
        this.word = word;
        this.correctAnswer = correctAnswer;
        this.options = options;
        this.audio = audio;
        this.type = type;
        this.points = 5;
    }

    @Override
    public boolean checkAnswer(String userAnswer) {
        return correctAnswer.equals(userAnswer);
    }

    @Override
    public boolean equals(Object o) {
        if (o instanceof Question q) {
            return q.type.equals(this.type) && q.text.equals(this.text) && Objects.equals(q.word, this.word);
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, text, word);
    }
}
