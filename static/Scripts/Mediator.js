"use strict";

// подключем вспомогательные модули
import BoxRender from "./BoxRender.js";
import ElementFinder from "./ElementFinder.js";
import ContentManager from "./ContentManager.js";
import StringController from "./StringController.js";
import AuthorizationControl from "./AuthorizationControl.js";
import CheckIn from "./CheckIn.js";
import TextFieldsCleaner from "./TextFieldsCleaner.js";
import Router from "./Router.js";
import CanvasManager from "./CanvasManager.js";
import GameWithComputerManager from "./GameWithComputerManager.js";

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
        this.boxRender = new BoxRender();
        this.elementFinder = new ElementFinder();
        this.message = new ContentManager();
        this.stringController = new StringController();
        this.authorizationControl = new AuthorizationControl(this.elementFinder,this.stringController,this.message,this.boxRender);
        this.checkIn = new CheckIn(this.elementFinder,this.stringController,this.message);
        this.textFieldsCleaner = new TextFieldsCleaner(this.elementFinder);
        this.router = new Router(this.textFieldsCleaner,this.boxRender,this.message,this.isAuthorized);
        this.canvasManager = new CanvasManager(this.elementFinder,"game-with-computer-box__holst-for-paint_cursor-pointer");
        this.gameWithComputerManager = new GameWithComputerManager(this.canvasManager,this.elementFinder, new ContentManager());
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

