/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/calc.js":
/*!********************************!*\
  !*** ./src/js/modules/calc.js ***!
  \********************************/
/***/ ((module) => {

function calc() {
    //variables
    const calcResult = document.querySelector('.calculating__result span');

    // Calculator
    let sex, height, weight, age, ratio, formula;
    let previousGenderChoice = localStorage.getItem('gender');
    let previousRatioChoice = localStorage.getItem('ratio');

    if (previousGenderChoice) {
        sex = previousGenderChoice;
    }

    if (previousRatioChoice) {
        ratio = previousRatioChoice;
    }

    function highlightStoredInputs(parentSelector, activeClass) {
        const parent = document.querySelector(parentSelector);
        // adding active class for inputs stored in local storage
        if (previousGenderChoice && parentSelector === "#gender") {
            let input = parent.querySelector(`#${previousGenderChoice}`);
            input.classList.add(activeClass);
        }

        if (previousRatioChoice && parentSelector === "#activity") {
            let input = parent.querySelector(`[data-ratio="${previousRatioChoice}"]`);
            input.classList.add(activeClass);
        }
    }

    highlightStoredInputs('#gender', 'calculating__choose-item_active');
    highlightStoredInputs('#activity', 'calculating__choose-item_active');


    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            // if user did not fill any of the required inputs, calculation cannot be performed
            calcResult.textContent = "____";
            return;
        }

        if (sex === "female") {
            formula = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
        } else if (sex === "male") {
            formula = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
        }

        // calculating result and rendering to DOM
        calcResult.textContent = Math.ceil((formula) * ratio);
    }

    calcTotal();


    function getStaticInputsData(parentSelector, activeClass) {
        const parent = document.querySelector(parentSelector);
        const staticInputs = parent.querySelectorAll('div');
        
        parent.addEventListener('click', (e) => {
            if (e.target === parent) {
                // clicking on a parent should not do anything
                return;
            }
            
            if (e.target.dataset.ratio) {
                // for inputs with activity ratio
                ratio = +e.target.dataset.ratio;
                localStorage.setItem('ratio', ratio);
            } else {
                // for inputs with female/male choice
                sex = e.target.id;
                localStorage.setItem('gender', sex);
            }

            // removing active class from all static inputs except the clicked one
            staticInputs.forEach(input => {
                input.classList.remove(activeClass);
            });
            e.target.classList.add(activeClass);

            calcTotal();
        });

    }

    getStaticInputsData('#gender', 'calculating__choose-item_active');
    getStaticInputsData('#activity', 'calculating__choose-item_active');


    function getDynamicInputsData(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            // highlighting input in red in case of non-digit input, otherwise - in green
            if (input.value.match(/\D/g)) {
                input.classList.add('calculating__choose-item_highlighted-error');
                input.classList.remove('calculating__choose-item_highlighted-success');
            } else {
                input.classList.remove('calculating__choose-item_highlighted-error');
                input.classList.add('calculating__choose-item_highlighted-success');
            }
            
            // getting user input
            switch(input.id) {
                case 'height': 
                    height = +input.value;
                    break;
                case 'weight': 
                    weight = +input.value;
                    break;
                case 'age': 
                    age = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDynamicInputsData("#height");
    getDynamicInputsData("#weight");
    getDynamicInputsData("#age");
    // end of calculator
}

module.exports = calc;

/***/ }),

/***/ "./src/js/modules/cards.js":
/*!*********************************!*\
  !*** ./src/js/modules/cards.js ***!
  \*********************************/
