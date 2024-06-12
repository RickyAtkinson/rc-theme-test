const ACTIVE_SLIDE_CLASS = 'active';
const QUESTIONS_JSON = `
{
  "questions": [
    {
      "text": "What is your hair type?",
      "id": "type",
      "options": [
        {
          "text": "Straight",
          "img": "",
          "tags": [
            "straight"
          ]
        },
        {
          "text": "Wavy",
          "img": "",
          "tags": [
            "wavy"
          ]
        },
        {
          "text": "Loose curls",
          "img": "",
          "tags": [
            "Loose Curls",
            "curly"
          ]
        },
        {
          "text": "Spirals",
          "img": "",
          "tags": [
            "Ringlets",
            "curly"
          ]
        },
        {
          "text": "Coils",
          "img": "",
          "tags": [
            "Coils",
            "curly"
          ]
        },
        {
          "text": "Corkscrew curls",
          "img": "",
          "tags": [
            "Cork Screw Curls",
            "curly"
          ]
        }
      ]
    },
    {
      "text": "What is your hair concern?",
      "id": "concern",
      "options": [
        {
          "text": "Breakage & hair growth",
          "img": "",
          "tags": [
            "breakage and hair growth"
          ]
        },
        {
          "text": "Blonde care",
          "img": "",
          "tags": [
            "blonde care"
          ]
        },
        {
          "text": "Vibrant blonde tones",
          "img": "",
          "tags": [
            "vibrant blonde tones"
          ]
        },
        {
          "text": "Curl care",
          "img": "Curl Care",
          "tags": [
            ""
          ]
        },
        {
          "text": "Dry & frizzy",
          "img": "",
          "tags": [
            "dry and frizzy"
          ]
        },
        {
          "text": "Damaged & over processed",
          "img": "",
          "tags": [
            "damage and over processed"
          ]
        },
        {
          "text": "Dull & lacks shine",
          "img": "",
          "tags": [
            "dull and lacks shine"
          ]
        }
      ]
    },
    {
      "text": "How do you style your hair?",
      "id": "style",
      "options": [
        {
          "text": "Hair dryer",
          "img": "",
          "tags": [
            "hair dryer"
          ]
        },
        {
          "text": "Curling iron",
          "img": "",
          "tags": [
            "curling iron"
          ]
        },
        {
          "text": "Straightener",
          "img": "",
          "tags": [
            "straightener"
          ]
        },
        {
          "text": "Protective braids",
          "img": "",
          "tags": [
            ""
          ]
        },
        {
          "text": "Air dry",
          "img": "",
          "tags": [
            "air dry"
          ]
        },
        {
          "text": "Other",
          "img": "",
          "tags": []
        }
      ]
    }
  ]
}
`;

if (!customElements.get('quiz-app')) {
  customElements.define(
    'quiz-app',
    class QuizApp extends HTMLElement {
      constructor() {
        super();
        this.progressBar = this.querySelector('.quiz-app__progress-bar');
        this.controls = this.querySelector('.quiz-app__controls');
        this.resultsSlide = this.querySelector('.quiz-app__slide--results');
        this.prevSlide = null;
        this.currentSlide = 0;

        const questionsObj = JSON.parse(QUESTIONS_JSON);
        questionsObj.questions.forEach((question) => {
          const slideEle = document.createElement('div');
          slideEle.classList.add('quiz-app__slide');

          const questionEle = document.createElement('h2');
          questionEle.innerHTML = question.text;
          slideEle.appendChild(questionEle);

          const instructionEle = document.createElement('p');
          instructionEle.innerHTML = 'Select all that apply';
          slideEle.appendChild(instructionEle);

          const optionsEle = document.createElement('ul');

          question.options.forEach((option, index) => {
            const listItemEle = document.createElement('li');
            const optionEle = document.createElement('input');
            optionEle.type = 'checkbox';
            optionEle.id = `${question.id}-${index}`;
            const optionLabelEle = document.createElement('label');
            optionLabelEle.innerHTML = option.text;
            optionLabelEle.htmlFor = `${question.id}-${index}`;
            listItemEle.appendChild(optionEle);
            listItemEle.appendChild(optionLabelEle);

            optionsEle.appendChild(listItemEle);
          });
          slideEle.appendChild(optionsEle);

          this.insertBefore(slideEle, this.resultsSlide);
        });

        // This needs to be done after the questions slides have been added
        this.slides = Array.from(this.getElementsByClassName('quiz-app__slide'));

        // Progress bar set up
        for (let i = 1; i < this.slides.length; i++) {
          const segmentEle = document.createElement('div');
          segmentEle.classList.add('quiz-app__progress-bar-segment');
          segmentEle.classList.add(`segment-${i}`);
          this.progressBar.appendChild(segmentEle);
        }

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
        const numOfSlides = this.slides.length;

        // Check if the progress bar should be displayed
        if (this.currentSlide > 0 && this.currentSlide < numOfSlides)
          this.progressBar.classList.add(ACTIVE_SLIDE_CLASS);
        else this.progressBar.classList.remove(ACTIVE_SLIDE_CLASS);
        this.updateProgressBar();

        // Check if the controls should be displayed
        if (this.currentSlide > 0 && this.currentSlide < numOfSlides - 1)
          this.controls.classList.add(ACTIVE_SLIDE_CLASS);
        else this.controls.classList.remove(ACTIVE_SLIDE_CLASS);

        if (this.prevSlide != null) this.slides[this.prevSlide].classList.remove(ACTIVE_SLIDE_CLASS);
        this.slides[this.currentSlide].classList.add(ACTIVE_SLIDE_CLASS);
      }

      updateProgressBar() {
        const segments = Array.from(this.getElementsByClassName('quiz-app__progress-bar-segment'));

        for (let i = 0; i < segments.length; i++) {
          if (i < this.currentSlide) {
            console.log(this.currentSlide, i);
            segments[i].classList.add(ACTIVE_SLIDE_CLASS);
          } else {
            segments[i].classList.remove(ACTIVE_SLIDE_CLASS);
          }
        }
      }
    }
  );
}
