import { Page } from "../Page";
import { Common } from "../../Common/Common";
import { Validation, DisplayState } from "../../Common/Enums";

export class Input {

    constructor(private inputElement: protractor.ElementFinder) {
    }

    //afterKey - key action
    //protractor.Key.TAB
    //protractor.Key.ENTER
    //protractor.Key.ESCAPE
    //null - no action
    public SetValue(value: string, afterKey: any = protractor.Key.TAB, focusClick: boolean = true,LogInConsole = true) {
        LogInConsole ? Common.Log("Input set value=\"" + value + "\"") : browser.sleep(500);

        Page.Wait.ElementDisplayed(this.inputElement, "Input element");

        if (focusClick) {
            this.inputElement.click();
        }
        Common.Log("SetValue 1");
        this.inputElement.clear();

        if (value.length > 0) {
            this.inputElement.sendKeys(value);
        }
        Common.Log("SetValue 2");
        if (afterKey) {
            this.inputElement.sendKeys(afterKey);
        }
    }

    public static ById(id: string,last=false): Input {
        if (last) {
            return new Input(element.all(by.xpath("//*[@id='" + id + "']")).last())
        }else {
            return new Input(element(by.xpath("//*[@id='" + id + "']")))
        }
    }

    public static ByDataQa(dataQa: string): Input {
        return new Input(Common.ElementByDateQa(dataQa));
    }

    public static ByLocator(inputLoacator: webdriver.Locator): Input {
        return new Input(element(inputLoacator));
    }

    public static ByXpath(xpath: string): Input {
        return new Input(element(by.xpath(xpath)));
    }
}