package com.may55a.kitsuba.services;

import com.may55a.kitsuba.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class QuizService {
    private final KanjiService kanjiService;
    private final UserService userService;
    private final ThreadLocalRandom random = ThreadLocalRandom.current();
    private final int TOTAL_KANJI = 8385;

    @Autowired
    public QuizService(KanjiService kanjiService, UserService userService) {
        this.kanjiService = kanjiService;
        this.userService = userService;
    }

    public Quiz getUnitTest(String grade, int nbTest) {
        List<String> list = getListKanji(grade, (nbTest - 1) * 10, nbTest * 10);
        if (list.isEmpty())
            return null;
        return generateTest(list, 7, 75);
    }

    public Quiz getFinalTest(String grade) {
        return getEntireGradeTest(grade, 40);
    }

    public Quiz getEntireGradeTest(String grade, int nbQuestions) {
        List<String> list = getListKanji(grade, 0, -1);
        if (list.isEmpty())
            return null;
        return generateTest(list, nbQuestions, 80);
    }

    public Quiz getPracticeTest(String type, int nbQuestions, String grade) {
        List<Integer> questionsCounts = Arrays.asList(10, 20, 30, 40);
        if (questionsCounts.contains(nbQuestions)) {
            switch (type) {

                case "grade" -> {
                    return getEntireGradeTest(grade, nbQuestions);
                }
                case "favourites" -> {
                    List<String> list = userService.getFavourites();
                    if (list.size() >= 7) // return null if number of favourites is less than 7
                        return generateTest(list, nbQuestions, 0);
                }
                case "all" -> {
                    LearningStats stats = userService.getLearningStats();
                    int currentGrade = stats.getCurrentGrade();
                    List<String> list = new ArrayList<>();
                    for (int i = 1; i < currentGrade; i++) {
                        list.addAll(getListKanji(String.valueOf(i), 0, -1));
                    }
                    list.addAll(getListKanji(String.valueOf(currentGrade), 0, stats.getTotalLearnedKanji() - list.size()));
                    if (list.size() >= 10) // return null if number of unlocked kanji is less than 10
                        return generateTest(list, nbQuestions, 0);
                }
            }
        }
        return null;
    }

    public Quiz generateTest(List<String> kanjiList, int nbQuestions, int passingPercentage) {
        Quiz test = new Quiz();

        // cache kanji details (lazy cache)
        Map<String, KanjiDetails> kanjiCache = new HashMap<>();

        int maxScore = 0;
        int kanjiListSize = kanjiList.size();
        int questionTypes = QuestionType.values().length;

        // Generate a 'fill in the blank question' every 5 questions
        int nbFIBQ = nbQuestions / 5;
        // Use HashSet to avoid adding the same FIBQ
        Set<FillInBlankQuestion> FIBQSet = new HashSet<>();
        while (FIBQSet.size() < nbFIBQ) {
            String kanjiStr = kanjiList.get(random.nextInt(kanjiListSize));
            // if not already cached, fetch kanji details
            KanjiDetails randomKanji = kanjiCache.computeIfAbsent(
                    kanjiStr,
                    kanjiService::getKanjiDetails
            );
            FillInBlankQuestion generatedFIBQ = generateFillInBlankQuestion(randomKanji);
            // if the generated FIBQ was already added ignore it and don't count its points
            if (generatedFIBQ != null && FIBQSet.add(generatedFIBQ))
                maxScore += generatedFIBQ.getPoints();
        }

        // Generate 'multiple choice questions' for the rest of the questions
        int questionsLeft = nbQuestions - nbFIBQ;
        // Use HashSet to avoid adding the same MCQ
        Set<MultipleChoiceQuestion> MCQSet = new HashSet<>();
        while (MCQSet.size() < questionsLeft) {
            QuestionType type = QuestionType.values()[random.nextInt(questionTypes)];

            List<String> randomKanjis = getRandomList(kanjiList, 4);
            List<KanjiDetails> randomKanjisWithDetails = randomKanjis
                    .stream()
                    .map(kanjiStr -> kanjiCache.computeIfAbsent(
                            kanjiStr,
                            kanjiService::getKanjiDetails
                    ))
                    .toList();

            MultipleChoiceQuestion generatedMCQ = generateMultipleChoiceQuestion(randomKanjisWithDetails, type);
            // if the generated MCQ was already added ignore it and don't count its points
            if (generatedMCQ != null && MCQSet.add(generatedMCQ))
                maxScore += generatedMCQ.getPoints();
        }

        // Add the two sets of questions to one list
        List<Question> questions = new ArrayList<>(FIBQSet);
        questions.addAll(MCQSet);
        // Shuffle to randomize order of questions
        Collections.shuffle(questions);
        test.setQuestions(questions);
        int minScore = maxScore * passingPercentage / 100;
        test.setRequiredScore(minScore);
        return test;
    }

    private List<String> getRandomList(List<String> list, int elementsNumber) {
        // make sure the elements number is smaller than the list size to prevent infinite loop
        elementsNumber = Math.min(elementsNumber, list.size());
        return random.ints(0, list.size())
                .distinct()
                .limit(elementsNumber)
                .mapToObj(list::get)
                .toList();
    }

    private MultipleChoiceQuestion generateMultipleChoiceQuestion(List<KanjiDetails> kanjiList, QuestionType type) {
        // populate options list with values (meaning or kanji itself depending on the question type)
        List<String> options = new ArrayList<>();
        for (KanjiDetails option : kanjiList) {
            if (type == QuestionType.SHOW_KANJI)
                options.add(option.getMeaning());
            else
                options.add(option.getKanji());
        }

        // pick the first kanji from the list to be the main kanji for this question (test subject)
        KanjiDetails kanji = kanjiList.get(random.nextInt(kanjiList.size()));
        if (kanji == null)
            return null;
        if (type == QuestionType.SHOW_KANJI)
            return new MultipleChoiceQuestion(type, "What is the meaning of the kanji ?", kanji.getKanji(), kanji.getMeaning(), options, kanji.getAudioPath());
        else if (type == QuestionType.SHOW_MEANING)
            return new MultipleChoiceQuestion(type, "What is the kanji for this word ?", kanji.getMeaning(), kanji.getKanji(), options, null);
        else if (type == QuestionType.SHOW_READING) {
            String reading = kanji.getKunyomi().get("romaji").isEmpty() ? kanji.getOnyomi().get("katakana") : kanji.getKunyomi().get("hiragana");
            reading = String.join("、",
                    Arrays.stream(reading.split("、"))
                            .map(String::trim)
                            .limit(3)
                            .toArray(String[]::new));
            return new MultipleChoiceQuestion(type, "What is the kanji for this reading ?", reading, kanji.getKanji(), options, null);
        } else
            return new MultipleChoiceQuestion(type, "What is the kanji with this sound ?", null, kanji.getKanji(), options, kanji.getAudioPath());
    }

    private FillInBlankQuestion generateFillInBlankQuestion(KanjiDetails kanji) {
        String kunyomi = kanji.getKunyomi().get("hiragana").isEmpty() ? "" : kanji.getKunyomi().get("romaji");
        String onyomi = kanji.getOnyomi().get("katakana").isEmpty() ? "" : kanji.getOnyomi().get("romaji");
        if (kunyomi.isEmpty() && onyomi.isEmpty())
            return null;
        String readings = kunyomi + ", " + onyomi;
        return new FillInBlankQuestion("Write a reading for this kanji", kanji.getKanji(), readings);
    }

    public List<String> getListKanji(String grade, int start, int end) {
        List<String> list = kanjiService.getAllKanjiByGrade(grade);
        if (end == -1)
            return list;
        return list.subList(start, end);
    }

    public Quiz generateSkillQuiz(int nbQuestions) {
        List<Integer> questionsCounts = Arrays.asList(20, 40, 60, 80);
        if (!questionsCounts.contains(nbQuestions))
            return null;
        int maxScore = 0;
        Quiz quiz = new Quiz();
        List<Question> questions = new ArrayList<>();
        List<String> previousWords = new ArrayList<>();
        MultipleChoiceQuestion generatedMCQ;

        while (questions.size() < nbQuestions) {
            generatedMCQ = generateRandomQuestion(6, previousWords);
            if (generatedMCQ == null)
                continue;
            questions.add(generatedMCQ);
            maxScore += generatedMCQ.getPoints();
        }

        quiz.setQuestions(questions);
        quiz.setRequiredScore(maxScore);
        return quiz;
    }

    public MultipleChoiceQuestion generateRandomQuestion(int nbOptions, List<String> previousWords) {
        try {
            int randomOffset = random.nextInt(TOTAL_KANJI / nbOptions);
            List<Map<String, Object>> words = kanjiService.getOffsetList(randomOffset, nbOptions);
            if (words.size() < nbOptions)
                throw new Exception("Not enough words");
            Map<String, Object> chosenWord = words.get(random.nextInt(nbOptions));
            if (previousWords.contains(chosenWord.get("word").toString()))
                throw new Exception("Word already used");
            previousWords.add(chosenWord.get("word").toString());
            List<QuestionType> types = new ArrayList<>(List.of(QuestionType.values()));
            types.remove(QuestionType.SHOW_AUDIO);

            if (chosenWord.get("furigana").toString().isEmpty())
                types.remove(QuestionType.SHOW_READING);
            QuestionType type = types.get(random.nextInt(types.size()));

            if (type == QuestionType.SHOW_KANJI)
                return new MultipleChoiceQuestion(type, "What is the meaning of this word ?", chosenWord.get("word").toString(), chosenWord.get("meaning").toString().split("[,;]")[0], words.stream().map((word) -> word.get("meaning").toString().split("[,;]")[0]).toList(), null);
            else if (type == QuestionType.SHOW_MEANING)
                return new MultipleChoiceQuestion(type, "What is the word with this meaning ?", chosenWord.get("meaning").toString().split("[,;]")[0], chosenWord.get("word").toString(), words.stream().map((word) -> word.get("word").toString()).toList(), null);
            else
                return new MultipleChoiceQuestion(type, "What is the kanji for this reading ?", chosenWord.get("furigana").toString(), chosenWord.get("word").toString(), words.stream().map((word) -> word.get("word").toString()).toList(), null);
        } catch (Exception e) {
            return null;
        }
    }
}
