import {fetchSkillQuiz} from "../api/testApi.js";
import {displayTest} from "../render/displayTest.js";
import {fetchLearningStats} from "../api/userApi.js";
import {LEVELS_MAP} from "../utils/maps.js";

const questionsCount = Number(document.getElementById("questions-count").value);

function getLevelFromScore(scorePercent) {
    if (scorePercent < 30) return "N5";
    if (scorePercent < 50) return "N4";
    if (scorePercent < 70) return "N3";
    if (scorePercent < 85) return "N2";
    return "N1";
}

function onShowResult(learningStats, result, testResultElem) {
    let scorePercent = result.stats.totalPoints * 100 / result.stats.requiredScore;
    const level = LEVELS_MAP[getLevelFromScore(scorePercent)];

    testResultElem.style = `--color: ${level.color}`;
    result.content = `
            <div class="result-left">
                <h2>Level ${level.jlpt} • ${level.title}</h2>
                <div class="scores">
                    <div class="earned">
                        <p>Your score</p>
                        <span>${scorePercent} %</span>
                    </div>
                </div>
                <p class="message">${level.description}</p>
                <a href="/learn">Continue learning</a>
            </div>
            <div class="result-right">
                <img src="${level.image}" alt="${level.title}">
            </div>
    `;

    learningStats.quizzesAttempted++;
}

function onExit() {
    window.location.href = "/quiz";
}

fetchSkillQuiz(questionsCount).then(async (testData) => {
    const learningStats = await fetchLearningStats();
    displayTest(testData, learningStats, onShowResult, onExit);
});