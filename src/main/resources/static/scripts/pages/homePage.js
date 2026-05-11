import {fetchRandomKanji, searchKanji} from "../api/kanjiApi.js";
import {loadAuthNav} from "../ui/authNav.js";

const mascot = document.getElementById('mascot');
const searchBtn = document.getElementById('search-btn');
const meaning = document.getElementById("word-meaning");

let randomWordMeanings = [];
let index = 0;

export async function search() {
    const word = document.getElementById("search-input").value.trim();
    if (!word) return;

    let searchOutput = document.querySelector(".search-output");
    if (!searchOutput) {
        const searchBar = document.getElementById("search-bar");
        searchOutput = document.createElement("div");
        searchOutput.classList.add("search-output");
        searchBar.insertAdjacentElement('afterend', searchOutput);
    }

    searchOutput.innerText = "Searching...";
    let result = await searchKanji(word)
    searchOutput.innerHTML = result
        ? `Kanji for "${word}": <strong>${result.kanji.character}</strong>`
        : "No Kanji found for this word, maybe the word is represented by more than one Kanji";
}

export async function getRandom() {
    const word = document.getElementById("random-word");
    const pronunciation = document.getElementById("word-pronunciation");

    let result = await fetchRandomKanji();
    if (result) {
        word.innerHTML = result.word;
        randomWordMeanings = result.meaning.split(/[,;]\s*/);
        meaning.innerText = randomWordMeanings[index];
        pronunciation.innerHTML = `${result.furigana}<br>${result.romaji}`;
    }
}

// Mascot reactions
searchBtn.addEventListener('click', () => {
    mascot.src = '/images/mascot/thinking.png';
    search().then(() => mascot.src = '/images/mascot/happy.png');
});

// Switch between random word meanings
setInterval(() => {
    if (randomWordMeanings.length > 1) {
        index = (index + 1) % randomWordMeanings.length;
        meaning.innerText = randomWordMeanings[index];
        meaning.classList.remove("rotating-word");
        meaning.offsetWidth;
        meaning.classList.add("rotating-word");
    }
}, 3000);


loadAuthNav().then(() => getRandom());