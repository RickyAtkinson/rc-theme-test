const ACTIVE_SLIDE_CLASS = 'active';
const SLIDE_IN_LEFT_CLASS = 'animation--slide-in-left';
const SLIDE_IN_RIGHT_CLASS = 'animation--slide-in-right';
const QUESTIONS_JSON = `
{
  "questions": [
    {
      "text": "What is your hair type?",
      "id": "type",
      "options": [
        {
          "text": "Straight",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/straight.png?v=1717104204",
          "tags": [
            "straight"
          ]
        },
        {
          "text": "Wavy",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/wavy.png?v=1717104204",
          "tags": [
            "wavy"
          ]
        },
        {
          "text": "Loose curls",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/loose.png?v=1717104204",
          "tags": [
            "Loose Curls"
          ]
        },
        {
          "text": "Ringlets",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/ringlets.png?v=1717104204",
          "tags": [
            "Ringlets"
          ]
        },
        {
          "text": "Spirals",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/spirals.png?v=1717104204",
          "tags": [
            "curly"
          ]
        },
        {
          "text": "Coils",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/coils.png?v=1717104204",
          "tags": [
            "Coils"
          ]
        },
        {
          "text": "Corkscrew curls",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/corkscrew.png?v=1717104204",
          "tags": [
            "Cork Screw Curls"
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
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/breakage.png?v=1717104221",
          "tags": [
            "breakage and hair growth"
          ]
        },
        {
          "text": "Blonde care",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/blonde-care.png?v=1717104221",
          "tags": [
            "blonde care"
          ]
        },
        {
          "text": "Vibrant blonde tones",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/vibrant.png?v=1717104220",
          "tags": [
            "vibrant blonde tones"
          ]
        },
        {
          "text": "Curl care",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/curl-care.png?v=1717104221",
          "tags": [
            "Curl Care"
          ]
        },
        {
          "text": "Dry & frizzy",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/dry.png?v=1717104221",
          "tags": [
            "dry and frizzy"
          ]
        },
        {
          "text": "Damaged & over processed",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/damaged.png?v=1717104221",
          "tags": [
            "damage and over processed"
          ]
        },
        {
          "text": "Dull & lacks shine",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/shine.png?v=1717104221",
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
        this.slideWrapper = this.querySelector('.quiz-app__slide-wrapper');
        this.prevSlide = null;
        this.currentSlide = 0;

        // Setup question slides
        const questionsObj = JSON.parse(QUESTIONS_JSON);
        questionsObj.questions.forEach((question) => {
          const slideEle = document.createElement('div');
          slideEle.classList.add('quiz-app__slide');

          // Question text
          const questionEle = document.createElement('h2');
          questionEle.innerHTML = question.text;
          slideEle.appendChild(questionEle);

          // Add instruction text
          const instructionEle = document.createElement('p');
          instructionEle.innerHTML = 'Select all that apply';
          slideEle.appendChild(instructionEle);

          // Create question options list
          const optionsEle = document.createElement('ul');
          question.options.forEach((option, index) => {
            const listItemEle = document.createElement('li');
            const listItemEleClass = option.img != '' ? 'quiz-app__li--img' : 'quiz-app__li--btn';
            listItemEle.classList.add(listItemEleClass);

            const optionEle = document.createElement('input');
            optionEle.type = 'checkbox';
            optionEle.id = `${question.id}-${index}`;

            const optionLabelEle = document.createElement('label');
            optionLabelEle.htmlFor = `${question.id}-${index}`;
            optionLabelEle.tabIndex = '0';

            // Insert image if data includes one
            if (option.img != '') {
              const imgWrapperEle = document.createElement('div');
              imgWrapperEle.classList.add('quiz-app__label-image-wrapper');
              const imgEle = document.createElement('img');
              imgEle.src = option.img;
              imgEle.width = '120';
              imgEle.height = '120';
              imgWrapperEle.appendChild(imgEle);
              optionLabelEle.appendChild(imgWrapperEle);
            }

            const labelTextWrapperEle = document.createElement('span');
            labelTextWrapperEle.innerHTML = option.text;

            optionLabelEle.appendChild(labelTextWrapperEle);
            listItemEle.appendChild(optionEle);
            listItemEle.appendChild(optionLabelEle);
            optionsEle.appendChild(listItemEle);
          });

          slideEle.appendChild(optionsEle);
          this.slideWrapper.insertBefore(slideEle, this.resultsSlide);
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

        // Add event listeners to buttons
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

        this.slides[this.currentSlide].classList.remove(SLIDE_IN_LEFT_CLASS, SLIDE_IN_RIGHT_CLASS);

        this.prevSlide = this.currentSlide;
        this.currentSlide++;

        this.slides[this.currentSlide].classList.add(SLIDE_IN_LEFT_CLASS);

        this.renderCurrentSlide();
      }

      prevQuestion() {
        if (this.currentSlide - 1 < 0) return;

        this.slides[this.currentSlide].classList.remove(SLIDE_IN_LEFT_CLASS, SLIDE_IN_RIGHT_CLASS);

        this.prevSlide = this.currentSlide;
        this.currentSlide--;

        this.slides[this.currentSlide].classList.add(SLIDE_IN_RIGHT_CLASS);

        this.renderCurrentSlide();
      }

      restartQuiz() {
        // TODO: Add confirmation popup

        this.slides[this.currentSlide].classList.remove(SLIDE_IN_LEFT_CLASS, SLIDE_IN_RIGHT_CLASS);

        this.prevSlide = this.currentSlide;
        this.currentSlide = 0;

        this.slides[this.currentSlide].classList.add(SLIDE_IN_RIGHT_CLASS);

        this.renderCurrentSlide();
        // TODO: Reset checkboxes
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

      // removeAnimationClasses() {
      //   this.slides.forEach((slide) => {
      //     slide.classList.remove(
      //       SLIDE_IN_LEFT_CLASS,
      //       SLIDE_IN_RIGHT_CLASS,
      //       SLIDE_OUT_LEFT_CLASS,
      //       SLIDE_OUT_RIGHT_CLASS
      //     );
      //   });
      // }
    }
  );
}
