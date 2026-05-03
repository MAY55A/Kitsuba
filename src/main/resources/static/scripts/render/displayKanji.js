import {fetchFavourites, updateUserData} from "../api/userApi.js";
import {audioIcon, bindAudioSymbols} from "../utils/audio.js";

export async function displayKanjiData(data, isFavourite) {
    const heart = document.getElementById("heart");
    const favourites = await fetchFavourites();
    if (isFavourite && !favourites.includes(data.kanji)) {
        window.location.replace("/error/404");
        return;
    }

    document.getElementById('loading').classList.add("hidden");
    let examples = "";
    for (let ex of data.examples.slice(0, 3)) {
        examples += "<div>" + audioIcon(ex.audio) + `${ex.japanese}<br>${ex.meaning}</div>`;
    }
    document.getElementById('kanji-audio').dataset.audio = "http://localhost:8080/" + data.audioPath;
    document.getElementById('examples').innerHTML = examples;
    document.getElementById('meaning').innerText = data.meaning;
    document.getElementById('readings').innerHTML = `Onyomi : ${data.onyomi.katakana} (${data.onyomi.romaji})<br>Kunyomi : ${data.kunyomi.hiragana} (${data.kunyomi.romaji})`;
    document.getElementById('mn-hint').innerText = data.mnHint;
    document.getElementById('radicals').innerHTML = `${data.radicalDetails.character} (${data.radicalDetails.hiragana}) : ${data.radicalDetails.meaning}<br> strokes : ${data.radicalDetails.strokes}<br><img src="${data.radicalDetails.image}" alt="radical image" width="50" height="50">`;
    document.getElementById('kanji-video').querySelector('source').src = data.videoUrl;
    document.getElementById('kanji-video').load();

    bindAudioSymbols(); // enables playing audio when clicking on any audio-symbol inside the current DOM

    // check if the kanji is a favourite or not
    if (favourites.includes(data.kanji)) {
        heart.classList.add("active");
    }

    heart.addEventListener("click", toggleFavourite);

    function toggleFavourite() {
        let isAddedToFavourites = heart.classList.toggle("active");
        isAddedToFavourites ? favourites.push(data.kanji) : favourites.splice(favourites.indexOf(data.kanji), 1);
        updateUserData({"favourites": favourites.join(", ")});
    }
}



