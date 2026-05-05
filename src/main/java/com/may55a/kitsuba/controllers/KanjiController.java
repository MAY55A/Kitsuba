package com.may55a.kitsuba.controllers;

import com.may55a.kitsuba.models.KanjiDetails;
import com.may55a.kitsuba.services.KanjiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kanji")
public class KanjiController {

    private final KanjiService kanjiService;

    @Autowired
    public KanjiController(KanjiService kanjiService) {
        this.kanjiService = kanjiService;
    }

    @GetMapping("/random")
    public String getRandom() {
        return kanjiService.getRandomWord();
    }

    @GetMapping("/search")
    public String searchKanji(@RequestParam String query) {
        return kanjiService.searchKanji(query);
    }

    @GetMapping("/{word}")
    public ResponseEntity<KanjiDetails> getKanjiDetails(@PathVariable String word) {
        KanjiDetails kanjiDetails = kanjiService.getKanjiDetails(word);
        return ResponseEntity.ok(kanjiDetails);
    }

    @GetMapping("/whole/{word}")
    public String getKanji(@PathVariable String word) {
        return kanjiService.getKanji(word);
    }

    @GetMapping("/list")
    public List<String> getKanjiListByGrade(@RequestParam String grade) {
        return kanjiService.getAllKanjiByGrade(grade);
    }

    @GetMapping("/count")
    public int getKanjiCountByGrade(@RequestParam String grade) {
        return kanjiService.getKanjiCountByGrade(grade);
    }

    @GetMapping("/next")
    public String getNextKanji(@RequestParam String kanji, @RequestParam String grade) {
        return kanjiService.getNextKanji(kanji, grade);
    }

    @GetMapping("/previous")
    public String getPreviousKanji(@RequestParam String kanji, @RequestParam String grade) {
        return kanjiService.getPreviousKanji(kanji, grade);
    }

}
