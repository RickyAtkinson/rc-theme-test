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
          "tag": "straight"
        },
        {
          "text": "Wavy",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/wavy.png?v=1717104204",
          "tag": "wavy"
        },
        {
          "text": "Loose curls",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/loose.png?v=1717104204",
          "tag": "Loose Curls"
        },
        {
          "text": "Ringlets",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/ringlets.png?v=1717104204",
          "tag": "Ringlets"
        },
        {
          "text": "Spirals",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/spirals.png?v=1717104204",
          "tag": "curly"
        },
        {
          "text": "Coils",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/coils.png?v=1717104204",
          "tag": "Coils"
        },
        {
          "text": "Corkscrew curls",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/corkscrew.png?v=1717104204",
          "tag": "Cork Screw Curls"
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
          "tag": "breakage and hair growth"
        },
        {
          "text": "Blonde care",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/blonde-care.png?v=1717104221",
          "tag": "blonde care"
        },
        {
          "text": "Vibrant blonde tones",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/vibrant.png?v=1717104220",
          "tag": "vibrant blonde tones"
        },
        {
          "text": "Curl care",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/curl-care.png?v=1717104221",
          "tag": "Curl Care"
        },
        {
          "text": "Dry & frizzy",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/dry.png?v=1717104221",
          "tag": "dry and frizzy"
        },
        {
          "text": "Damaged & over processed",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/damaged.png?v=1717104221",
          "tag": "damage and over processed"
        },
        {
          "text": "Dull & lacks shine",
          "img": "https://cdn.shopify.com/s/files/1/0761/8176/6464/files/shine.png?v=1717104221",
          "tag": "dull and lacks shine"
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
          "tag": "hair dryer"
        },
        {
          "text": "Curling iron",
          "img": "",
          "tag": "curling iron"
        },
        {
          "text": "Straightener",
          "img": "",
          "tag": "straightener"
        },
        {
          "text": "Protective braids",
          "img": "",
          "tag": ""
        },
        {
          "text": "Air dry",
          "img": "",
          "tag": "air dry"
        },
        {
          "text": "Other",
          "img": "",
          "tag": ""
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
        this.loadingSpinner = this.querySelector('.loading__spinner');
        this.loadingSpinner.classList.remove('hidden');
        this.controls = this.querySelector('.quiz-app__controls');
        this.controlsResults = this.querySelector('.quiz-app__controls--results');
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
            if (option.tag != '') optionEle.dataset.tag = option.tag;
            optionEle.classList.add('quiz-app__checkbox');
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
        this.checkboxes = Array.from(this.getElementsByClassName('quiz-app__checkbox'));

        // Progress bar set up
        for (let i = 1; i < this.slides.length; i++) {
          const segmentEle = document.createElement('div');
          segmentEle.classList.add('quiz-app__progress-bar-segment');
          segmentEle.classList.add(`segment-${i}`);
          this.progressBar.appendChild(segmentEle);
        }

        // Add event listeners to buttons
        this.startQuizButton = this.querySelector('.quiz-app__start-quiz-btn');
        this.startQuizButton.addEventListener('click', this.nextQuestion.bind(this));

        this.nextQuestionButton = this.querySelector('.quiz-app__next-question-btn');
        this.nextQuestionButton.addEventListener('click', this.nextQuestion.bind(this));

        this.prevQuestionButton = this.querySelector('.quiz-app__prev-question-btn');
        this.prevQuestionButton.addEventListener('click', this.prevQuestion.bind(this));

        this.restartQuizButtons = Array.from(this.getElementsByClassName('quiz-app__restart-quiz-btn'));
        this.restartQuizButtons.forEach((btn) => {
          btn.addEventListener('click', this.restartQuiz.bind(this));
        });

        this.getResultsButton = this.querySelector('.quiz-app__results-btn');
        this.getResultsButton.addEventListener('click', this.getResults.bind(this));

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

        // Uncheck all inputs
        this.checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });

        this.loadingSpinner.classList.remove('hidden');

        this.renderCurrentSlide();
      }

      async getResults() {
        this.nextQuestion();

        const selectedTags = [];
        this.checkboxes.forEach((checkbox) => {
          if (checkbox.checked) selectedTags.push(checkbox.dataset.tag);
        });

        // TODO: Use GraphQL API to grab products that have at least one matching tag, are active and published
        const productsJsonUrl = location.origin + '/products.json';
        const response = await fetch(productsJsonUrl);
        const productsObj = await response.json();

        const recommendedProducts = [];
        productsObj.products.forEach((product) => {
          if (product.published_at) {
            const intersection = selectedTags.filter((tag) => product.tags.includes(tag));

            if (intersection.length > 0) recommendedProducts.push(product);
          }
        });
        console.log(recommendedProducts);
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
        if (this.currentSlide === numOfSlides - 1) this.controlsResults.classList.add(ACTIVE_SLIDE_CLASS);
        else this.controlsResults.classList.remove(ACTIVE_SLIDE_CLASS);

        // Show correct button in controls
        if (this.currentSlide === numOfSlides - 2) {
          this.nextQuestionButton.classList.add('hidden');
          this.getResultsButton.classList.remove('hidden');
        } else {
          this.nextQuestionButton.classList.remove('hidden');
          this.getResultsButton.classList.add('hidden');
        }

        if (this.prevSlide != null) this.slides[this.prevSlide].classList.remove(ACTIVE_SLIDE_CLASS);
        this.slides[this.currentSlide].classList.add(ACTIVE_SLIDE_CLASS);
      }

      updateProgressBar() {
        const segments = Array.from(this.getElementsByClassName('quiz-app__progress-bar-segment'));

        for (let i = 0; i < segments.length; i++) {
          if (i < this.currentSlide) {
            segments[i].classList.add(ACTIVE_SLIDE_CLASS);
          } else {
            segments[i].classList.remove(ACTIVE_SLIDE_CLASS);
          }
        }
      }
    }
  );
}
