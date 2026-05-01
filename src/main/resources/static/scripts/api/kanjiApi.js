export async function fetchKanjiList(grade) {
    try {
        const response = await fetch(`/api/kanji?grade=${grade}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching kanji list :", error);
    }
}


export async function fetchKanjiId(kanji, grade) {
    try {
        const kanjiList = await fetchKanjiList(grade);
        return kanjiList.indexOf(kanji);

    } catch (error) {
        console.error("Error fetching kanji ID:", error);
        window.location.replace("/error");
    }
}

export async function fetchKanjiDetails(kanji) {
    try {
        const response = await fetch(`/api/kanji/${kanji}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching kanji details :", error);
        window.location.replace("/error");
    }
}

export async function fetchKanjiData(kanji) {
    try {
        const result = await fetchKanjiDetails();
        const nextResponse = await fetch(`/api/kanji/next?kanji=${kanji}&grade=${result.grade}`);
        const previousResponse = await fetch(`/api/kanji/previous?kanji=${kanji}&grade=${result.grade}`);
        const nextUnit = (await nextResponse.json());
        const previousUnit = (await previousResponse.json());
        const id = await fetchKanjiId(kanji, result.grade);

        return {id: id, nextUnit: nextUnit, previousUnit: previousUnit, kanjiData: result};
    } catch (error) {
        console.error("Error fetching kanji data :", error);
        window.location.href = "/error";
    }
}

export async function searchKanji(word) {
    try {
        const response = await fetch(`/api/kanji/search?query=${word}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let res = await response.json() // is always an array (can be empty)

        return res[0] ; // return the first element/kanji (can be undefined)
    } catch (error) {
        console.error("Error searching for kanji :", error);
        return null;
    }
}

export async function fetchRandomKanji() {
    try {
        const response = await fetch(`/api/kanji/random`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return  await response.json();
    } catch (error) {
        console.error("Error fetching random kanji :", error);
        return null;
    }
}