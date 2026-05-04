import {fetchKanjiList} from "../api/kanjiApi.js";
import {fetchUserData} from "../api/userApi.js";

function displayAllKanji(kanjiList, user) {
    document.getElementById('loading').classList.add("hidden");
    const grade = Number(document.getElementById("grade").innerHTML);
    const progressBar = document.getElementById("progress-bar");
    const content = document.getElementById("kanji-list");
    let kanjiUnit = 0;
    let totalUnits = 0;
    let kanjiLink;
    let status = "locked";
    let progress = user.learningStats.gradeProgress;
    let currentGrade = Number(user.learningStats.currentGrade);
    // Display Kanji elements
    while (kanjiUnit < kanjiList.length) {
        if (grade < currentGrade) {
            status = "unlocked";
            kanjiLink = `href = "/learn/grades/${grade}/kanji/?kanji=${kanjiList[kanjiUnit]}"`;
        } else if (currentGrade === grade) {
            if (totalUnits <= progress) {
                status = "unlocked";
                kanjiLink = `href = "/learn/grades/${grade}/kanji?kanji=${kanjiList[kanjiUnit]}"`;
                if (totalUnits === progress)
                    status += " current";
            } else {
                status = "locked";
                kanjiLink = "";
            }
        }
        content.insertAdjacentHTML('beforeend', `<span class="kanji ${status}" title="${status}"><a ${kanjiLink}>${kanjiList[kanjiUnit]}</a></span>`);
        kanjiUnit++;
        totalUnits++
        if (kanjiUnit % 10 === 0) {
            totalUnits++;
            if (status !== "locked")
                kanjiLink = `href = "/learn/grades/${grade}/tests/${Math.trunc(kanjiUnit / 10)}"`;
            content.insertAdjacentHTML('beforeend', `<span class="test ${status}"><a ${kanjiLink}>test</a></span>`);
        }
    }
    content.insertAdjacentHTML('beforeend', `<span class="final-test ${status}">final test</span>`);
    let progressRate = currentGrade === grade ? Math.round(progress / totalUnits * 100) : currentGrade < grade ? 0 : 100;
    progressBar.setAttribute("aria-valuenow", progressRate);
    progressBar.setAttribute("title", `${progressRate}%`);
    progressBar.setAttribute("style", `width: ${progressRate}%;`);
}

const grade = document.getElementById("grade").innerHTML;
fetchUserData().then((user) => {
    if (user.learningStats.currentGrade < grade) {
        window.location.replace("/error/401?reason=underlevel");
    } else {
        fetchKanjiList(grade).then((list) => displayAllKanji(list, user));
    }
});