/***/ ((module) => {

function cards() {
    //Class for menu items and rendering with GET-requests
    class MenuItem {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes; //через Rest-оператор, чтобы в будущем передавать неограниченное число классов
            this.parent = document.querySelector(parentSelector);
            this.transfer = 74;
            this.changeToRUB();
        }

        changeToRUB() {
            this.price = this.price * this.transfer;
        }

        render() { //метод для создания верстки экземпляра класса
            const menuItemElement = document.createElement('div');

            if (this.classes.length === 0) { //this.classes=[] (из-за Rest-оператора), если ничего не передано
                this.classes = 'menu__item';
                menuItemElement.classList.add(this.classes);
                //добавляем CSS-класс по умолчанию, если через JS-класс они не будут переданы
            } else {
                this.classes.forEach(className => menuItemElement.classList.add(className)); 
                //добавляем переданные через JS-класс CSS-классы элементу
            }
            
            menuItemElement.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                    </div>
            `;
            this.parent.append(menuItemElement); //добавляем верстку внутрь родителя
        }
    }

    const getResource = async (url) => { //общая функция для настройки GET-запросов с сервера
        const result = await fetch(url); //get-запрос

        if(!result.ok) { //если запрос выдал ошибку 404 и т.п.
            throw new Error(`Could not get resources from ${url}, status: ${result.status}`);
        }

        return await result.json(); //это Promise, который при успехе декодирует ответ от сервера в формат JS
    };

    getResource('http://localhost:3000/menu') //получаем данные с JSON-сервера про меню
    .then(data => {
        data.forEach(({img, altimg, title, descr, price}) => { //деструктурируем объекты из массива menu db.json
            new MenuItem( //передаем классу в качестве аргументов ключи объектов menu db.json
                img, 
                altimg, 
                title, 
                descr, 
                price, 
                ".menu__field > .container"
            ).render(); //метод класса для верстки
        }); //можно также создавать верстку не через класс, а через обычные команды, которые мы прописали в render()
    });

    /* axios.get('http://localhost:3000/menu') //get-запрос при помощи библиотеки axios
    .then(data => {
        data.data.forEach(({img, altimg, title, descr, price}) => {
            new MenuItem(
                img, 
                altimg, 
                title, 
                descr, 
                price, 
                ".menu__field > .container"
            ).render();
        });
    }); */
}

module.exports = cards;

/***/ }),

/***/ "./src/js/modules/forms.js":
/*!*********************************!*\
  !*** ./src/js/modules/forms.js ***!
  \*********************************/
/***/ ((module) => {

function forms() {
    //variables
    const forms = document.querySelectorAll('form');
    
    //Sending forms to server via Fetch API and showing status messages to user
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся.',
        fail: 'Что-то пошло не так...'
    };

    forms.forEach(form => { //для каждой формы вызываем функцию bindPostData
        bindPostData(form);
    });

    const postData = async (url, data) => { //общая функция для настройки POST-запросов на сервер
        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await result.json(); //это Promise, который при успехе декодирует ответ от сервера в формат JS
    };
    
    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); //убираем стандартное поведение браузера при отправке формы

            //создаем блок для значка загрузки
            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                padding-top: 10px;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage); //выводим блок в конце формы

            const formData = new FormData(form); //переформатируем данные формы в FormData
            const json = JSON.stringify(Object.fromEntries(formData.entries())); //formData переводим в формат JSON

            postData('http://localhost:3000/requests', json)
            .then(data => { //действия при успешности запроса
                console.log(data); //показываем полученный от сервера ответ для проверки
                statusMessage.remove();
                showStatusModal(message.success);
            })
            .catch(() => { //действия при неуспешности запроса
                showStatusModal(message.fail);
            })
            .finally(() => { //действия при любом исходе запроса
                form.reset(); //очистка формы на странице
            });

        });
    }
}

module.exports = forms;

/***/ }),

/***/ "./src/js/modules/modal.js":
/*!*********************************!*\
  !*** ./src/js/modules/modal.js ***!
  \*********************************/
/***/ ((module) => {

function modal() {
    //variables
    const openModalButtons = document.querySelectorAll('[data-modal="open"]'),
        modal = document.querySelector('.modal');

    //Modal window open/close
    const toggleModal = () => {
        modal.classList.toggle('hide');
        modal.classList.toggle('show');
        if (modal.classList.contains('show')) {
            document.body.style.overflow = 'hidden'; //unscroll window while modal is on
        } else {
            document.body.style.overflow = ''; //default value
        }
        clearInterval(modalTimer); //to stop setTimeout after first opening of modal
    };

    openModalButtons.forEach(btn => {
        btn.addEventListener('click', toggleModal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-modal') == 'close') { 
            //clicking on a background of modal or x-button
            toggleModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) { //pressing Esc when modal is open
            toggleModal();
        }
    });

    const modalTimer = setTimeout(toggleModal, 50000); //opens modal after 50s

    const openModalByScroll = () => { //opens modal when page is scrolled to its bottom
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            toggleModal();
            window.removeEventListener('scroll', openModalByScroll); //not to open every time at the bottom
        }
    };

    window.addEventListener('scroll', openModalByScroll);

    function showStatusModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');

        if (modal.classList.contains('hide')) {
            //opens modal on the page to show status message (when form was filled directly on the page without modal) 
            toggleModal();
        }

        const thanksModalDialog = document.createElement('div');
        thanksModalDialog.classList.add('modal__dialog');
        thanksModalDialog.innerHTML = `
        <div class="modal__content">
            <div data-modal="close" class="modal__close">&times;</div>
            <div class="modal__title">${message}</div>
        </div>
        `;
        modal.append(thanksModalDialog);

        setTimeout( () => {
            thanksModalDialog.remove();
            prevModalDialog.classList.remove('hide');
            prevModalDialog.classList.add('show');
            if (modal.classList.contains('show')) {
                //closes modal if user hasn't clicked x-button himself
                toggleModal();
            }
        }, 4000); //returns previous modal after 4s
    }
}

module.exports = modal;

/***/ }),

/***/ "./src/js/modules/slider.js":
/*!**********************************!*\
  !*** ./src/js/modules/slider.js ***!
  \**********************************/
/***/ ((module) => {

function slider() {
    //Slider with navigation dots
    //variables
    let slideIndex = 1;
    let slideOffset = 0;
    const slides = document.querySelectorAll('.offer__slide'),
    slider = document.querySelector('.offer__slider'),
    prevSlideBtn = document.querySelector('.offer__slider-prev'),
    nextSlideBtn = document.querySelector('.offer__slider-next'),
    currentSlideIndex = document.querySelector('#current'),
    totalSlidesNumber = document.querySelector('#total'),
    slidesField = document.querySelector('.offer__slider-innerwrapper'),
    slidesWrapper = document.querySelector('.offer__slider-wrapper'),
    widthForSlider = window.getComputedStyle(slidesWrapper).width;


    function deleteNonDigits(str) { //удаляет всё, кроме цифр, в строке
        return +str.replace(/\D/g, "");
    }
    
    const width = deleteNonDigits(widthForSlider); //ширина в цифрах из CSS (без приписки px)

    function changeTotalSlidesNumberIndicator(totalIndicator) {
        if (slides.length < 10) {
            totalIndicator.textContent = `0${slides.length}`;
        } else {
            totalIndicator.textContent = slides.length;
        }
    }

    function changeCurrentSlideNumberIndicator(currentIndicator) {
        if (slides.length < 10) {
            currentIndicator.textContent = `0${slideIndex}`;
        } else {
            currentIndicator.textContent = slideIndex;
        }
    }

    changeTotalSlidesNumberIndicator(totalSlidesNumber);
    changeCurrentSlideNumberIndicator(currentSlideIndex);

    slidesField.style.display = 'flex';
    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.transition = '0.5s all';
    slidesWrapper.style.overflow = 'hidden';
    slides.forEach(slide => {
        slide.style.width = widthForSlider; //чтобы все картинки были одинаковой ширины
    });

    //for creating navigation dots
    slider.style.position = 'relative';
    const dots = [];

    const sliderDots = document.createElement('ol');
    sliderDots.classList.add('slider-indicators');
    slider.append(sliderDots);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.classList.add('dot');
        dot.setAttribute('data-slide-to', i + 1);

        if (i == 0) {
            dot.style.opacity = 1;
        }

        sliderDots.append(dot);
        dots.push(dot);
    }

    function lightenActiveDot() {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    }
    //end of creating nav dots

    nextSlideBtn.addEventListener('click', () => {
        if (slideOffset == width * (slides.length - 1)) {
            slideOffset = 0;
        } else {
            slideOffset += width;
        }

        slidesField.style.transform = `translateX(-${slideOffset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        changeCurrentSlideNumberIndicator(currentSlideIndex);

        lightenActiveDot();
    });

    prevSlideBtn.addEventListener('click', () => {
        if (slideOffset == 0) {
            slideOffset = width * (slides.length - 1);
        } else {
            slideOffset -= width;
        }

        slidesField.style.transform = `translateX(-${slideOffset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        changeCurrentSlideNumberIndicator(currentSlideIndex);

        lightenActiveDot();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            slideOffset = width * (slideTo - 1);

            slidesField.style.transform = `translateX(-${slideOffset}px)`;

            changeCurrentSlideNumberIndicator(currentSlideIndex);

            lightenActiveDot();
        });
    });
    //end of slider

    /* Slider - First option

    showSlideByIndex(slideIndex);

    if (slides.length < 10) {
        totalSlidesNumber.textContent = `0${slides.length}`;
    } else {
        totalSlidesNumber.textContent = slides.length;
    }

    function showSlideByIndex(index) {

        if (index > slides.length) {
            slideIndex = 1; //если долистали до последнего слайда, снова включаем первый
        }

        if (index < 1) {
            slideIndex = slides.length; //если листаем влево от первого слайда, то включаем последний
        }

        slides.forEach(slide => slide.classList.add('hide'));
        slides[slideIndex - 1].classList.add('show');
        slides[slideIndex - 1].classList.remove('hide');

        if (slides.length < 10) { //приписываем нолик маленьким цифрам
            currentSlideIndex.textContent = `0${slideIndex}`;
        } else {
            currentSlideIndex.textContent = `${slideIndex}`;
        }
    }

    function changeSlideIndexByN(n) {
        showSlideByIndex(slideIndex += n);
    }

    prevSlideBtn.addEventListener('click', () => {
        changeSlideIndexByN(-1);
    });

    nextSlideBtn.addEventListener('click', () => {
        changeSlideIndexByN(1);
    }); */
}

module.exports = slider;

/***/ }),

/***/ "./src/js/modules/tabs.js":
/*!********************************!*\
  !*** ./src/js/modules/tabs.js ***!
  \********************************/
/***/ ((module) => {

function tabs() {
    //Tabs
    // variables
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    //functions for tabs
    const hideTabContent = () => {
        tabsContent.forEach(tabContent => {
            tabContent.classList.add('hide');
            tabContent.classList.remove('show', 'fade');
        });

        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active');
        });
    };

    const showTabContent = (i = 0) => {
        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('show', 'fade'); //fade - CSS-animation
        tabs[i].classList.add('tabheader__item_active');
    };

    hideTabContent();
    showTabContent();

    //tab switcher
    tabsParent.addEventListener('click', (e) => {
        let target = e.target; //to simplify the code

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((tab, i) => {
                if (target == tab) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
}

module.exports = tabs;

/***/ }),

/***/ "./src/js/modules/timer.js":
/*!*********************************!*\
  !*** ./src/js/modules/timer.js ***!
  \*********************************/
/***/ ((module) => {

function timer() {
    //Timer
    //variables
    const deadline = '2021-12-31',
        millisecondsInASecond = 1000,
        millisecondsInADay = millisecondsInASecond * 60 * 60 * 24,
        millisecondsInAnHour = millisecondsInASecond * 60 * 60,
        millisecondsInAMinute = millisecondsInASecond * 60;
        
    //functions for timer
    const getTimeRemaining = (endtime) => {
        //gets time from now to the endtime
        const t = Date.parse(endtime) - Date.parse(new Date()), //in ms
            days = Math.floor(t / millisecondsInADay), //days in t
            hours = Math.floor( (t / millisecondsInAnHour) % 24 ), 
            minutes = Math.floor( (t / millisecondsInAMinute) % 60),
            seconds = Math.floor( (t / millisecondsInASecond) % 60);
        
        return {
            'totalTimeRemaining': t,
            'daysRemaining': days,
            'hoursRemaining': hours,
            'minutesRemaining': minutes,
            'secondsRemaining': seconds
        };
    };

    const putZero = (num) => {
        //returns small numbers with zero in front
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    };

    const setTimer = (timerSelector, endtime) => {
        const timer = document.querySelector(timerSelector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector("#minutes"),
            seconds = timer.querySelector('#seconds'),
            //updates timer each second
            timeInterval = setInterval(updateTimer, 1000);

        updateTimer();

        function updateTimer() {
            const t = getTimeRemaining(endtime);
            //puts numbers to HTML
            days.innerHTML = putZero(t.daysRemaining);
            hours.innerHTML = putZero(t.hoursRemaining);
            minutes.innerHTML = putZero(t.minutesRemaining);
            seconds.innerHTML = putZero(t.secondsRemaining);

            if(t.totalTimeRemaining <= 0) {
                //stops updating timer when endtime comes
                clearInterval(timeInterval);
            }
        }
    };

    setTimer(".timer", deadline);

}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/


window.addEventListener('DOMContentLoaded', () => {
    // importing modules
    const tabs = __webpack_require__(/*! ./modules/tabs */ "./src/js/modules/tabs.js"),
        calc = __webpack_require__(/*! ./modules/calc */ "./src/js/modules/calc.js"),
        cards = __webpack_require__(/*! ./modules/cards */ "./src/js/modules/cards.js"),
        forms = __webpack_require__(/*! ./modules/forms */ "./src/js/modules/forms.js"),
        modal = __webpack_require__(/*! ./modules/modal */ "./src/js/modules/modal.js"),
        slider = __webpack_require__(/*! ./modules/slider */ "./src/js/modules/slider.js"),
        timer = __webpack_require__(/*! ./modules/timer */ "./src/js/modules/timer.js");
    
    // activating modules
    modal();
    tabs();
    calc();
    cards();
    forms();
    slider();
    timer();
});
})();

/******/ })()
;
//# sourceMappingURL=script.js.map