/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.addEventListener('DOMContentLoaded', () => {
  //variables
  const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items'),
        deadline = '2021-12-31',
        millisecondsInASecond = 1000,
        millisecondsInADay = millisecondsInASecond * 60 * 60 * 24,
        millisecondsInAnHour = millisecondsInASecond * 60 * 60,
        millisecondsInAMinute = millisecondsInASecond * 60,
        modal = document.querySelector('.modal'),
        openModalButtons = document.querySelectorAll('[data-modal="open"]'),
        forms = document.querySelectorAll('form'); //Tabs
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
  showTabContent(); //tab switcher

  tabsParent.addEventListener('click', e => {
    let target = e.target; //to simplify the code

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((tab, i) => {
        if (target == tab) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  }); //Timer
  //functions for timer

  const getTimeRemaining = endtime => {
    //gets time from now to the endtime
    const t = Date.parse(endtime) - Date.parse(new Date()),
          //in ms
    days = Math.floor(t / millisecondsInADay),
          //days in t
    hours = Math.floor(t / millisecondsInAnHour % 24),
          minutes = Math.floor(t / millisecondsInAMinute % 60),
          seconds = Math.floor(t / millisecondsInASecond % 60);
    return {
      'totalTimeRemaining': t,
      'daysRemaining': days,
      'hoursRemaining': hours,
      'minutesRemaining': minutes,
      'secondsRemaining': seconds
    };
  };

  const putZero = num => {
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
      const t = getTimeRemaining(endtime); //puts numbers to HTML

      days.innerHTML = putZero(t.daysRemaining);
      hours.innerHTML = putZero(t.hoursRemaining);
      minutes.innerHTML = putZero(t.minutesRemaining);
      seconds.innerHTML = putZero(t.secondsRemaining);

      if (t.totalTimeRemaining <= 0) {
        //stops updating timer when endtime comes
        clearInterval(timeInterval);
      }
    }
  };

  setTimer(".timer", deadline); //Modal window open/close

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
  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.getAttribute('data-modal') == 'close') {
      //clicking on a background of modal or x-button
      toggleModal();
    }
  });
  document.addEventListener('keydown', e => {
    if (e.code === "Escape" && modal.classList.contains('show')) {
      //pressing Esc when modal is open
      toggleModal();
    }
  });
  const modalTimer = setTimeout(toggleModal, 50000); //opens modal after 50s

  const openModalByScroll = () => {
    //opens modal when page is scrolled to its bottom
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
      toggleModal();
      window.removeEventListener('scroll', openModalByScroll); //not to open every time at the bottom
    }
  };

  window.addEventListener('scroll', openModalByScroll); //Class for menu items and rendering with GET-requests

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

    render() {
      //метод для создания верстки экземпляра класса
      const menuItemElement = document.createElement('div');

      if (this.classes.length === 0) {
        //this.classes=[] (из-за Rest-оператора), если ничего не передано
        this.classes = 'menu__item';
        menuItemElement.classList.add(this.classes); //добавляем CSS-класс по умолчанию, если через JS-класс они не будут переданы
      } else {
        this.classes.forEach(className => menuItemElement.classList.add(className)); //добавляем переданные через JS-класс CSS-классы элементу
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

  const getResource = async url => {
    //общая функция для настройки GET-запросов с сервера
    const result = await fetch(url); //get-запрос

    if (!result.ok) {
      //если запрос выдал ошибку 404 и т.п.
      throw new Error(`Could not get resources from ${url}, status: ${result.status}`);
    }

    return await result.json(); //это Promise, который при успехе декодирует ответ от сервера в формат JS
  };

  getResource('http://localhost:3000/menu') //получаем данные с JSON-сервера про меню
  .then(data => {
    data.forEach(({
      img,
      altimg,
      title,
      descr,
      price
    }) => {
      //деструктурируем объекты из массива menu db.json
      new MenuItem( //передаем классу в качестве аргументов ключи объектов menu db.json
      img, altimg, title, descr, price, ".menu__field > .container").render(); //метод класса для верстки
    }); //можно также создавать верстку не через класс, а через обычные команды, которые мы прописали в render()
  }); //Sending forms to server via Fetch API and showing status messages to user

  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжемся.',
    fail: 'Что-то пошло не так...'
  };
  forms.forEach(form => {
    //для каждой формы вызываем функцию bindPostData
    bindPostData(form);
  });

  const postData = async (url, data) => {
    //общая функция для настройки POST-запросов на сервер
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
    form.addEventListener('submit', e => {
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

      postData('http://localhost:3000/requests', json).then(data => {
        //действия при успешности запроса
        console.log(data); //показываем полученный от сервера ответ для проверки

        statusMessage.remove();
        showStatusModal(message.success);
      }).catch(() => {
        //действия при неуспешности запроса
        showStatusModal(message.fail);
      }).finally(() => {
        //действия при любом исходе запроса
        form.reset(); //очистка формы на странице
      });
    });
  }

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
    setTimeout(() => {
      thanksModalDialog.remove();
      prevModalDialog.classList.remove('hide');
      prevModalDialog.classList.add('show');

      if (modal.classList.contains('show')) {
        //closes modal if user hasn't clicked x-button himself
        toggleModal();
      }
    }, 4000); //returns previous modal after 4s
  }
});

/***/ })

/******/ });
//# sourceMappingURL=script.js.map