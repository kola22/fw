import { Page } from "./Page";
import { Common } from "../Common/Common";

export class MainPage {
    constructor() {
        Common.Log("Main page constructor");
        this.CheckIsCorrect();
    }

    public LoginClick() {
        Common.Log("MainPage: Login click");
        this.loginMenuElement.click();
    }

    private loginMenuElement = element(by.xpath("//a[contains(text(),'LOGIN')]"));

    private CheckIsCorrect() {
        //TO DO
    }
}