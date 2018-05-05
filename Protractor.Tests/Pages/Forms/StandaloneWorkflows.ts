import { Common } from "../../Common/Common";
import { Page } from "../Page";
import { EnabledState } from "../../Common/Enums";
import { Input } from "../Controls/Input";
import { SearcheControl } from "../Controls/SearcheControl";


export class StandaloneWorkflows {

    constructor(workflows: string[] = null) {
        this.CheckWorkFlows(workflows);
    }

    public CreateClick() {
        Common.Log("StandaloneWorkflows: CreateClick");
        this.createBtn.click();
    }

    public CreateFirstClick() {
        Common.Log("StandaloneWorkflows: Create first");
        browser.sleep(1000);
        Page.Wait.ElementDisplayed(this.createEmptyBtn, "StandaloneWorkflows");
        this.createEmptyBtn.click();
    }


    public WorkflowClick(name: string) {
        Common.Log("StandaloneWorkflows: workflow \"" + name + "\" click");
        let itemElement = Common.ElementByDateQaAndName(this.workflowItemQA, name);
        Page.Wait.Element(itemElement, "Standalone workflow \"" + name + "\" item");
        Common.ScrollIntoView(itemElement);
        itemElement.click();
    }

    public CheckWorkflowState(name: string, state: EnabledState) {
        let itemElement = Common.ElementByDateQaAndName(this.workflowItemQA, name);
        Page.Wait.Element(itemElement, "Standalone workflow \"" + name + "\" item");
        switch (state) {
            case EnabledState.Enabled:
                expect(Common.HasClass(itemElement, this.workflowItemDisabledClass)).toBe(false, "workflow \"" + name + "\" item wrong enabled state");
                break;
            case EnabledState.Enabled:
                expect(Common.HasClass(itemElement, this.workflowItemDisabledClass)).toBe(true, "workflow \"" + name + "\" item wrong disabled state");
                break;
        }
    }

    public SearchBtnClick() {
        Common.Log("StandaloneWorkflows: click searche btn");
        this.searcheBtn.click();
    }

    public SetFilter(value: string, workflows: string[]) {
        this.searcheControl.SetValue(value);
        browser.sleep(1000);
        this.CheckWorkFlows(workflows);
    }

    public SearcheClose() {
        this.searcheControl.CloseClick();
    }

    //strong order comparsion
    public CheckWorkFlows(workflows: string[]) {
        if (workflows == null) return;
        element.all(by.xpath(Common.DateQaPath(this.workflowItemQA))).each(function (el: protractor.ElementFinder, index: number) {
            expect(el.getAttribute("title")).toBe(workflows[index], "Stand alone workflows does not match");
        });
    }

    private searcheControl = new SearcheControl(Input.ByDataQa("wfl-standalone-card__search-input"), by.css(".wfl-search-input__close-btn"));
    private workflowItemQA = "wfl-standalone-card__template-item";
    private workflowItemDisabledClass = "wfl-standalone-card__tpl-item--disabled";
    private searcheBtn = Common.ElementByDateQa("wfl-standalone-card__toggle-filter-button");
    private createBtn = Common.ElementByDateQa("wfl-standalone-card__create-template-button");
    private createEmptyBtn = Common.ElementByDateQa("wfl-standalone-empty-card__create-template-button");
}