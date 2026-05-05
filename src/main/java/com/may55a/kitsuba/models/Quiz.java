package com.may55a.kitsuba.models;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class Quiz {
    List<Question> questions = new ArrayList<>();
    int requiredScore;
}
