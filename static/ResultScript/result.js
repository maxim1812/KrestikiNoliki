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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для управления авторизацией пользователя
class AuthorizationControl{
    // конструктор
    // инициализация полей класса
    constructor(elementFinder,stringController,messageElement,boxRender){
        // инициализируем поля класса вспомогательными объектами
        this.elementFinder = elementFinder;
        this.stringController = stringController;
        this.message = messageElement;
        this.boxRender = boxRender;
    }

    // метод для проверки корректности логина и пароля
    controlLoginAndPasswordStringsInAuthorizationForm(){
        // получаем содержимое логина и пароля
        // получаем логин
        const loginString = this.elementFinder.getElement("authorization-box__login-field_black-shadow").value;
        // получаем пароль
        const passwordString = this.elementFinder.getElement("authorization-box__password-field_black-shadow").value;
        // очищаем элемент для вывода сообщений
        this.message.clear();
        // переменная - флаг, для контроля, обе ли строки логина и пароля корректны
        let stringsOK = true;
        // проверка логина на корректность
        const loginResult = this.stringController.isNormalString(loginString);
        switch(loginResult){
            // если логин - пустая строка
            case "EMPTY":
                this.message.addText("Поле ввода логина пусто.");
                stringsOK = false;
                break;
            // если логин содержит некорректные символы
            case "NO_CORRECT":
                this.message.addText("Поле ввода логина содержит запретные символы.");
                stringsOK = false;
                break;
        }
        // проверка пароля на корректность
        const passwordResult = this.stringController.isNormalString(passwordString);
        // если пароль - пустая строка
        switch(passwordResult){
            case "EMPTY":
                this.message.addText("Поле ввода пароля пусто.");
                stringsOK = false;
                break;
            // если пароль содержит некорректные символы
            case "NO_CORRECT":
                this.message.addText("Поле ввода пароля содержит запретные символы.");
                stringsOK = false;
                break;
        }
        // возврат результата проверки
        return stringsOK;
    }

