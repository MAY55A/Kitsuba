package com.may55a.kitsuba.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class KanjiDetails {
    private String kanji;
    private String meaning;
    private String radical;
    private int grade;
    private int strokesCount;
    private Map<String, String> onyomi;
    private Map<String, String> kunyomi;
    private List<Map<String, String>> examples;
    private String mnHint;
    private String videoUrl;
    private String audioPath;
    private Map<String, String> radicalDetails;
}
