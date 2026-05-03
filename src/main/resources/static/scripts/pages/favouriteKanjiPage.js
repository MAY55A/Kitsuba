import {fetchKanjiDetails} from "../api/kanjiApi.js";
import {displayKanjiData} from "../render/displayKanji.js";


const kanji = document.getElementById("kanji").textContent;
fetchKanjiDetails(kanji).then(async (data) => {
        displayKanjiData(data, true);
    }
);