    // метод для попытки авторизации пользователя
    authorize(url,router,isAuthorized){
        // проверяем, корректны ли логин и пароль
        const flag = this.controlLoginAndPasswordStringsInAuthorizationForm();
        // если логин и пароль прошли проверку на корректность
        if(flag === true){
            // получаем логин и пароль
            // получаем логин
            const loginString = this.elementFinder.getElement("authorization-box__login-field_black-shadow").value;
            // получаем пароль
            const passwordString = this.elementFinder.getElement("authorization-box__password-field_black-shadow").value;
            // создаём JSON объект
            let myObjJSON = {
                login: loginString,
                password: passwordString
            };
            // объект для вывода сообщений
            let message = this.message;
            // объект для поиска элемента
            let elementFinder = this.elementFinder;
            // объект для отображения бокса
            let boxRender = this.boxRender;
            // отправка данных на сервер
            // создаём строку - запрос
            const query = url + "scr2.php?content=" + JSON.stringify(myObjJSON);
            // создаём объект для отправки запроса
            let request = new XMLHttpRequest();
            request.open("POST",query);
            request.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
            request.send(null);
            // при получении ответа с сервера
            request.onreadystatechange = function(){
                // если ответ нормальный
                if(request.readyState === 4 && request.status === 200){
                    if(request.responseText === "YES"){
                        // авторизация прошла успешно
                        // меняем содержимое полей объекта, отвечающего за авторизованность пользователя
                        isAuthorized.flag = true;
                        isAuthorized.login = loginString;
                        // выводим содержимое логина на странице профиля
                        elementFinder.getElement("my-profile-box__user-login_big-text").innerHTML = "Логин: " + isAuthorized.login;
                        // переходим на страницу профиля
                        router.setPathName("/profile");
                    }else{
                        // ошибка авторизации, неверный логин или пароль
                        message.setText("К сожалению, вы ввели неверный логин или пароль.");
                    }
                }
            }

        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AuthorizationControl;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для скрытия и показа боксов
class BoxRender{
    // создание полей класса
    constructor(){
        // поле - массив, хранящий имена боксов
        this.arr = [];
    }

    // добавление имени бокса в массив
    addBox(boxClass){
        // кладём имя класса бокса в конец массива
        this.arr.push(boxClass);
    }

    // возврат бокса с определённым классом
    getBox(boxClass){
        // получаем массив боксов с данным именем класса
        let elements = document.getElementsByClassName(boxClass);
        // получаем первый (нулевой) бокс с данным именем класса
        let box = elements[0];
        // возвращаем полученный бокс
        return box;
    }

    // спрятать все боксы
    hideAllBoxes(){
        // пробегаемся по всему массиву с именами боксов
        for(let i = 0; i < this.arr.length; i++){
            // получаем бокс под номером i
            let box = this.getBox(this.arr[i]);
            // прячем бокс
            box.hidden = true;
        }
    }

    // спрятать все боксы и показать только один из них
    showBox(boxClass) {
        // прячем все боксы
        this.hideAllBoxes();
        // получаем бокс под определённым именем
        let box = this.getBox(boxClass);
        // показываем полученный бокс
        box.hidden = false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BoxRender;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для управления отображением игрового поля
class CanvasManager{
    // конструктор
    // инициализация полей класса
    constructor(elementFinder,canvasClassName){
        // инициализируем поля класса вспомогательными объектами
        this.elementFinder = elementFinder;
        // создаём объект - холст для рисования
        this.holst = this.elementFinder.getElement(canvasClassName).getContext('2d');
        // задаём используемые для отображения картинки
        this.imgEmpty = new Image();
        this.imgEmpty.src = "Images/fieldEmpty.png";
        this.imgCircle = new Image();
        this.imgCircle.src = "Images/fieldCircle.png";
        this.imgKrest = new Image();
        this.imgKrest.src = "Images/fieldKrest.png";
        // инициализируем карту клеточного поля
        // @ - пустая клетка
        // X - клетка занята крестиком
        // 0 - клетка занята ноликом
        this.map = [
            {type: "@", x: 0, y: 0},
            {type: "@", x: 80, y: 0},
            {type: "@", x: 160, y: 0},
            {type: "@", x: 0, y: 80},
            {type: "@", x: 80, y: 80},
            {type: "@", x: 160, y: 80},
            {type: "@", x: 0, y: 160},
            {type: "@", x: 80, y: 160},
            {type: "@", x: 160, y: 160}
        ];
        // задаём параметры рисования
        this.holst.lineWidth = 3;
        this.holst.strokeStyle = '#000000';
    }

    // метод для задания типа элемента клеточного поля
    setElementOfMap(number,type){
        // задаём клетке под номером NUMBER тип TYPE
        this.map[number].type = type;
    }

    // получаем объект - клетку под номером NUMBER
    getElementOfMap(number){
        // возвращаем объект - клетку
        return this.map[number];
    }

    // делаем все клетки клеточного поля пустыми
    clearField(){
        // пробегамся по всем клеткам
        for(let i = 0; i < this.map.length; i++){
            // задаём клетке тип ПУСТАЯ КЛЕТКА
            this.setElementOfMap(i,"@");
        }
    }

    // вывод всего клеточного поля на экран
    renderMap(){
        // очищаем содержимое холста
        this.holst.clearRect(0,0,240,240);
        // пробегаемся по всем клеткам
        for(let i = 0; i < this.map.length; i++){
            // получаем тип клетки под номером i
            const type = this.map[i].type;
            // в зависимости от типа клетки рисуем определённую картинку в ячейке клетки
            switch(type){
                // для пустой клетки
                case "@":
                    this.holst.drawImage(this.imgEmpty,this.map[i].x,this.map[i].y,80,80);
                    break;
                // для клетки хранящей нолик
                case "0":
                    this.holst.drawImage(this.imgCircle,this.map[i].x,this.map[i].y,80,80);
                    break;
                // для клетки хранящей крестик
                case "X":
                    this.holst.drawImage(this.imgKrest,this.map[i].x,this.map[i].y,80,80);
                    break;
            }
        }
        // рисуем контур холста
        this.holst.strokeRect(0,0,240,240);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CanvasManager;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс, отвечающий за регистрацию
class CheckIn{
    // конструктор
    // инициализация полей класса
    constructor(elementFinder,stringController,messageElement){
        // инициализируем поля класса вспомогательными объектами
        this.elementFinder = elementFinder;
        this.stringController = stringController;
        this.message = messageElement;
    }

    // проверка на корректность логина и пароля
    controlLoginAndPasswordStringsInCheckInForm(){
        // получаем содержимое текстовых полей
        // содержимое строки - логина
        const loginString = this.elementFinder.getElement("check-in-box__login-field_black-shadow").value;
        // содержимое строки - пароля
        const passwordString = this.elementFinder.getElement("check-in-box__password-field_black-shadow").value;
        // очищаем окно с сообщениями
        this.message.clear();
        // переменнаая - флаг, отвечающая за то, корректны ли обе строки логина и пароля
        let stringsOK = true;
        // проверка на корректность логина
        const loginResult = this.stringController.isNormalString(loginString);
        switch(loginResult){
            // если логин - это пустая строка
            case "EMPTY":
                this.message.addText("Поле ввода логина пусто.");
                stringsOK = false;
                break;
            // если логин содержит некорректные символы
            case "NO_CORRECT":
                this.message.addText("Поле ввода логина содержит запретные символы.");
                stringsOK = false;
                break;
        }
        // проверка на корректность пароля
        const passwordResult = this.stringController.isNormalString(passwordString);
        switch(passwordResult){
            // если пароль - пустая строка
            case "EMPTY":
                this.message.addText("Поле ввода пароля пусто.");
                stringsOK = false;
                break;
            // если пароль содержит некорректные символы
            case "NO_CORRECT":
                this.message.addText("Поле ввода пароля содержит запретные символы.");
                stringsOK = false;
                break;
        }
        // возврат результата проверок на корректность
        return stringsOK;
    }

    // метод для попытки регистрации пользователя
    registrate(url){
        // проверяем на корректность логин и пароль
        const flag =  this.controlLoginAndPasswordStringsInCheckInForm();
        // если логин и пароль прошли проверку на корректность
        if(flag === true){
            // получаем логин и пароль
            // получаем логин
            const loginString = this.elementFinder.getElement("check-in-box__login-field_black-shadow").value;
            // получаем пароль
            const passwordString = this.elementFinder.getElement("check-in-box__password-field_black-shadow").value;
            // создаём JSON объект
            let myObjJSON = {
                login: loginString,
                password: passwordString
            };
            // объект для вывода сообщений
            let message = this.message;
            // объект для поиска элемента
            let elementFinder = this.elementFinder;
            // отправка данных на сервер
            // создаём строку - запрос
            const query = url + "scr1.php?content=" + JSON.stringify(myObjJSON);
            // создаём объект для отправки запроса
            let request = new XMLHttpRequest();
            request.open("POST",query);
            request.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
            request.send(null);
            // при получении ответа с сервера
            request.onreadystatechange = function(){
                // если ответ нормальный
                if(request.readyState === 4 && request.status === 200){
                    if(request.responseText === "YES"){
                        // если регистрация прошла успешно
                        // выводим сообщение, что регистрация прошла успешно
                        message.setText("Регистрация прошла успешно.");
                        // очищаем поля ввода логина и пароля
                        elementFinder.getElement("check-in-box__login-field_black-shadow").value = "";
                        elementFinder.getElement("check-in-box__password-field_black-shadow").value = "";
                    }else{
                        // если регистрация НЕ прошла успешно
                        // очищаем элемент для вывода сообщений
                        message.clear();
                        // выводим на экран тектс, что регистрация не была пройдена
                        message.addText("Такой логин уже занят другим пользователем.");
                        message.addText("Придумайте, пожалуйста, другой логин.");
                    }
                }
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CheckIn;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для вывода сообщений на экран
class ContentManager{
    // создание поля класса
    constructor(){
        // полем клааса является объект
        this.element = {};
    }
    // инициализируем элемент, в который будем выводить результат
    initElement(element){
        // присваиваем полю класса значение объекта - параметра
        this.element = element;
    }
    // очищаем содержимое
    clear(){
        // присваимваем содержимому элемента пустую строку
        this.element.innerHTML = "";
    }
    // задаём текстовое содержимое
    setText(text){
        // присваиваем содержимому элемента строку из пераметра
        this.element.innerHTML = text;
    }
    // добавляем текстовое содержимое
    addText(text){
        // прибавляем к содержимому элемента текст из параметра и перенос строки
        this.element.innerHTML += (text + "<br>");
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ContentManager;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс, позволяющий получить элемент по имени его класса
class ElementFinder{
    // метод получает имя класса элемента и возвращает самый первый элемент с таким классом
    findElementByClassName(elementClass){
        // получаем массив элементов с данным именем класса
        let elementsArray = document.getElementsByClassName(elementClass);
        // возвращаем самый первый (нулевой) элемент данного массива
        return elementsArray[0];
    }
    // метод для возврата объекта - результата
    getElement(elementClass){
        // возвращаем искомой элемент
        return this.findElementByClassName(elementClass);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ElementFinder;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для управления игрой в одиночном режиме
class GameWithComputerManager{
    // конструктор класса
    // передаём в качестве параметров вспомогательные объекты
    constructor(canvasManager,elementFinder,contentManager){
        this.elementFinder = elementFinder;
        this.canvasManager = canvasManager;
        this.contentManager = contentManager;
        this.canvasManager.clearField();
        this.canvasManager.renderMap();
        // переменная - флаг, отвечает за то, закончена ли игра
        this.gameNotStopped = true;
        // переменная для обращения к THIS в блоке holstObj.addEventListener
        let thisManager = this;
        // получаем объект - холст для рисования
        let holstObj = this.elementFinder.getElement("game-with-computer-box__holst-for-paint_cursor-pointer");
        // событие при щелчке по холсту
        holstObj.addEventListener("click",function(event){
            // если игра ещё не закончена
            if(thisManager.gameNotStopped === true) {
                // получаем координаты мыши относительно холста
                const xMouse = event.offsetX;
                const yMouse = event.offsetY;
                // получаем координаты клетки, по которой был осуществлён щелчок
                const xKv = Math.floor(xMouse / 80.0);
                const yKv = Math.floor(yMouse / 80.0);
                // переменная - флаг, отвечает за то, выиграл ли кто-нибудь
                let smbWins = false;
                // получаем номер нажатой клетки по её координатам
                let number = thisManager.getNumberOfKvByCoordinats(xKv, yKv);
                // если данная клетка пока пустая
                if (thisManager.canvasManager.getElementOfMap(number).type === "@") {
                    // записываем в клетку крестик
                    thisManager.canvasManager.setElementOfMap(number, "X");
                    // проверяем, выиграли ли крестики после хода
                    const winKrest = thisManager.isKrestWin();
                    // если крестики победили
                    if (winKrest === true){
                        // выводим содержимое поля игры
                        thisManager.canvasManager.renderMap();
                        // говорим, что игра закончена
                        thisManager.gameNotStopped = false;
                        // выводим результат игры на экран
                        thisManager.renderResult("Игра окончена. КРЕСТИКИ победили.");
                        // говорим, что кто-то победил
                        smbWins = true;
                    }else{
                        // если же крестики не победили
                        // ход делают нолики
                        thisManager.enemyMakeHodMove();
                        // выводим содержимое игрового поля
                        thisManager.canvasManager.renderMap();
                        // проверяем, выиграли ли нолики
                        const winZero = thisManager.isZeroWin();
                        // если нолики выиграли
                        if(winZero === true){
                            // говорим, что игра закончена
                            thisManager.gameNotStopped = false;
                            // выводим результат игры на экран
                            thisManager.renderResult("Игра окончена. НОЛИКИ победили.");
                            // говорим, что кто-то победил
                            smbWins = true;
                        }
                    }
                }
                // выводим содержимое игрового поля на экран
                thisManager.canvasManager.renderMap();
                // если никто пока не победил
                if(smbWins === false){
                    // если все клетки игрового поля заняты
                    if (thisManager.areAllBusy() === true) {
                        // говорим, что игра закончена
                        thisManager.gameNotStopped = false;
                        // выводим результат игры на экран
                        thisManager.renderResult("Игра окончена. НИЧЬЯ.");
                    }
                }
            }
        });
    }

    // метод для проверки, все ли клетки игрового поля заняты
    areAllBusy(){
        // пробегаемся по всем клеткам игрового поля
        for(let i = 0; i < 9; i++){
            // получаем тип клетки под номером i
            const type = this.getType(i);
            // если данная клетка пустая (типу пустой клетки соответствует значение "@")
            if(type === "@"){
                // возвращаем результат, что НЕ все клетки заняты
                return false;
            }
        }
        // если до этого нас не выкинуло из цикла, это значит, что все клетки заняты
        // возвращаем результат проверки
        return true;
    }

    // метод для вывода результата игры на экран
    renderResult(text){
        // получаем объект, в который будем выводить результат
        let resultElement = this.elementFinder.getElement("game-with-computer-box__game-result_color-blue");
        // инициализируем объект, управляющий содержимым объекта для вывода результата
        this.contentManager.initElement(resultElement);
        // выводим результат
        this.contentManager.setText(text);
    }

    // метод для запуска новой игры
    startNewGame(){
        // очищаем игровое поле
        this.canvasManager.clearField();
        // выводим содержимое игрового поля на экран
        this.canvasManager.renderMap();
        // говорим, что игра НЕ закончена
        this.gameNotStopped = true;
        // очищаем объект для вывода результата игры
        this.renderResult("");
    }

    // метод, который реализует ход компьютера (компьютер играет за НОЛИКИ)
    enemyMakeHodMove(){
        // выполняем блок кода 15 раз
        for(let i = 0; i < 15; i++){
            // выбираем случайный номер клетки
            let randomNumber = parseInt(Math.random() * 9);
            // если клетка пустая
            if(this.canvasManager.getElementOfMap(randomNumber).type === "@"){
                // записываем в клетку нолик
                this.canvasManager.setElementOfMap(randomNumber,"0");
                // выходим из метода
                return;
            }
        }
        // если в предыдущем цикле мы не смогли взять подходящую клетку случайным образом
        // будем искать первую подходящую клетку последовательным перебором
        // пробегаемся по всем клеткам
        for(let i = 0; i < 9; i++){
            // если клетка под номером i пустая
            if(this.canvasManager.getElementOfMap(i).type === "@"){
                // записываем в неё нолик
                this.canvasManager.setElementOfMap(i,"0");
                // выходим из метода
                return;
            }
        }
    }

    // метод для получения типа клетки под номером NUMBER
    getType(number){
        // возвращаем тип клетки
        return this.canvasManager.getElementOfMap(number).type;
    }

    // метод для проверки, победи ли Крестики
    isKrestWin(){
        // задаём тип клетки - тип крестик
        let type = "X";
        // создаём массив, в котором будем хранить результаты заполненности строк, столбцов и диагоналей КРЕСТИКАМИ
        let situationsWhenWinKrest = [];
        situationsWhenWinKrest[0] = (this.getType(0) === type && this.getType(1) === type && this.getType(2) === type);
        situationsWhenWinKrest[1] = (this.getType(3) === type && this.getType(4) === type && this.getType(5) === type);
        situationsWhenWinKrest[2] = (this.getType(6) === type && this.getType(7) === type && this.getType(8) === type);
        situationsWhenWinKrest[3] = (this.getType(0) === type && this.getType(4) === type && this.getType(8) === type);
        situationsWhenWinKrest[4] = (this.getType(2) === type && this.getType(4) === type && this.getType(6) === type);
        situationsWhenWinKrest[5] = (this.getType(0) === type && this.getType(3) === type && this.getType(6) === type);
        situationsWhenWinKrest[6] = (this.getType(1) === type && this.getType(4) === type && this.getType(7) === type);
        situationsWhenWinKrest[7] = (this.getType(2) === type && this.getType(5) === type && this.getType(8) === type);
        // пробешаемся по всему массиву
        for(let i = 0; i < situationsWhenWinKrest.length; i++){
            // если хоть одна ячейка хранит истину
            if(situationsWhenWinKrest[i] === true){
                // крестики победили в игре
                return true;
            }
        }
        // если нас не выкинуло из цикла, крестики ещё не победили
        return false;
    }

    // метод для проверки, победили ли нолики
    isZeroWin(){
        // задаём тип клетки - тип нолик
        let type = "0";
        // создаём массив, в котором будем хранить результаты заполненности строк, столбцов и диагоналей НОЛИКАМИ
        let situationWhenWinZero = [];
        situationWhenWinZero[0] = (this.getType(0) === type && this.getType(1) === type && this.getType(2) === type);
        situationWhenWinZero[1] = (this.getType(3) === type && this.getType(4) === type && this.getType(5) === type);
        situationWhenWinZero[2] = (this.getType(6) === type && this.getType(7) === type && this.getType(8) === type);
        situationWhenWinZero[3] = (this.getType(0) === type && this.getType(4) === type && this.getType(8) === type);
        situationWhenWinZero[4] = (this.getType(2) === type && this.getType(4) === type && this.getType(6) === type);
        situationWhenWinZero[5] = (this.getType(0) === type && this.getType(3) === type && this.getType(6) === type);
        situationWhenWinZero[6] = (this.getType(1) === type && this.getType(4) === type && this.getType(7) === type);
        situationWhenWinZero[7] = (this.getType(2) === type && this.getType(5) === type && this.getType(8) === type);
        // пробегаемся по всему массиву
        for(let i = 0; i < situationWhenWinZero.length; i++){
            // если хоть одна ячейка хранит истину
            if(situationWhenWinZero[i] === true){
                // нолики победили в игре
                return true;
            }
        }
        // если нас не выкинуло из цикла, нолики ещё не победили
        return false;
    }

    // метод для получения номера клетки по её координатам
    getNumberOfKvByCoordinats(xKv,yKv){
        // создаём переменную для сохранения ответа
        let answerNumber = 0;
        // создаём строку и сохраняем в неё координаты клетки, которые разделены символом "_"
        const s = xKv + "_" + yKv;
        // в зависимости от значения данной строки получаем номер клетки - ответ
        switch(s){
            case "0_0":
                answerNumber = 0;
                break;
            case "1_0":
                answerNumber = 1;
                break;
            case "2_0":
                answerNumber = 2;
                break;
            case "0_1":
                answerNumber = 3;
                break;
            case "1_1":
                answerNumber = 4;
                break;
            case "2_1":
                answerNumber = 5;
                break;
            case "0_2":
                answerNumber = 6;
                break;
            case "1_2":
                answerNumber = 7;
                break;
            case "2_2":
                answerNumber = 8;
                break;
        }
        // возвращаем номер искомой клетки
        return answerNumber;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameWithComputerManager;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс роутер для эмуляции истории переходов
class Router{
    // конструктор класса
    // передаём в качестве параметров вспомогательные объекты
    constructor(textFieldCleaner,boxRender,messageBox,isAuthorized){
        // инициализируем поля класса
        this.textFieldCleaner = textFieldCleaner;
        this.boxRender = boxRender;
        this.messageBox = messageBox;
        this.isAuthorized = isAuthorized;
        // переменная, чтобы обращаться к THIS внутри блока window.addEventListener
        let routerThis = this;
        // добавляем событие при изменении адресной строки
        window.addEventListener("popstate", function(){
            // вызываем метод осуществления перехода между блоками
            routerThis.moveToPage();
        });
    }

    // осуществление перехода между боксами
    moveToPage(){
        // очищаем содержимое текстовых полей и бокса для вывода сообщений
        this.textFieldCleaner.clearAllTextFields();
        // очищаем окно для вывода сообщений
        this.messageBox.clear();
        // сохраняем содержимое адресной строки
        const pathname = window.location.pathname;
        // в зависимости от содержимого адресной строки показываем разные боксы
        switch(pathname){
            // для блока авторизации
            case "/avt":
                this.boxRender.showBox("authorization-box");
                break;
            // для блока регистрации
            case "/reg":
                this.boxRender.showBox("check-in-box");
                break;
            // для блока приветствия
            case "/":
                this.boxRender.showBox("welcome-box");
                break;
            // для блока приветствия
            case "":
                this.boxRender.showBox("welcome-box");
                break;
            // для блока своего профиля
            case "/profile":
                this.boxRender.showBox("my-profile-box");
                break;
            // для блока игры с компьютером (одиночной игры)
            case "/game_with_computer":
                this.boxRender.showBox("game-with-computer-box");
                break;
        }

        // создаём массив страниц, которые могут быть открыты, только если пользователь авторизован
        let arrOfPages = ["/profile","/game_with_computer"];

        // если пользователь ещё не авторизован
        if(this.isAuthorized.flag === false){
            // сохраняем длину массива, хранящего страницы, которые могут быть открыты, только если пользователь авторизован
            let length = arrOfPages.length;
            // пробегаемся по данному массиву
            for(let i = 0; i < length; i++){
                // если адресная строка совпадает с содержимым ячейки массива
                if(window.location.pathname === arrOfPages[i]){
                    // это означает, что НЕавторизованный пользователь пытается попасть на страницу, которую можно посещать только будучи авторизованным
                    // перекидываем пользователя на страницу авторизации
                    this.setPathName("/avt");
                    return;
                }
            }
        }
    }

    // добавляем переход в историю и меняем бокс
    setPathName(pathname){
        // добавляем переход в историю
        history.pushState({}, "" ,pathname);
        // показываем определённый бокс
        this.moveToPage();
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Router;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс, который проверяет, может ли данная строка быть логином или паролем
class StringController{
    // проверка, является ли символ маленькой буквой, нижним подчёркиванием или цифрой
    isNormalChar(c){
        // создаём строку, содержащую все корректные для логина и пароля символы
        const normalChars = "abcdefghijklmnopqrstuvwxyz_0123456789";
        // проверяем содержится ли символ С в строке корректных символов
        let number = normalChars.indexOf(c);
        // возвращаем результат проверки
        return number !== -1;
    }

    // проверка, пуста ли строка и содержит ли строка запретные символы
    isNormalString(s){
        // проверяем строку на пустоту
        if(s.length === 0){
            // возвращаем результат проверки
            return "EMPTY";
        }
        // пробегаемся по всем символам строки
        for(let i = 0; i < s.length; i++){
            // берём символ строки под номером i
            const c = s.charAt(i);
            // если данный символ не корректен, то и строка тоже не корректна
            if(this.isNormalChar(c) === false){
                // возвращаем результат
                return "NO_CORRECT";
            }
        }
        // если строка не пуста, и оне не содержит запретных симвлов, то она прошла проверку успешно
        return "OK";
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StringController;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для удаления содержимого всех текстовых полей ввода
class TextFieldsCleaner{
    // инициализация полей класса
    constructor(elementFinderParam){
        // создание поля - массива для хранения имён текстовых полей
        this.textFieldsNames = [];
        // вспомогательный объект для поиска элемента
        this.elementFinder = elementFinderParam;
    }
    // добавление текстового поля в массив текстовых полей
    addTextField(textFieldClass){
        // кладём строку с именем класса текстового поля в конец массива
        this.textFieldsNames.push(textFieldClass);
    }
    // удаление содержимого всех текстовых полей
    clearAllTextFields(){
        // пробегаемся по всему массиву
        for(let i = 0; i < this.textFieldsNames.length; i++){
            // получаем объект - текстовое поле
            let textFieldObj = this.elementFinder.getElement(this.textFieldsNames[i]);
            // задаём его содержимое (пустая строка)
            textFieldObj.value = "";
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TextFieldsCleaner;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BoxRender_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ElementFinder_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ContentManager_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__StringController_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__AuthorizationControl_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__CheckIn_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__TextFieldsCleaner_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Router_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__CanvasManager_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__GameWithComputerManager_js__ = __webpack_require__(6);


// подключем вспомогательные модули











// класс для управления взаимодействием между модулями
class Mediator{
    // конструктор
    // инициализация полей класса
    constructor(){
        this.url = "http://localhost/MaximGameScripts/";
        this.isAuthorized = {
            flag: false,
            login: ""
        };
        this.boxRender = new __WEBPACK_IMPORTED_MODULE_0__BoxRender_js__["a" /* default */]();
        this.elementFinder = new __WEBPACK_IMPORTED_MODULE_1__ElementFinder_js__["a" /* default */]();
        this.message = new __WEBPACK_IMPORTED_MODULE_2__ContentManager_js__["a" /* default */]();
        this.stringController = new __WEBPACK_IMPORTED_MODULE_3__StringController_js__["a" /* default */]();
        this.authorizationControl = new __WEBPACK_IMPORTED_MODULE_4__AuthorizationControl_js__["a" /* default */](this.elementFinder,this.stringController,this.message,this.boxRender);
        this.checkIn = new __WEBPACK_IMPORTED_MODULE_5__CheckIn_js__["a" /* default */](this.elementFinder,this.stringController,this.message);
        this.textFieldsCleaner = new __WEBPACK_IMPORTED_MODULE_6__TextFieldsCleaner_js__["a" /* default */](this.elementFinder);
        this.router = new __WEBPACK_IMPORTED_MODULE_7__Router_js__["a" /* default */](this.textFieldsCleaner,this.boxRender,this.message,this.isAuthorized);
        this.canvasManager = new __WEBPACK_IMPORTED_MODULE_8__CanvasManager_js__["a" /* default */](this.elementFinder,"game-with-computer-box__holst-for-paint_cursor-pointer");
        this.gameWithComputerManager = new __WEBPACK_IMPORTED_MODULE_9__GameWithComputerManager_js__["a" /* default */](this.canvasManager,this.elementFinder, new __WEBPACK_IMPORTED_MODULE_2__ContentManager_js__["a" /* default */]());
    }

    addAllTextFields(){
        this.textFieldsCleaner.addTextField("authorization-box__login-field_black-shadow");
        this.textFieldsCleaner.addTextField("authorization-box__password-field_black-shadow");
        this.textFieldsCleaner.addTextField("check-in-box__login-field_black-shadow");
        this.textFieldsCleaner.addTextField("check-in-box__password-field_black-shadow");
    }

    startOnePlayerGame(){
        this.gameWithComputerManager.startNewGame();
    }

    renderCanvasHolst(){
        this.canvasManager.renderMap();
    }

    addAllBoxes(){
        this.boxRender.addBox("welcome-box");
        this.boxRender.addBox("authorization-box");
        this.boxRender.addBox("check-in-box");
        this.boxRender.addBox("my-profile-box");
        this.boxRender.addBox("game-with-computer-box");
    }

    definePage(){
        this.router.moveToPage();
    }

    changePathName(pathname){
        this.router.setPathName(pathname);
    }

    initMessageTextRender(){
        this.message.initElement(this.elementFinder.getElement("message-box__text-of-message_blue"));
        this.message.clear();
    }

    showBoxElement(boxClass){
        this.boxRender.showBox(boxClass);
    }

    authorizeUser(){
        this.authorizationControl.authorize(this.url,this.router,this.isAuthorized);
    }

    checkInUser(){
        this.checkIn.registrate(this.url);
    }

    addListenersToButtons(){
        let mediatorThis = this;

        let avtBtn = this.elementFinder.getElement("welcome-box__sign-in-button_DeepSkyBlue-color");
        avtBtn.addEventListener("click",function(){
            mediatorThis.changePathName("/avt");
        });

        let regBtn = this.elementFinder.getElement("welcome-box__check-in-box-button_DeepSkyBlue-color");
        regBtn.addEventListener("click",function(){
            mediatorThis.changePathName("/reg");
        });

        let avtBackBtn = this.elementFinder.getElement("authorization-box__back-button_DeepSkyBlue-color");
        avtBackBtn.addEventListener("click",function(){
            mediatorThis.changePathName("/");
        });

        let regBackBtn = this.elementFinder.getElement("check-in-box__back-button_DeepSkyBlue-color");
        regBackBtn.addEventListener("click",function(){
            mediatorThis.changePathName("/");
        });

        let avtUserBtn = this.elementFinder.getElement("authorization-box__sign-in-button_DeepSkyBlue-color");
        avtUserBtn.addEventListener("click",function(){
            mediatorThis.authorizeUser();
        });

        let checkInUserBtn = this.elementFinder.getElement("check-in-box__registration-button_DeepSkyBlue-color");
        checkInUserBtn.addEventListener("click",function(){
            mediatorThis.checkInUser();
        });

        let exitFromProfileBtn = this.elementFinder.getElement("my-profile-box__exit-button_DeepSkyBlue-color");
        exitFromProfileBtn.addEventListener("click",function(){
            mediatorThis.isAuthorized.flag = false;
            mediatorThis.isAuthorized.login = "";
            mediatorThis.changePathName("/");
        });

        let gameWithComputerBtn = this.elementFinder.getElement("my-profile-box__play-with-computer-button_DeepSkyBlue-color");
        gameWithComputerBtn.addEventListener("click",function(){
            mediatorThis.changePathName("/game_with_computer");
            mediatorThis.startOnePlayerGame();
        });
    }

}

let mediator = new Mediator();

window.addEventListener("load", function(){
    mediator.addAllBoxes();
    mediator.addAllTextFields();
    mediator.addListenersToButtons();
    mediator.initMessageTextRender();
    mediator.definePage();
    mediator.renderCanvasHolst();
});



/***/ })
/******/ ]);