package com.may55a.kitsuba.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class IndexController {
    @GetMapping("/")
    public String home() {
        return "pages/Home";
    }

    @GetMapping("/signup")
    public String signup() {
        return "pages/Signup";
    }

    @GetMapping("/login")
    public String login() {
        return "pages/Login";
    }

    @GetMapping("/profile")
    public String profile() {
        return "pages/Profile";
    }

    @GetMapping("/account-settings")
    public String accountSettings() {
        return "pages/AccountSettings";
    }

    @GetMapping("/learn")
    public String learn(Model model) {
        model.addAttribute("currentPath", "/learn");
        return "pages/Learn";
    }

    @GetMapping("/learn/grades/{grade}")
    public String learnGrade(@PathVariable String grade, Model model) {
        model.addAttribute("grade", grade);
        return "pages/Grade";
    }

    @GetMapping("/learn/grades/{grade}/kanji")
    public String learnKanji(@RequestParam String kanji, @PathVariable String grade, Model model) {
        model.addAttribute("kanji", kanji);
        model.addAttribute("grade", grade);
        return "pages/Kanji";
    }

    @GetMapping("/learn/grades/{grade}/tests/{test}")
    public String test(@PathVariable String grade, @PathVariable String test, Model model) {
        model.addAttribute("grade", grade);
        model.addAttribute("test", test);
        return "pages/Test";
    }

    @GetMapping("/practice")
    public String practice(Model model) {
        model.addAttribute("currentPath", "/practice");
        return "pages/Practice";
    }

    @GetMapping("/practice/grades/{grade}")
    public String practiceByGrade(@PathVariable String grade, @RequestParam int questions, Model model) {
        model.addAttribute("practiceType", "grade");
        model.addAttribute("grade", grade);
        model.addAttribute("questions", questions);
        return "pages/PracticeTest";
    }

    @GetMapping("/practice/favourites")
    public String practiceFavourites(@RequestParam int questions, Model model) {
        model.addAttribute("practiceType", "favourites");
        model.addAttribute("questions", questions);
        return "pages/PracticeTest";
    }

    @GetMapping("/practice/all")
    public String practiceAll(@RequestParam int questions, Model model) {
        model.addAttribute("practiceType", "all");
        model.addAttribute("questions", questions);
        return "pages/PracticeTest";
    }

    @GetMapping("/favourites")
    public String favourites(Model model) {
        model.addAttribute("currentPath", "/favourites");
        return "pages/Favourites";
    }

    @GetMapping("/favourites/{kanji}")
    public String learnKanji(@PathVariable String kanji, Model model) {
        model.addAttribute("kanji", kanji);
        return "pages/Kanji";
    }

    @GetMapping("/quiz")
    public String quizSetup(Model model) {
        model.addAttribute("currentPath", "/quiz");
        return "pages/QuizSetup";
    }

    @GetMapping("/quiz/start")
    public String startQuiz(@RequestParam int questions, Model model) {
        model.addAttribute("questions", questions);
        return "pages/Quiz";
    }
}
