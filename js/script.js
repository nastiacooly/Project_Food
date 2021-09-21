/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/calc.js":
/*!********************************!*\
  !*** ./src/js/modules/calc.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (calc);

/***/ }),

/***/ "./src/js/modules/cards.js":
/*!*********************************!*\
  !*** ./src/js/modules/cards.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _services_services_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/services.js */ "./src/js/services/services.js");


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

    (0,_services_services_js__WEBPACK_IMPORTED_MODULE_0__.getResource)('http://localhost:3000/menu') //получаем данные с JSON-сервера про меню
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cards);

/***/ }),

/***/ "./src/js/modules/forms.js":
/*!*********************************!*\
  !*** ./src/js/modules/forms.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal.js */ "./src/js/modules/modal.js");
/* harmony import */ var _services_services_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/services.js */ "./src/js/services/services.js");



function forms(formSelector, modalSelector, modalTimer) {
    //variables
    const forms = document.querySelectorAll(formSelector);
    
    //Sending forms to server via Fetch API and showing status messages to user
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся.',
        fail: 'Что-то пошло не так...'
    };

    forms.forEach(form => { //для каждой формы вызываем функцию bindPostData
        bindPostData(form);
    });
    
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

            (0,_services_services_js__WEBPACK_IMPORTED_MODULE_1__.postData)('http://localhost:3000/requests', json)
            .then(data => { //действия при успешности запроса
                console.log(data); //показываем полученный от сервера ответ для проверки
                statusMessage.remove();
                (0,_modal_js__WEBPACK_IMPORTED_MODULE_0__.showStatusModal)(modalSelector, message.success, modalTimer);
            })
            .catch(() => { //действия при неуспешности запроса
                (0,_modal_js__WEBPACK_IMPORTED_MODULE_0__.showStatusModal)(modalSelector, message.fail, modalTimer);
            })
            .finally(() => { //действия при любом исходе запроса
                form.reset(); //очистка формы на странице
            });

        });
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (forms);

/***/ }),

/***/ "./src/js/modules/modal.js":
/*!*********************************!*\
  !*** ./src/js/modules/modal.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "toggleModal": () => (/* binding */ toggleModal),
/* harmony export */   "showStatusModal": () => (/* binding */ showStatusModal)
/* harmony export */ });
//Modal window open/close function
function toggleModal(modalSelector, modalTimer) {
    const modal = document.querySelector(modalSelector);
    modal.classList.toggle('hide');
    modal.classList.toggle('show');
    if (modal.classList.contains('show')) {
        document.body.style.overflow = 'hidden'; //unscroll window while modal is on
    } else {
        document.body.style.overflow = ''; //default value
    }

    if (modalTimer) {
        clearInterval(modalTimer); //to stop setTimeout after first opening of modal
    }
    
}


// Shows modal with status messages
function showStatusModal(modalSelector, message, modalTimer) {
    const prevModalDialog = document.querySelector('.modal__dialog'),
        modal = document.querySelector(modalSelector);
    
    prevModalDialog.classList.add('hide');

    if (modal.classList.contains('hide')) {
        //opens modal on the page to show status message (when form was filled directly on the page without modal) 
        toggleModal(modal, modalTimer);
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
            toggleModal(modalSelector);
        }
    }, 4000); //returns previous modal after 4s
}


// General modal function
function modal(modalSelector, modalButtonSelector, modalTimer) {
    //variables
    const openModalButtons = document.querySelectorAll(modalButtonSelector),
        modal = document.querySelector(modalSelector);

    openModalButtons.forEach(btn => {
        btn.addEventListener('click', () => toggleModal(modalSelector, modalTimer));
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-modal') == 'close') { 
            //clicking on a background of modal or x-button to close modal
            toggleModal(modalSelector);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) { //pressing Esc when modal is open
            toggleModal(modalSelector);
        }
    });

    const openModalByScroll = () => { //opens modal when page is scrolled to its bottom
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            toggleModal(modalSelector, modalTimer);
            window.removeEventListener('scroll', openModalByScroll); //not to open every time at the bottom
        }
    };

    window.addEventListener('scroll', openModalByScroll);
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (modal);


/***/ }),

/***/ "./src/js/modules/slider.js":
/*!**********************************!*\
  !*** ./src/js/modules/slider.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function slider({container, slide, prevArrow, nextArrow, current, total, wrapper, field, indicators}) {
    //Slider with navigation dots
    //elements
    let slideIndex = 1;
    let slideOffset = 0;
    const slides = document.querySelectorAll(slide),
    slider = document.querySelector(container),
    prevSlideBtn = document.querySelector(prevArrow),
    nextSlideBtn = document.querySelector(nextArrow),
    currentSlideIndex = document.querySelector(current),
    totalSlidesNumber = document.querySelector(total),
    slidesField = document.querySelector(field),
    slidesWrapper = document.querySelector(wrapper),
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
    sliderDots.classList.add(indicators);
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (slider);

/***/ }),

