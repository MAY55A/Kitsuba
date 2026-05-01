import {fetchPracticeTest} from "../api/testApi.js";
import {displayTest} from "../render/displayTest.js";
import {MASCOT_MAP} from "../utils/maps.js";
import {fetchLearningStats} from "../api/userApi.js";

const type = document.getElementById("type").value;
const questionsCount = Number(document.getElementById("questions-count").value);
const grade = (type === "grade") ? document.getElementById("grade").value : null;

function onShowResult(learningStats, result, testResultElem) {
    let earnedXP = result.stats.totalPoints / 5;
    result.content = `
                <div class="result-left">
                <h2>Practice Completed ! </h2>
                    <div class="scores">
                        <div class="earned">
                            <p>XP earned</p>
                            <span>${earnedXP}</span>
                        </div>
                        <div class="correct-answers">
                            <p>Correct answers</p>
                            <span>${result.stats.correctAnswers}</span>
                        </div>
                        <div class="errors">
                            <p>Errors</p>
                            <span>${result.stats.errors}</span>
                        </div>
                        </div>
                    <a href="/practice">Close</a>
                </div>
                <div class="result-right">
                    <img alt="tired mascot" src="${MASCOT_MAP.training}"><br>
                </div>
        `;
    learningStats.xp += earnedXP;
}

async function checkIsUnderlevel(learningStats) {
    if (grade && learningStats.currentGrade <= grade)
        window.location.replace("/error/401?reason=underlevel");
}

function onExit() {
    window.location.href = "/practice";
}

fetchLearningStats().then(async (learningStats) => {
    await checkIsUnderlevel(learningStats); // redirect to unauthorized page if underleveled

    fetchPracticeTest(type, questionsCount, grade).then((testData) => {
        displayTest(testData, learningStats, onShowResult, onExit);
    });
});
