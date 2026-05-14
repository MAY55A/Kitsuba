export const MASCOT_MAP = {
    training: "/images/mascot/training.png",
    correct: "/images/mascot/excited.png",
    wrong: "/images/mascot/disappointed.png",
    passed: "/images/mascot/celebrating.png",
    failed: "/images/mascot/sad.png",
};

// Preload images
Object.values(MASCOT_MAP).forEach(src => {
    const img = new Image();
    img.src = src;
});

export const SOUNDS_MAP = {
    correctAnswer: new Audio("/sounds/correct_answer.mp3"),
    wrongAnswer: new Audio("/sounds/wrong_answer.mp3"),
    testPass: new Audio("/sounds/test_pass.mp3"),
    testFail: new Audio("/sounds/test_fail.mp3")
};

export const LEVELS_MAP = {
    N5: {
        jlpt: "N5",
        title: "Beginner",
        description: "You are starting your kanji journey. Focus on basic characters and simple words.",
        image: "/images/levels/beginner.png",
        color: "#fcdfa4"
    },
    N4: {
        jlpt: "N4",
        title: "Apprentice",
        description: "You know basic kanji and can understand simple sentences.",
        image: "/images/levels/apprentice.png",
        color: "#f9be5f"
    },
    N3: {
        jlpt: "N3",
        title: "Adept",
        description: "You can understand common kanji used in everyday situations.",
        image: "/images/levels/adept.png",
        color: "#b36d99"
    },
    N2: {
        jlpt: "N2",
        title: "Master",
        description: "You can read complex texts and understand a wide range of kanji.",
        image: "/images/levels/master.png",
        color: "#ccc5cd"
    },
    N1: {
        jlpt: "N1",
        title: "Sensei",
        description: "You have mastered kanji and can understand advanced and nuanced texts.",
        image: "/images/levels/sensei.png",
        color: "#a24134"
    }
};

export const ACHIEVEMENTS = {
    xp:
        [
            {id: "xp_100", title: "Getting Started", desc: "Reach 100 XP", condition: (stats) => stats.xp >= 100},
            {id: "xp_1000", title: "On Your Way", desc: "Reach 1000 XP", condition: (stats) => stats.xp >= 1000},
            {
                id: "xp_10000",
                title: "Dedicated Learner",
                desc: "Reach 10000 XP",
                condition: (stats) => stats.xp >= 10000
            }
        ],
    kanji:
        [
            {
                id: "kanji_10",
                title: "First Steps",
                desc: "Learn 10 kanji",
                condition: (stats) => stats.totalLearnedKanji >= 10
            },
            {
                id: "kanji_50",
                title: "Getting Comfortable",
                desc: "Learn 50 kanji",
                condition: (stats) => stats.totalLearnedKanji >= 50
            },
            {
                id: "kanji_100",
                title: "Building Momentum",
                desc: "Learn 100 kanji",
                condition: (stats) => stats.totalLearnedKanji >= 100
            },
            {
                id: "kanji_500",
                title: "Serious Learner",
                desc: "Learn 500 kanji",
                condition: (stats) => stats.totalLearnedKanji >= 500
            },
            {
                id: "kanji_1000",
                title: "Kanji Master",
                desc: "Learn 1000 kanji",
                condition: (stats) => stats.totalLearnedKanji >= 1000
            }
        ]
}