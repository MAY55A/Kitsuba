import {audioIcon, bindAudioSymbols, playAudio} from "../utils/audio.js";
import {updateUserData} from "../api/userApi.js";
import {MASCOT_MAP, SOUNDS_MAP} from "../utils/maps.js";


export async function displayTest(test, learningStats, onShowResult, onExit) {
    const progressBar = document.getElementById("progress-bar");
    const startBtn = document.getElementById("start-btn");
    const loading = document.getElementById('loading');
    const text = document.getElementById('text');
    const word = document.getElementById('word');
    const result = document.getElementById('question-result');
    const nextBtn = document.getElementById('next');
    const input = document.createElement("input");

    // A flag to control when to prevent navigation (only prevent refreshing, other navigations will be controlled manually)
    let preventNavigation = false; // allow navigation before clicking on the start button

    let current = 0;
    let question;
    let totalPoints = 0;
    let errors = 0;
    let correctAnswers = 0;
    let selected;

    input.placeholder = "Enter your answer here";
    nextBtn.disabled = true;

    // Show popup dialog before refreshing or closing tab
    window.addEventListener("beforeunload", (event) => {
        if (preventNavigation) {
            event.preventDefault();
            event.returnValue = "";
        }
    });

    startBtn.addEventListener("click", () => {
        document.getElementById("start").classList.add("hidden");
        displayCurrentQuestion();
        preventNavigation = true;
    });
    input.addEventListener("change", () => {
        nextBtn.disabled = input.value.length === 0;
    });
    nextBtn.addEventListener("click", () => {
        if (nextBtn.innerText === "check") {
            nextBtn.innerText = "continue";
            nextBtn.classList.remove("check");
            if (!question.options) {
                input.disabled = true;
                if (question.correctAnswer.split(", ").includes(input.value.trim().toLowerCase())) {
                    totalPoints += question.points;
                    correctAnswers++;
                    showGoodResult(question.points);
                } else {
                    errors++;
                    showBadResult();
                }
            } else {
                if (selected.innerText === question.correctAnswer) {
                    selected.classList.add("green");
                    totalPoints += question.points;
                    correctAnswers++;
                    showGoodResult(question.points);
                } else {
                    selected.classList.add("red");
                    errors++;
                    showBadResult();
                }
            }
        } else {
            nextBtn.innerText = "check";
            nextBtn.classList.add("check");
            nextBtn.disabled = true;
            current++;
            updateProgressBar();
            displayCurrentQuestion();
        }
    });
    document.getElementById("x").addEventListener("click", () => displayExitPopup(true));
    document.getElementById("exit").addEventListener("click", exitTest);
    document.getElementById("cancel").addEventListener("click", () => displayExitPopup(false));

    loading.classList.add("hidden");
    document.getElementById("start").classList.remove("hidden");

    function displayCurrentQuestion() {
        if (current === test.questions.length)
            showTestResult();
        else {
            question = test.questions[current];
            const oldSection = document.getElementsByTagName("section")[0];
            const newSection = document.createElement("section");

            text.innerText = question.text;
            result.innerHTML = "";
            if (question.type === "SHOW_AUDIO")
                word.innerHTML = audioIcon(question.audio)
            else if (question.type === "SHOW_KANJI" && question.audio !== null)
                word.innerHTML = audioIcon(question.audio) + question.word;
            else
                word.innerHTML = question.word;

            bindAudioSymbols() // enables playing audio when clicking on any audio-symbol inside the current DOM

            if (question.options) {
                selected = null;
                newSection.id = "options";
                for (let option of question.options) {
                    const div = document.createElement("div");
                    div.innerText = option;
                    div.classList.add("option-card");
                    div.addEventListener("click", () => {
                        if (nextBtn.innerText === "check") {
                            if (selected !== null) {
                                selected.classList.remove("selected");
                            }
                            if (selected === div) {
                                selected = null;
                            } else {
                                div.classList.add("selected");
                                selected = div;
                                nextBtn.disabled = false;
                            }
                        }
                    });
                    newSection.appendChild(div);
                }

            } else {
                newSection.id = "answer";
                input.value = "";
                input.disabled = false;
                newSection.appendChild(input);
            }
            oldSection.replaceWith(newSection);
        }
    }

    function showGoodResult(points) {
        playAudio(SOUNDS_MAP.correctAnswer);
        result.innerHTML = `<span class="correct">CORRECT !</span><br>
                <img src="${MASCOT_MAP.correct}" alt="excited mascot">`;
    }

    function showBadResult() {
        playAudio(SOUNDS_MAP.wrongAnswer);
        result.innerHTML = `<span class="wrong">INCORRECT !</span><br>
                        <img src="${MASCOT_MAP.wrong}" alt="disappointed mascot">`;
    }

    async function showTestResult() {
        let testResult = document.getElementById('test-result');
        let testResultModal = document.getElementById('test-result-modal');

        loading.getElementsByTagName("p")[0].textContent = "Loading results, please wait...";
        loading.classList.remove("hidden");

        learningStats.errors += errors;
        learningStats.correctAnswers += correctAnswers;

        let result = {
            stats: {requiredScore: test.requiredScore, correctAnswers, totalPoints, errors},
            content: '',
            audio: SOUNDS_MAP.testPass
        };

        // Assign content and audio to result using test stats, and update learning stats when necessary
        onShowResult(learningStats, result, testResult);

        await updateUserData({"learningStats": learningStats});
        playAudio(result.audio);
        loading.classList.add("hidden");
        testResult.innerHTML = result.content;
        testResultModal.classList.remove("hidden");
        preventNavigation = false;
    }

    function updateProgressBar() {
        let progressRate = current / test.questions.length * 100;
        progressBar.setAttribute("aria-valuenow", progressRate);
        progressBar.setAttribute("style", `width: ${progressRate}%;`);

    }

    function displayExitPopup(bool) {
        let exitPopup = document.getElementById("confirmation-modal");
        if (bool)
            exitPopup.classList.remove("hidden");
        else
            exitPopup.classList.add("hidden");
    }

    function exitTest() {
        preventNavigation = false;
        onExit();
    }
}
