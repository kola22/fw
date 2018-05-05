import { Common } from "../Common/Common";
import { XeroLoginMethod,SyncType,XeroSyncItem } from "../Common/Enums";
import { Input } from "./Controls/Input";
import { InputDropDown } from "./Controls/InputDropDown";
import { XeroLoginForm } from "./Forms/XeroLoginForm";

import { Page } from "./Page";
import { ConfirmDeletePopup } from "./Popup/ConfirmDeletePopup";
import { WarningXeroCompanyChange } from "./Popup/WarningXeroCompanyChange";
import { XeroSyncPopup } from "./Popup/XeroSyncPopup";
import {QbLoginForm} from "./Forms/QbLoginForm";
import {QbWorkflows} from "./Forms/QbWorkflows";


export class CompanySetting {
    constructor(private name: string = null) {
        Common.Log("Open page 'Company Setting'");
        Page.Wait.ElementDisplayed(this.cardelElement, "Company settings card");
        if (name != null) {
            Page.Wait.ElementDisplayed(this.titleNameText, "Title name in Organisation page");
        }
        browser.sleep(500);
    }

    public SetCompanyName(value: string) {
        Common.LogWithValue("Company Setting page: Set company name=",value);
        browser.sleep(1500);
        this.companyNameInput.SetValue(value,protractor.Key.TAB);
    }

    public SaveClick() {
        Common.Log("Company Setting page: Click save");
        Page.Wait.ElementDisplayed(this.saveBtn,'save Button');
        this.saveBtn.click();
        Common.Log("Company Setting page: saveBtn 2222");
        browser.sleep(1500);
        Common.GlobalProgressLineLoader();

    }

    public DeleteCompany(sendTextInPopUp='delete') {
        Common.Log("Company Setting page: Delete company");
        this.otherOptions.click();
        browser.sleep(500);

        this.deleteCompany.click();
        browser.sleep(500);

        let confirmDeletePopup = new ConfirmDeletePopup();
        confirmDeletePopup.PassConfirm(sendTextInPopUp);
    }

    public RenameCompany(newName: string) {
        Common.LogWithValue("Company Setting page: Rename company to ",newName);
        this.SetCompanyName(newName);
        this.SaveClick();
    }

    public ConnectToXeroInSettingPage(user = Page.Config.testUser,companyName:string='test') {
        this.ClickXeroIntegration();

        let xeroLoginForm = new XeroLoginForm();

        xeroLoginForm.Login(user);
        xeroLoginForm.AllowAccessClick();

        this.CheckBlockContentAfterSync(SyncType.Xero,companyName);
    }

    private ClickXeroIntegration() {
        Common.Log("CompanySetting: Click Xero Integration");
        browser.sleep(500);
        this.connectXeroButton.click();
        //browser.sleep(1000);
    }

    public ClickLearnMore(syncType:SyncType) {
        Common.Log("CompanySetting: Click Learn More");
        browser.sleep(500);
        switch (syncType) {
            case SyncType.Xero:
                this.xeroLearMore.click();
                break;
            case SyncType.QB:
                this.qbLearMore.click();
                break;
        }
        // browser.sleep(5000);
        this.CheckLearnMoreUrl(syncType);
    }

    private CheckLearnMoreUrl(syncType:SyncType) {
        Common.Log("CheckLearnMoreUrl");
        let url = "http://support.approvalmax.com/knowledgebase/articles";
        switch (syncType) {
            case SyncType.Xero:
                Common.CheckNewTabWithUrlExistsAndCloseIt(url+"/1151545");
                break;
            case SyncType.QB:
                Common.CheckNewTabWithUrlExistsAndCloseIt(url+"/1088155");
                break;
        }

    }

    public CheckTimeZone(value:string) {
        Common.Log("CompanySetting: CheckTimeZone ");
        let inputElement : InputDropDown = new InputDropDown(Common.DateQaPath(this.timeZoneDropDown));
        inputElement.CheckInputValue(value);
    }

    public SetTimeZOne(name:string) {
        Common.Log("CompanySetting: SetTimeZOne");
        this.timeZoneDropDownElement.click();
        let multiSelect = this.GetSelectDropDownTimeZone();
        multiSelect.SelectItem(name);
    }

    private GetSelectDropDownTimeZone(): InputDropDown {
        return new InputDropDown(this.timeZoneDropDown);
    }

    public CheckCurrency(value:string) {
        Common.LogWithValue("CompanySetting: CheckCurrency == ",value);
        let inputElement : InputDropDown = new InputDropDown(Common.DateQaPath(this.currencyDropDown));
        inputElement.CheckInputValue(value);
    }

