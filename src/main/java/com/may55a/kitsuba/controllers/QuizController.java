package com.may55a.kitsuba.controllers;

import com.may55a.kitsuba.models.Quiz;
import com.may55a.kitsuba.services.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {
    private final QuizService quizService;

    @Autowired
    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/unit-test")
    public ResponseEntity<Quiz> getUnitTest(@RequestParam String grade, @RequestParam int test) {
        Quiz quiz = quizService.getUnitTest(grade, test);
        if (quiz == null)
            return ResponseEntity.of(Optional.empty());
        return ResponseEntity.ok(quiz);
    }

    @GetMapping("/final-test")
    public ResponseEntity<Quiz> getFinalTest(@RequestParam String grade) {
        Quiz quiz = quizService.getFinalTest(grade);
        if (quiz == null)
            return ResponseEntity.of(Optional.empty());
        return ResponseEntity.ok(quiz);
    }


    @GetMapping("/practice-test")
    public ResponseEntity<Quiz> getPracticeTest(@RequestParam String type, @RequestParam String grade, @RequestParam int questions) {
        Quiz quiz = quizService.getPracticeTest(type, questions, grade);
        if (quiz == null)
            return ResponseEntity.of(Optional.empty());
        return ResponseEntity.ok(quiz);
    }

    @GetMapping("/skill-quiz")
    public ResponseEntity<Quiz> getSkillQuiz(@RequestParam int questions) {
        Quiz quiz = quizService.generateSkillQuiz(questions);
        if (quiz == null)
            return ResponseEntity.of(Optional.empty());
        return ResponseEntity.ok(quiz);
    }
}
