import {fetchGradeTest} from "../api/testApi.js";
import {displayTest} from "../render/displayTest.js";
import {fetchKanjiCount} from "../api/kanjiApi.js";
import {fetchLearningStats} from "../api/userApi.js";
import {MASCOT_MAP, SOUNDS_MAP} from "../utils/maps.js";

const nbTest = document.getElementById("test").value;
const grade = document.getElementById("grade").value;

async function onShowResult(learningStats, result, testResultElem) {

    if (result.stats.totalPoints < result.stats.requiredScore) { // Test failed
        testResultElem.classList.add("failed");
        result.audio = SOUNDS_MAP.testFail;
        result.content = `
                <div class="result-left">
                    <h2>Sorry! You did not pass!</h2>
                    <div class="scores">
                        <div class="earned">
                            <p>Your score</p>
                            <span>${result.stats.totalPoints}</span>
                        </div>
                        <div class="required">
                            <p>Required score</p>
                            <span>${result.stats.requiredScore}</span>
                        </div>
                    </div>
                    <p class="message">Don’t worry, keep practicing and you’ll get it!</p>
                    <a href="/learn/grades/${grade}">Close</a>
                </div>
                <div class="result-right">
                    <img alt="sad mascot" src="${MASCOT_MAP.failed}">
                </div>
        `;
    } else { // Test passed
        let isNewTest = learningStats.currentGrade == grade &&
            (nbTest == "final" || learningStats.gradeProgress == nbTest * 10);
        if (isNewTest) {
            learningStats.xp += result.stats.totalPoints;
            learningStats.testsPassed++;
            learningStats.gradeProgress++;
            if (nbTest === "final" && grade != 6) { // if it's the final test of a grade (not the last grade)
                learningStats.currentGrade++;
                learningStats.gradeProgress = 0;
            }
        }

        testResultElem.classList.add("passed");
        let msg = "";
        if (isNewTest) {
            if (nbTest === "final")
                msg = grade === "6"
                    ? "Congratulations, You completed all grades!"
                    : "Congratulations, You unlocked the next grade!"
            else
                msg = "Keep progressing in your learning path!";
        }
        result.content = `
            <div class="result-left">
                <h2>Great Job! You passed!</h2>
                <div class="scores">
                    <div class="earned">
                        <p>Your score</p>
                        <span>${result.stats.totalPoints}</span>
                    </div>
                </div>
                <p class="message">${msg}</p>
                <a href="/learn/grades/${grade}">Close</a>
            </div>
            <div class="result-right">
                <img alt="celebrating mascot" src="${MASCOT_MAP.passed}"><br>
            </div>
        `;
    }
}

async function checkIsUnderlevel(learningStats) {
    let isUnderlevel;

    if (learningStats.currentGrade > grade)
        isUnderlevel = false;

    else if (learningStats.currentGrade < grade)
        isUnderlevel = true;

    else if (nbTest === "final") {
        const kanjiCount = await fetchKanjiCount(grade);
        isUnderlevel = learningStats.gradeProgress < kanjiCount + Math.trunc(kanjiCount / 10);

    } else
        isUnderlevel = learningStats.gradeProgress < nbTest * 10;

    if (isUnderlevel)
        window.location.replace("/error/401?reason=underlevel");
}

function onExit() {
    window.location.href = `/learn/grades/${grade}`;
}

fetchLearningStats().then(async (learningStats) => {
    await checkIsUnderlevel(learningStats); // redirect to unauthorized page if underleveled

    fetchGradeTest(nbTest, grade).then((testData) => {
        displayTest(testData, learningStats, onShowResult, onExit);
    });
});