    public SetCurrency(name:string) {
        Common.Log("CompanySetting: SetCurrency");
        this.currencyDropDownElement.click();
        let multiSelect = this.GetSelectDropDownCurrency();
        multiSelect.SelectItem(name);
    }

    private GetSelectDropDownCurrency(): InputDropDown {
        return new InputDropDown(this.currencyDropDown);
    }

    public CheckBlockContent(syncType:SyncType) {
        Common.Log("CompanySetting: CheckBlockContent");
        switch (syncType) {
            case SyncType.Xero:
                Page.Wait.ElementDisplayed(this.connectXeroButton,'Xero Connect Button');
                Page.Wait.ElementDisplayed(this.xeroDescription,'Xero Description');
                break;
            case SyncType.QB:
                Page.Wait.ElementDisplayed(this.connectQBButton,'QB Connect Button');
                Page.Wait.ElementDisplayed(this.qbDescription,'QB Description');
                break;
        }
    }

    public CheckBlockContentAfterSync(syncType:SyncType,companyName:string='test') {
        Common.Log("CompanySetting: CheckBlockContent AfterSync");
        switch (syncType) {
            case SyncType.Xero:
                Page.Wait.ElementDisplayed(this.textAfterConnectElement, "Text after connect",90000);
                expect(this.companyLink.getText()).toBe(companyName, "Xero company name");
                break;
            case SyncType.QB:
                Page.Wait.ElementDisplayed(this.textAfterConnectElement, "Text after connect",90000);
                expect(this.companyQBLink.getText()).toBe('AM', "Xero company name");
                break;
        }
    }

    public CheckBlockContentAfterDisconnect(syncType:SyncType,companyName:string='test') {
        Common.Log("CompanySetting: CheckBlockContent Disconnect");
        switch (syncType) {
            case SyncType.Xero:
                Page.Wait.ElementDisplayed(this.xeroTextAfterDisconnectElement, "Text after connect",90000);
                expect(this.xeroCompanyLinkAfterDisconnect.getText()).toBe(companyName, "Xero company name");
                break;
            case SyncType.QB:

                break;
        }
    }


    public ClickXeroCompanyUrl(companyName:string='test') {
        Common.Log("CompanySetting: ClickXeroCompanyUrl");
        this.companyLink.click();
        Common.CheckNewTabWithUrlExistsAndCloseIt('https://go.xero.com/Dashboard/')
    }

    public XeroCacheButton(){
        Common.Log("CompanySetting: XeroCacheButton");
        this.xeroCacheButton.click();
        let cache = new XeroSyncPopup();
        cache.Sync(XeroSyncItem.Accounts);
        cache.Sync(XeroSyncItem.Contacts);
        cache.Sync(XeroSyncItem.Currencies);
        cache.Sync(XeroSyncItem.Items);
        cache.Sync(XeroSyncItem.Organization);
        cache.Sync(XeroSyncItem.Taxes);
        cache.Sync(XeroSyncItem.Themes);
        cache.Sync(XeroSyncItem.TrackingCategories);
        browser.sleep(1000);

    }

    public DisconnectedXero(){
        Common.Log("CompanySetting: DisconnectedXero");
        this.xeroSettingButton.click();
        Page.Wait.ElementDisplayed(this.uiButton,'uiButton in organisation settings');
        this.uiButton.click();
        Page.Wait.ElementDisplayed(this.reconnectButton,'Xero reconnectButton in organisation settings')

    }

    public ReconnectToXero(withLogin:boolean = false,otheCompanyWarning:boolean = false){
        Common.Log("CompanySetting: ReconnectToXero");
        Page.Wait.ElementDisplayed(this.reconnectButton,'Xero reconnectButton in organisation settings');
        this.reconnectButton.click();
        let xeroLoginForm = new XeroLoginForm(XeroLoginMethod.WithoutForm);
        if (withLogin){
            otheCompanyWarning ? xeroLoginForm.Login(Page.Config.secondXeroCompany) : xeroLoginForm.Login(Page.Config.testUser)
        }
        xeroLoginForm.AllowAccessClick();
        if (otheCompanyWarning) {
            let otheCompanyWarning = new WarningXeroCompanyChange();
        }else{
            this.CheckBlockContentAfterSync(SyncType.Xero);
        }
    }

    public ConnectToQBInSettingPage() {
        this.ClickQBIntegration();

        let qbLoginForm = new QbWorkflows(false);
        qbLoginForm.QbAuthorizationHandler();
        // qbLoginForm.ConnectToQb(Page.Config.testUser);
        // qbLoginForm.AllowAccessClick();

        this.CheckBlockContentAfterSync(SyncType.QB);
    }

