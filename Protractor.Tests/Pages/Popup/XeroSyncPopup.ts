import { Common } from "../../Common/Common";
import { XeroSyncItem } from "../../Common/Enums";
import { Page } from "../Page";

export class XeroSyncPopup {

    constructor() {
        Page.Wait.ElementDisplayed(this.popup, "XeroSyncPopup");
    }

    public Sync(item: XeroSyncItem) {
        let syncRow = XeroSyncRow.Get(item);
        syncRow.ClickSyncBtn();
    }

    private popup = Common.ElementByDateQa("wfc-cache-management-panel");
}

export class XeroSyncRow {
    constructor(private name: string) {
    }

    public ClickSyncBtn() {
        // browser.sleep(300);
        Common.Log('XeroSyncRow "' + this.name + '" click sync');
        let syncBtn = element(by.xpath(Common.DateQaPathAndName(this.rowQA, this.name) + Common.DateQaPath(this.syncBtnQA)));
        Page.Wait.ElementDisplayed(syncBtn, 'XeroSync button "' + this.name + '"')
        syncBtn.click();
        // browser.sleep(300);
        // let inProgressElement = element(by.xpath(Common.DateQaPathAndName(this.rowQA, this.name) + this.inprogressPath));
        // Page.Wait.ElementDisplayed(inProgressElement, 'XeroSyncRow "' + this.name + '" in progress');
    }

    public static Get(item: XeroSyncItem) {
        switch (item) {
            case XeroSyncItem.Accounts: return new XeroSyncRow("Accounts");
            case XeroSyncItem.Contacts: return new XeroSyncRow("Contacts");
            case XeroSyncItem.Currencies: return new XeroSyncRow("Currencies");
            case XeroSyncItem.Items: return new XeroSyncRow("Items");
            case XeroSyncItem.Organization: return new XeroSyncRow("Organization");
            case XeroSyncItem.Taxes: return new XeroSyncRow("Taxes");
            case XeroSyncItem.Themes: return new XeroSyncRow("Themes");
            case XeroSyncItem.TrackingCategories: return new XeroSyncRow("Tracking categories");
        }
    }

    private rowQA = "wfc-cache-management-panel__row";
    private syncBtnQA = "wfc-cache-management-panel__sync-now-button";
    private inprogressPath = "//*[contains(@class,'wfc-cache-management-panel__table-cell') and contains(text(),'In progress')]";
}