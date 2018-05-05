import { Page } from "../Page";
import { Common } from "../../Common/Common";

export class BaseRootControl {
    constructor(protected rootPath: string) {

    }

    protected GetChildPathByQA(qa: string): string {
        return this.rootPath + Common.DateQaPath(qa);
    }

    protected GetChildByQA(qa: string): protractor.ElementFinder {
        return element.all(by.xpath(this.GetChildPathByQA(qa))).first();
    }

    protected GetAllChildsByQA(qa: string): protractor.ElementArrayFinder {
        return element.all(by.xpath(this.rootPath + Common.DateQaPath(qa)));
    }

    protected GetRootElement(): protractor.ElementFinder {
        return element(by.xpath(this.rootPath));
    }

}