    private ClickQBIntegration() {
        Common.Log("CompanySetting: Click QB Integration");
        browser.sleep(500);
        this.connectQBButton.click();
        //browser.sleep(1000);
    }

    public ReconnectToQB(withLogin:boolean = false){
        Common.Log("CompanySetting: ReconnectToQB");
        Page.Wait.ElementDisplayed(this.reconnectButton,'Xero reconnectButton in organisation settings');
        this.reconnectButton.click();

        // let qbLoginForm = new QbLoginForm();
        let qbLoginForm = new QbWorkflows(false);
        qbLoginForm.QbAuthorizationHandler();

        this.CheckBlockContentAfterSync(SyncType.QB);
    }

    public CheckLockDate(value:string = ''){
        Common.LogWithValue("CompanySetting: CheckLockDate == ",value);
        Page.Wait.ElementDisplayed(this.lockdateDropDownElement,'LockDate field');
        expect(this.lockdateDropDownElement.getAttribute('value')).toBe(value, "LockDate value");
    }

    // private companyNameInput: Input = Input.ById("companyTitleEditor");
    private companyNameInput: Input = Input.ByDataQa("cps-toolbar__company-name-input");


    //private saveBtn = element(by.id('updateCompany'));
    private saveBtn = element(by.xpath(Common.DateQaPath("cps-toolbar__save-button")));

    private otherOptions = element(by.xpath(Common.DateQaPath('cps-toolbar__action-menu')));
    // private deleteCompany = element(by.css('.ui-action-menu-item'));
    private deleteCompany = element(by.xpath(Common.DateQaPath('cps-toolbar__delete-company-menu-item')));




    private enableIntegrationXero = element(by.id("enableIntegrationXero"));

    // private cardelElement = element.all(by.css(".company-card")).first();
    private cardelElement = element.all(by.css(".cps-page__card")).first();

    private disconnectFromXeroBtn = element(by.id("disableIntegrationXero"));

    private titleNameText = element(by.xpath(Common.DateQaPath("navigation__breadcrumbs") + "//span[contains(text(),'" + this.name  +"')]"));

    //21.3.18
    private learMoreClass = "ui-external-link";
    private learMoreElemetn = element.all(by.className(this.learMoreClass));
    private xeroLearMore = this.learMoreElemetn.first();
    private qbLearMore = this.learMoreElemetn.last();

    //26.3.18
    private connectXeroButton = element(by.xpath("//*[@title='Connect to your Xero account']"));
    private connectQBButton = element(by.xpath("//*[@title='Connect to your QuickBooks Online account']"));

    private currencyDropDown = "cps-company-section__currency-dropdown";
    private currencyDropDownElement = Common.ElementByDateQa(this.currencyDropDown);
    private timeZoneDropDown = "cps-company-section__timezone-dropdown";
    private timeZoneDropDownElement = Common.ElementByDateQa(this.timeZoneDropDown);

    private xeroDescriptiontext = 'Connect to your Xero account in order to set up multi-step approval workflows for your Xero documents such as Purchase Orders, Bills, AP Credit Notes, Sales Invoices, AR Credit Notes.';
    private qbDescriptiontext = 'Connect to your QuickBooks Online account in order to set up multi-step approval workflows for QuickBooks Online Purchase Orders.';
    private xeroDescription = element(by.xpath("//*[contains(text(),'"+this.xeroDescriptiontext+"')]"));
    private qbDescription = element(by.xpath("//*[contains(text(),'"+this.qbDescriptiontext+"')]"));

    private textAfterConnectElement = element(by.xpath("//*[contains(text(),'You are connected to:')]"));
    private xeroTextAfterDisconnectElement = element(by.xpath("//*[contains(text(),'You are disconnected from:')]"));

    private companyLink = element(by.xpath("//*[@class='cps-integration-tile__connected-description']//a"));
    private companyQBLink = element(by.xpath("//*[@class='cps-integration-tile__connected-description']//b"));
    private xeroCompanyLinkAfterDisconnect = element(by.xpath("//*[@class='cps-integration-tile__disconnected-error-description']//a"));

    private xeroCacheButton = element(by.xpath("//*[@class='cps-integration-tile__connected-buttons']//div[@title='Pull values from Xero']"))

    private uiButton = element(by.css('.ui-action-menu-item'));
    private xeroSettingButton = element.all(by.xpath("//*[@class='cps-integration-tile__connected-buttons']//div[@class='ui-toolbar-button']")).last();
    private reconnectButton = element(by.xpath("//*[contains(@class,'cps-integration-tile')]//div[@role='button']"));

    //3.4.18
    private lockdateDropDown = "cps-company-section__lock-date-editor";
    private lockdateDropDownElement = Common.ElementByDateQa(this.lockdateDropDown);


}