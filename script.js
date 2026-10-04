
const questions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What is your biggest strength?",
    "Tell me about a challenge you faced and how you solved it.",
    "Where do you see yourself in the next five years?"
];

let currentQuestion = 0;


// =========================
// START INTERVIEW
// =========================

function startInterview() {

    currentQuestion = 0;

    document.getElementById("home").classList.add("hidden");

    document
        .getElementById("interview")
        .classList.remove("hidden");

    document
        .getElementById("feedback")
        .classList.add("hidden");

    showQuestion();
}


// =========================
// SHOW QUESTION
// =========================

function showQuestion() {

    document.getElementById("question").textContent =
        questions[currentQuestion];

    document.getElementById("questionNumber").textContent =
        currentQuestion + 1;

    document.getElementById("answer").value = "";

    document
        .getElementById("feedback")
        .classList.add("hidden");
}


// =========================
// ANALYZE ANSWER WITH AI
// =========================

async function analyzeAnswer() {

    const answer = document
        .getElementById("answer")
        .value
        .trim();

    if (answer === "") {
        alert("Please write your answer first.");
        return;
    }

    const loading = document.getElementById("loading");

    loading.classList.remove("hidden");

    try {

        const response = await fetch(
            "http://localhost:5000/api/analyze",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question: questions[currentQuestion],
                    answer: answer
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "AI request failed."
            );
        }

        displayAIResult(data.feedback);

    } catch (error) {

        console.error("AI Error:", error);

        alert(
            "Unable to connect to StudyMate AI. Please make sure the backend is running."
        );

    } finally {

        loading.classList.add("hidden");
    }
}


// =========================
// DISPLAY AI FEEDBACK
// =========================

function displayAIResult(feedback) {

    /*
       Try to extract score from AI response.
       Example:
       SCORE: 8/10
    */

    const scoreMatch =
        feedback.match(/SCORE:\s*(\d+)\s*\/\s*10/i);

    if (scoreMatch) {

        document.getElementById("score").textContent =
            scoreMatch[1];

    } else {

        document.getElementById("score").textContent =
            "--";
    }


    /*
       Display the complete AI feedback.
    */

    document.getElementById("strengths").textContent =
        extractSection(
            feedback,
            "STRENGTHS",
            "IMPROVEMENTS"
        );


    document.getElementById("improvements").textContent =
        extractSection(
            feedback,
            "IMPROVEMENTS",
            "BETTER APPROACH"
        );


    document.getElementById("betterAnswer").textContent =
        extractSection(
            feedback,
            "BETTER APPROACH",
            null
        );


    document
        .getElementById("feedback")
        .classList.remove("hidden");


    document
        .getElementById("feedback")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// =========================
// EXTRACT AI SECTIONS
// =========================

function extractSection(text, start, end) {

    const startIndex =
        text.toUpperCase().indexOf(start);

    if (startIndex === -1) {
        return "No feedback available.";
    }

    let content =
        text.substring(
            startIndex + start.length
        );

    if (end) {

        const endIndex =
            content.toUpperCase().indexOf(end);

        if (endIndex !== -1) {
            content =
                content.substring(0, endIndex);
        }
    }

    return content
        .replace(/^[:\s]+/, "")
        .trim();
}


// =========================
// NEXT QUESTION
// =========================

function nextQuestion() {

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        showQuestion();

        document
            .getElementById("interview")
            .scrollIntoView({
                behavior: "smooth"
            });

    } else {

        showCompletionMessage();

    }
}


// =========================
// INTERVIEW COMPLETE
// =========================

function showCompletionMessage() {

    document.getElementById("interview").innerHTML = `
        <div class="interview-card">

            <h2>🎉 Practice Complete!</h2>

            <p class="hint">
                Great job! You completed your practice interview.
                Keep practicing to build confidence.
            </p>

            <button
                class="primary-btn"
                onclick="location.reload()"
            >
                Practice Again
            </button>

        </div>
    `;
}

