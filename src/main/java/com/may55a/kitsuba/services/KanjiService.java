package com.may55a.kitsuba.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.may55a.kitsuba.models.KanjiDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class KanjiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    @Value("${rapidapi.key}")
    private String rapidApiKey;

    @Value("${rapidapi.host}")
    private String rapidApiHost;

    @Autowired
    public KanjiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = new ObjectMapper();
    }

    @Cacheable(value = "dailyWordCache", key = "T(java.time.LocalDate).now()")
    public String getRandomWord() {

        String response = webClient.get()
                .uri("https://jlpt-vocab-api.vercel.app/api/words/random")
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return response;
    }

    @Cacheable(value = "offsetWordCache", key = "#offset + '-' + #limit")
    public List<Map<String, Object>> getOffsetList(int offset, int limit) {
        String response = webClient.get()
                .uri("https://jlpt-vocab-api.vercel.app/api/words?offset=" + offset + "&limit=" + limit)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        List<Map<String, Object>> wordList = new ArrayList<>();
        try {
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode wordsNode = rootNode.get("words");

            if (wordsNode.isArray()) {
                for (JsonNode wordNode : wordsNode) {
                    Map<String, Object> wordMap = new HashMap<>();
                    wordMap.put("word", wordNode.get("word").asText());
                    wordMap.put("meaning", wordNode.get("meaning").asText());
                    wordMap.put("furigana", wordNode.get("furigana").asText());
                    wordMap.put("romaji", wordNode.get("romaji").asText());
                    wordList.add(wordMap);
                }
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
        }
        return wordList;
    }

    public String searchKanji(String query) {

        String response = webClient.get()
                .uri("https://kanjialive-api.p.rapidapi.com/api/public/search/" + query)
                .header("x-rapidapi-key", rapidApiKey)
                .header("x-rapidapi-host", rapidApiHost)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return response;
    }

    public Map<String, String> parseRadicalDetails(JsonNode radical) {
        Map<String, String> radicalDetails = new HashMap<>();

        // Extract values and ensure fallback for missing nodes
        radicalDetails.put("character", radical.path("character").asText(""));
        radicalDetails.put("strokes", String.valueOf(radical.path("strokes").asInt()));
        radicalDetails.put("image", radical.path("image").asText(""));
        radicalDetails.put("hiragana", radical.path("name").path("hiragana").asText(""));
        radicalDetails.put("romaji", radical.path("name").path("romaji").asText(""));
        radicalDetails.put("meaning", radical.path("meaning").path("english").asText(""));

        return radicalDetails;
    }

    public Map<String, String> parseOnyomi(JsonNode root) {
        Map<String, String> onyomi = new HashMap<>();

        onyomi.put("katakana", root.path("onyomi_ja").asText(""));
        onyomi.put("romaji", root.path("onyomi").asText(""));

        return onyomi;
    }

    public Map<String, String> parseKunyomi(JsonNode root) {
        Map<String, String> kunyomi = new HashMap<>();

        kunyomi.put("hiragana", root.path("kunyomi_ja").asText(""));
        kunyomi.put("romaji", root.path("kunyomi").asText(""));

        return kunyomi;
    }

    public List<Map<String, String>> parseExamples(JsonNode examples) {
        List<Map<String, String>> listExamples = new ArrayList<>();
        for (JsonNode ex : examples) {
            Map<String, String> example = new HashMap<>();

            example.put("japanese", ex.path("japanese").asText(""));
            example.put("meaning", ex.path("meaning").path("english").asText(""));
            example.put("audio", ex.path("audio").path("mp3").asText(""));
            listExamples.add(example);
        }

        return listExamples;
    }

    public String getKanji(String query) {
        String response = webClient.get()
                .uri("https://kanjialive-api.p.rapidapi.com/api/public/kanji/" + query)
                .header("x-rapidapi-key", rapidApiKey)
                .header("x-rapidapi-host", rapidApiHost)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return response;
    }

    @Cacheable(value = "kanjiDetailsCache", key = "#query")
    public KanjiDetails getKanjiDetails(String query) {

        String response = webClient.get()
                .uri("https://kanjialive-api.p.rapidapi.com/api/public/kanji/" + query)
                .header("x-rapidapi-key", rapidApiKey)
                .header("x-rapidapi-host", rapidApiHost)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        KanjiDetails kanjiDetails = new KanjiDetails();
        try {
            // Parse JSON using ObjectMapper
            JsonNode root = objectMapper.readTree(response);
// Extract necessary fields
            kanjiDetails.setKanji(root.path("kanji").path("character").asText(""));
            kanjiDetails.setMeaning(root.path("meaning").asText(""));
            kanjiDetails.setAudioPath(getAudioForKanji(kanjiDetails.getKanji()));
            kanjiDetails.setRadicalDetails(parseRadicalDetails(root.path("radical")));
            kanjiDetails.setStrokesCount(root.path("kanji").path("strokes").path("count").asInt());
            kanjiDetails.setOnyomi(parseOnyomi(root));
            kanjiDetails.setKunyomi(parseKunyomi(root));
            kanjiDetails.setVideoUrl(root.path("kanji").path("video").path("mp4").asText(""));
            kanjiDetails.setMnHint(root.path("mn_hint").asText());
            kanjiDetails.setGrade(root.path("grade").asInt());
            kanjiDetails.setExamples(parseExamples(root.path("examples")));
            return kanjiDetails;
        } catch (JsonProcessingException e) {
            return kanjiDetails;
        }

    }

    @Cacheable(value = "gradeKanjiCache", key = "#grade")
    public List<String> getAllKanjiByGrade(String grade) {

        String response = webClient.get()
                .uri("https://kanjiapi.dev/v1/kanji/grade-" + grade)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        try {
            return objectMapper.readValue(response, List.class);
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Cacheable(value = "gradeKanjiCountCache", key = "#grade")
    public int getKanjiCountByGrade(String grade) {
        return getAllKanjiByGrade(grade).size();
    }

    public String getNextKanji(String current, String grade) {
        List<String> list = getAllKanjiByGrade(grade);
        String next = null;
        int test = 0;
        int index = list.indexOf(current);
        if (index != -1) {
            if ((index + 1) % 10 == 0)
                test = (index + 1) / 10;
            if (index < list.size() - 1)
                next = list.get(index + 1);
        }
        return "{\"kanji\": \"" + next + "\", \"isTest\": " + test + " }";
    }

    public String getPreviousKanji(String current, String grade) {
        List<String> list = getAllKanjiByGrade(grade);
        String previous = null;
        int test = 0;
        int index = list.indexOf(current);
        if (index != -1 && index != 0) {
            if ((index + 1) % 10 == 1) {
                test = (index + 1) / 10;
            }
            previous = list.get(index - 1);
        }
        return "{\"kanji\": \"" + previous + "\", \"isTest\": " + test + " }";
    }

    private String getAudioForKanji(String kanji) {
        String TTS_URL = "https://translate.google.com/translate_tts?ie=UTF-8&q=%s&tl=ja&client=tw-ob";
        String AUDIO_CACHE_DIR_ABS_PATH = "src/main/resources/static/cache/audio_cache/";
        String AUDIO_CACHE_DIR = "cache/audio_cache/";
// Check if audio is cached
        String cachedFile_ABS = AUDIO_CACHE_DIR_ABS_PATH + kanji + ".mp3";
        String cachedFile = AUDIO_CACHE_DIR + kanji + ".mp3";
        try {
            if (Files.exists(Paths.get(cachedFile_ABS))) {
                return cachedFile;
            }

            // Fetch from TTS
            String url = String.format(TTS_URL, kanji);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<byte[]> response = restTemplate.getForEntity(url, byte[].class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                byte[] audioData = response.getBody();

                // Cache audio
                File cacheDir = new File(AUDIO_CACHE_DIR_ABS_PATH);
                if (!cacheDir.exists()) cacheDir.mkdirs();

                try (FileOutputStream fos = new FileOutputStream(cachedFile_ABS)) {
                    fos.write(audioData);
                }

                return cachedFile;
            } else {
                // Return null if response is not successful
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
