$(document).ready(function () {
    let questions = [];
    let currentQuestionIndex = 0;
    const quizInner = $('.quiz__inner');
    const progressInner = $('.progress__inner');
    const summaryDiv = $('#summary');

    function loadQuestions() {
        $.ajax({
            url: './questions.json',
            dataType: 'json',
            success: function (data) {
                questions = data;
                loadQuiz();
            },
            error: function (xhr, status, error) {
                console.error("Error loading questions:", error);
                alert("Could not load questions. Please try again later.");
            }
        });
    }

    function loadQuiz() {
        questions.forEach((_, index) => loadQuestion(index));
        updateProgress();
        bindEvents();
    }

    function loadQuestion(index) {
        const questionData = questions[index];
        const questionHTML = `
            <div data-question="${index + 1}" class="quiz__step quiz__step--${index + 1} ${index === 0 ? 'quiz__step--current' : ''}">
                <div class="question__emoji">${getEmoji(index)}</div>
                <h1 class="quiz__question">${questionData.question}</h1>
                ${questionData.options.map((option, i) => `
                    <div class="answer">
                        <input class="answer__input" type="radio" id="q${index}_option${i}" name="question${index}" value="${option}">
                        <label class="answer__label" for="q${index}_option${i}">${option}</label>
                    </div>
                `).join('')}
            </div>
        `;
        quizInner.append(questionHTML);
    }

    function getEmoji(index) {
        const emojis = ["🌸", "😳", "👍"];
        return emojis[index] || "❓";
    }

    function showNextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            $(`.quiz__step--${currentQuestionIndex + 1}`).removeClass('quiz__step--current');
            currentQuestionIndex++;
            $(`.quiz__step--${currentQuestionIndex + 1}`).addClass('quiz__step--current');
            updateProgress();
        } else {
            showSummary();
        }
    }

    function showPreviousQuestion() {
        if (currentQuestionIndex > 0) {
            $(`.quiz__step--${currentQuestionIndex + 1}`).removeClass('quiz__step--current');
            currentQuestionIndex--;
            $(`.quiz__step--${currentQuestionIndex + 1}`).addClass('quiz__step--current');
            updateProgress();
        }
    }

    function updateProgress() {
        const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressInner.css('width', `${progressPercentage}%`);
    }

    function showSummary() {
        let score = 0;

        questions.forEach((question, index) => {
            const selectedOption = $(`input[name="question${index}"]:checked`).val();
            if (selectedOption === question.correct) {
                score++;
            }
        });

        const summaryHTML = `<h2>Your Score: ${score} out of ${questions.length}</h2>`;

        summaryDiv.html(summaryHTML);
        $('.quiz__step--current').removeClass('quiz__step--current');
        $('.quiz__summary').addClass('quiz__step--current');
    }

    function bindEvents() {
        $('.navigation__btn--right').click(function () {
            showNextQuestion();
        });

        $('.navigation__btn--left').click(function () {
            showPreviousQuestion();
        });

        $('.submit').click(function (e) {
            e.preventDefault();
            showSummary();
        });
    }

    loadQuestions();
});