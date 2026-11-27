"use strict";

const questions = [
  {
    statement: "If information is online, anyone can freely reuse it.",
    answer: "Myth",
    explanation: "Information being visible online does not automatically make it appropriate to reuse or share."
  },
  {
    statement: "Different details can combine to identify a person.",
    answer: "Fact",
    explanation: "A combination of details can identify a person even if no single detail does so by itself."
  },
  {
    statement: "Data protection matters only to large companies.",
    answer: "Myth",
    explanation: "Students, schools, small groups, and organizations can all handle personal information."
  },
  {
    statement: "A strong password can help protect personal information.",
    answer: "Fact",
    explanation: "A strong password is one useful safeguard, although it is not the only one."
  },
  {
    statement: "A good reason to collect information means collect as much as possible.",
    answer: "Myth",
    explanation: "The principle of proportionality means collecting information appropriate to the purpose, not collecting as much as possible."
  }
];

const welcomeScreen = document.querySelector("#welcome-screen");
const questionScreen = document.querySelector("#question-screen");
const completeScreen = document.querySelector("#complete-screen");
const questionLabel = document.querySelector("#question-label");
const questionNumber = document.querySelector("#question-number");
const progressCount = document.querySelector("#progress-count");
const progressTrack = document.querySelector("#progress-track");
const progressFill = document.querySelector("#progress-fill");
const statementText = document.querySelector("#statement-text");
const mythButton = document.querySelector("#myth-button");
const factButton = document.querySelector("#fact-button");
const feedbackBackdrop = document.querySelector("#feedback-backdrop");
const feedbackDialog = document.querySelector("#feedback-dialog");
const resultIcon = document.querySelector("#result-icon");
const resultEyebrow = document.querySelector("#result-eyebrow");
const feedbackTitle = document.querySelector("#feedback-title");
const correctAnswer = document.querySelector("#correct-answer");
const feedbackExplanation = document.querySelector("#feedback-explanation");
const nextButton = document.querySelector("#next-button");
const scoreNumber = document.querySelector("#score-number");

let currentIndex = 0;
let score = 0;

function showScreen(screenToShow) {
  [welcomeScreen, questionScreen, completeScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
    if (screen === screenToShow) {
      screen.classList.remove("screen");
      void screen.offsetWidth;
      screen.classList.add("screen");
    }
  });
}

function renderQuestion() {
  const question = questions[currentIndex];
  const currentQuestion = currentIndex + 1;
  mythButton.disabled = false;
  factButton.disabled = false;
  questionNumber.textContent = String(currentQuestion).padStart(2, "0");
  progressCount.textContent = String(currentQuestion);
  progressTrack.setAttribute("aria-valuenow", String(currentQuestion));
  progressFill.style.width = `${(currentQuestion / questions.length) * 100}%`;
  statementText.textContent = question.statement;
  showScreen(questionScreen);
  window.requestAnimationFrame(() => mythButton.focus());
}

function showFeedback(selectedAnswer) {
  const question = questions[currentIndex];
  const isCorrect = selectedAnswer === question.answer;
  const iconPath = isCorrect
    ? '<svg viewBox="0 0 48 48" focusable="false"><path d="m10 24 9 9 19-20"/></svg>'
    : '<svg viewBox="0 0 48 48" focusable="false"><path d="m13 13 22 22M35 13 13 35"/></svg>';

  if (isCorrect) score += 1;
  mythButton.disabled = true;
  factButton.disabled = true;

  resultIcon.className = `result-icon ${isCorrect ? "correct" : "incorrect"}`;
  resultIcon.innerHTML = iconPath;
  resultEyebrow.className = `eyebrow result-eyebrow ${isCorrect ? "correct" : "incorrect"}`;
  resultEyebrow.textContent = isCorrect ? "THAT'S RIGHT" : "NOT QUITE";
  feedbackTitle.textContent = isCorrect ? "Correct answer!" : "That's not the answer.";
  correctAnswer.textContent = question.answer.toUpperCase();
  feedbackExplanation.textContent = question.explanation;
  nextButton.innerHTML = currentIndex === questions.length - 1
    ? 'See results <span aria-hidden="true">→</span>'
    : 'Next statement <span aria-hidden="true">→</span>';

  feedbackBackdrop.hidden = false;
  window.requestAnimationFrame(() => feedbackTitle.focus());
}

function continueGame() {
  feedbackBackdrop.hidden = true;
  currentIndex += 1;
  if (currentIndex < questions.length) {
    renderQuestion();
    return;
  }

  scoreNumber.textContent = `${score}/${questions.length}`;
  showScreen(completeScreen);
  document.querySelector("#restart-button").focus();
}

document.querySelector("#start-button").addEventListener("click", renderQuestion);
document.querySelector("#restart-button").addEventListener("click", () => {
  currentIndex = 0;
  score = 0;
  showScreen(welcomeScreen);
  document.querySelector("#start-button").focus();
});
mythButton.addEventListener("click", () => showFeedback("Myth"));
factButton.addEventListener("click", () => showFeedback("Fact"));
nextButton.addEventListener("click", continueGame);

document.addEventListener("keydown", (event) => {
  if (feedbackBackdrop.hidden) return;
  if (event.key === "Tab") {
    event.preventDefault();
    nextButton.focus();
  }
});