/***/ "./src/js/modules/tabs.js":
/*!********************************!*\
  !*** ./src/js/modules/tabs.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, tabActiveClass) {
    //Tabs
    // variables
    const tabs = document.querySelectorAll(tabsSelector),
        tabsContent = document.querySelectorAll(tabsContentSelector),
        tabsParent = document.querySelector(tabsParentSelector);

    //functions for tabs
    const hideTabContent = () => {
        tabsContent.forEach(tabContent => {
            tabContent.classList.add('hide');
            tabContent.classList.remove('show', 'fade');
        });

        tabs.forEach(tab => {
            tab.classList.remove(tabActiveClass);
        });
    };

    const showTabContent = (i = 0) => {
        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('show', 'fade'); //fade - CSS-animation
        tabs[i].classList.add(tabActiveClass);
    };

    hideTabContent();
    showTabContent();

    //tab switcher
    tabsParent.addEventListener('click', (e) => {
        let target = e.target; //to simplify the code

        if (target && target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((tab, i) => {
                if (target == tab) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tabs);

/***/ }),

/***/ "./src/js/modules/timer.js":
/*!*********************************!*\
  !*** ./src/js/modules/timer.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function timer(timerSelector, endDate) {
    //Timer
    //variables
    const millisecondsInASecond = 1000,
        millisecondsInADay = millisecondsInASecond * 60 * 60 * 24,
        millisecondsInAnHour = millisecondsInASecond * 60 * 60,
        millisecondsInAMinute = millisecondsInASecond * 60;
        
    //functions for timer
    const getTimeRemaining = (endDate) => {
        //gets time from now to the endtime
        const t = Date.parse(endDate) - Date.parse(new Date()), //in ms
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

    const setTimer = (timerSelector, endDate) => {
        const timer = document.querySelector(timerSelector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector("#minutes"),
            seconds = timer.querySelector('#seconds'),
            //updates timer each second
            timeInterval = setInterval(updateTimer, 1000);

        updateTimer();

        function updateTimer() {
            const t = getTimeRemaining(endDate);
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

    setTimer(timerSelector, endDate);

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (timer);

/***/ }),

/***/ "./src/js/services/services.js":
/*!*************************************!*\
  !*** ./src/js/services/services.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "postData": () => (/* binding */ postData),
/* harmony export */   "getResource": () => (/* binding */ getResource)
/* harmony export */ });
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


const getResource = async (url) => { //общая функция для настройки GET-запросов с сервера
    const result = await fetch(url); //get-запрос

    if(!result.ok) { //если запрос выдал ошибку 404 и т.п.
        throw new Error(`Could not get resources from ${url}, status: ${result.status}`);
    }

    return await result.json(); //это Promise, который при успехе декодирует ответ от сервера в формат JS
};



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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_tabs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/tabs.js */ "./src/js/modules/tabs.js");
/* harmony import */ var _modules_calc_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/calc.js */ "./src/js/modules/calc.js");
/* harmony import */ var _modules_cards_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/cards.js */ "./src/js/modules/cards.js");
/* harmony import */ var _modules_forms_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/forms.js */ "./src/js/modules/forms.js");
/* harmony import */ var _modules_modal_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modules/modal.js */ "./src/js/modules/modal.js");
/* harmony import */ var _modules_slider_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules/slider.js */ "./src/js/modules/slider.js");
/* harmony import */ var _modules_timer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modules/timer.js */ "./src/js/modules/timer.js");


// importing modules










window.addEventListener('DOMContentLoaded', () => {
    // Modal timer
    const modalTimer = setTimeout(() => (0,_modules_modal_js__WEBPACK_IMPORTED_MODULE_4__.toggleModal)('.modal'), 50000); //opens modal after 50s

    // activating modules
    (0,_modules_modal_js__WEBPACK_IMPORTED_MODULE_4__.default)('.modal', '[data-modal="open"]', modalTimer);
    (0,_modules_tabs_js__WEBPACK_IMPORTED_MODULE_0__.default)('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    (0,_modules_calc_js__WEBPACK_IMPORTED_MODULE_1__.default)();
    (0,_modules_cards_js__WEBPACK_IMPORTED_MODULE_2__.default)();
    (0,_modules_forms_js__WEBPACK_IMPORTED_MODULE_3__.default)('form', '.modal', modalTimer);
    (0,_modules_slider_js__WEBPACK_IMPORTED_MODULE_5__.default)({
        container: '.offer__slider',
        slide: '.offer__slide',
        prevArrow: '.offer__slider-prev',
        nextArrow: '.offer__slider-next',
        current: '#current',
        total: '#total',
        field: '.offer__slider-innerwrapper',
        wrapper: '.offer__slider-wrapper',
        indicators: 'slider-indicators'
    });
    (0,_modules_timer_js__WEBPACK_IMPORTED_MODULE_6__.default)('.timer', '2021-12-31');
});
})();

/******/ })()
;
//# sourceMappingURL=script.js.map