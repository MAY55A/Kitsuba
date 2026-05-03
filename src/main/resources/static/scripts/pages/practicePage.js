import {fetchUserData} from "../api/userApi.js";
import {loadAuthNav} from "../ui/authNav.js";
import {playAudio} from "../utils/audio.js";

const container = document.getElementsByClassName("main-container")[0];
const totalKanjiLearned = document.getElementById("total-kanji-learned");
const totalFavourites = document.getElementById("total-favourites");
const grades = document.getElementsByClassName("grade");
const loading = document.getElementById("loading");
const options = document.getElementsByName("questionCount");

let practiceLink;

function displayPracticePage(data) {
    loading.classList.add("hidden");

    totalKanjiLearned.textContent = data.learningStats.totalLearnedKanji + " kanji";
    totalFavourites.textContent = data.favourites.length + " favourites";

    for (let grade of grades) {
        let current = grade.dataset.grade;
        if (current < data.learningStats.currentGrade) {
            grade.classList.add("unlocked");
            let btn = document.createElement("button");
            btn.innerHTML = "Practice";
            btn.addEventListener("click", () => {
                togglePopupDisplay();
                practiceLink = "/practice/grades/" + current;
            });
            grade.appendChild(btn);
        } else {
            grade.classList.add("locked");
            if (current == data.learningStats.currentGrade) {
                grade.insertAdjacentHTML("beforeend", `
                <a href="${'/learn/grades/' + current}">
                    <span>Learn</span>
                    <span class="arrow">&#10140;</span>
                </a>
            `);
            }
        }
    }

    if (data.learningStats.totalLearnedKanji < 10) {
        const btn = document.querySelector("#practice-all button");
        btn.title = "You need to at least have 10 unlocked kanji";
        btn.classList.add("disabled");
        btn.disabled = true;
    }

    if (data.favourites.length < 7) {
        const btn = document.querySelector("#practice-favourites button");
        btn.title = "You need to at least have 7 favourites";
        btn.classList.add("disabled");
        btn.disabled = true;
    }

    container.classList.remove("hidden");
}

function displayPopupModal(totalLearnedKanji) {
    for (let option of options) {

        let nbQuestions = option.value;
        if (nbQuestions > totalLearnedKanji * 2) {
            option.disabled = true;
            option.parentElement.title = "Unlock more kanji to enable this option";
        }
    }
}

function goToTest() {
    let nbQuestions = Array.from(options).find(o => o.checked).value;
    window.location.href = `${practiceLink}?questions=${nbQuestions}`;
}

function togglePopupDisplay() {
    playAudio("/sounds/pop.mp3");
    let popup = document.getElementById("test-params-modal");
    popup.classList.toggle("hidden");
}

document.getElementById("practice-all-btn").addEventListener("click", () => {
    togglePopupDisplay();
    practiceLink = "/practice/all";
});
document.getElementById("practice-favourites-btn").addEventListener("click", () => {
    togglePopupDisplay();
    practiceLink = "/practice/favourites";
});

document.getElementById("confirm-btn").addEventListener("click", goToTest);
document.getElementById("cancel-btn").addEventListener("click", togglePopupDisplay);

loadAuthNav();
fetchUserData().then((data) => {
    displayPracticePage(data);
    displayPopupModal(data.learningStats.totalLearnedKanji);
});
