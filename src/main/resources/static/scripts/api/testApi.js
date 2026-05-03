export async function fetchGradeTest(nbTest, grade) {
    try {
        let response;
        if (nbTest === "final")
            response = await fetch(`/api/quizzes/final-test?grade=${grade}`);
        else
            response = await fetch(`/api/quizzes/unit-test?grade=${grade}&test=${nbTest}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching test :", error);
        window.location.replace("/error");
    }
}

export async function fetchPracticeTest(type, nbQuestions, grade) {
    try {
        let response = await fetch(`/api/quizzes/practice-test?type=${type}&questions=${nbQuestions}&grade=${grade}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching test :", error);
        window.location.replace("/error");
    }
}

export async function fetchSkillQuiz(nbQuestions) {
    try {
        let response = await fetch(`/api/quizzes/skill-quiz?questions=${nbQuestions}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching quiz :", error);
        window.location.replace("/error");
    }
}