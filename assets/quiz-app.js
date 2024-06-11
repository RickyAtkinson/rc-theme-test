const ACTIVE_SLIDE_CLASS = 'active';

if (!customElements.get('quiz-app')) {
  customElements.define(
    'quiz-app',
    class QuizApp extends HTMLElement {
      constructor() {
        super();
        this.slides = Array.from(this.getElementsByClassName('quiz-app__slide'));
        this.prevSlide = null;
        this.currentSlide = 0;

        this.nextQuestionButtons = Array.from(this.getElementsByClassName('quiz-app__next-question-btn'));
        this.nextQuestionButtons.forEach((btn) => {
          btn.addEventListener('click', this.nextQuestion.bind(this));
        });

        this.prevQuestionButtons = Array.from(this.getElementsByClassName('quiz-app__prev-question-btn'));
        this.prevQuestionButtons.forEach((btn) => {
          btn.addEventListener('click', this.prevQuestion.bind(this));
        });

        this.restartQuizButtons = Array.from(this.getElementsByClassName('quiz-app__restart-quiz-btn'));
        this.restartQuizButtons.forEach((btn) => {
          btn.addEventListener('click', this.restartQuiz.bind(this));
        });

        this.renderCurrentSlide();
      }

      nextQuestion() {
        if (this.currentSlide + 1 >= this.slides.length) return;

        this.prevSlide = this.currentSlide;
        this.currentSlide++;
        this.renderCurrentSlide();
      }

      prevQuestion() {
        if (this.currentSlide - 1 < 0) return;

        this.prevSlide = this.currentSlide;
        this.currentSlide--;
        this.renderCurrentSlide();
      }

      restartQuiz() {
        // TODO: Add confirmation popup
        this.prevSlide = this.currentSlide;
        this.currentSlide = 0;
        this.renderCurrentSlide();
      }

      renderCurrentSlide() {
        if (this.prevSlide != null) this.slides[this.prevSlide].classList.remove(ACTIVE_SLIDE_CLASS);
        this.slides[this.currentSlide].classList.add(ACTIVE_SLIDE_CLASS);
      }
    }
  );
}
