import {fetchLearningStats, updateUserData} from "../api/userApi.js";
import {fetchKanjiData} from "../api/kanjiApi.js";
import {displayKanjiData} from "../render/displayKanji.js";


const kanji = document.getElementById("kanji").textContent;
const grade = document.getElementById("grade").value;
const nextBtn = document.getElementById('next');
const previousBtn = document.getElementById('previous');

let id;
let nextUnit;
let previousUnit;

async function displayButtons(data) {
    let nextLink;
    let prevLink;

    if (previousUnit.kanji != "null") {
        previousBtn.classList.remove("hidden");
        if (previousUnit.isTest !== 0) {
            prevLink = `/learn/grades/${data.grade}/tests/${previousUnit.isTest}`;
            previousBtn.innerText = "TEST";
            previousBtn.classList.add("test");
        } else {
            prevLink = `/learn/grades/${data.grade}/kanji?kanji=${previousUnit.kanji}&id=${id - 1}`;
        }
        previousBtn.addEventListener("click", function () {
            window.location.href = prevLink;
        });
    }
    if (nextUnit.kanji == "null") {
        nextLink = `/learn/grades/${data.grade}/tests/final`;
        nextBtn.innerText = "FINAL TEST";
        nextBtn.classList.add("test");
    } else {
        if (nextUnit.isTest !== 0) {
            nextLink = `/learn/grades/${data.grade}/tests/${nextUnit.isTest}`;
            nextBtn.innerText = "TEST";
            nextBtn.classList.add("test");
        } else {
            nextLink = `/learn/grades/${data.grade}/kanji?kanji=${nextUnit.kanji}&id=${id + 1}`;
        }
    }
    nextBtn.addEventListener("click", function () {
        window.location.href = nextLink;
    });
}

async function addXP(learningStats, kanjiGrade) {
    const isNewKanji =
        learningStats.currentGrade === kanjiGrade &&
        learningStats.gradeProgress === id + Math.trunc(id / 10); // id + number of passed tests

    if (isNewKanji) {
        learningStats.xp += 5;
        learningStats.totalLearnedKanji += 1;
        learningStats.gradeProgress++;

        await updateUserData({"learningStats": learningStats});
    }
}

fetchKanjiData(kanji).then(async (data) => {
        const kanjiData = data.kanjiData;

        id = data.id;
        nextUnit = data.nextUnit;
        previousUnit = data.previousUnit;

        if (kanjiData.grade != grade)
            history.replaceState(null, "", `/learn/grades/${kanjiData.grade}/kanji?kanji=${kanji}`)

        const learningStats = await fetchLearningStats();
        const isUnderlevel = learningStats.currentGrade < kanjiData.grade ||
            learningStats.gradeProgress < id + Math.trunc(id / 10);

        if (isUnderlevel)
            window.location.replace("/error/401?reason=underlevel");

        else {
            addXP(learningStats, kanjiData.grade);
            displayKanjiData(kanjiData);
            displayButtons(kanjiData);
        }
    }
);
