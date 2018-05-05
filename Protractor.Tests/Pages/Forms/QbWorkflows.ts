import { Common } from "../../Common/Common";
import { Page } from "../Page";
import { QbLoginForm } from "../Forms/QbLoginForm";
import { AllWorkflows } from "../Forms/AllWorkflows";



export class QbWorkflows  extends AllWorkflows {

    constructor(needCheckElement = true) {
        super();
        browser.sleep(1500);
        needCheckElement ? Page.Wait.ElementDisplayed(Common.ElementByDateQa('wfl-empty-card__integration-block',1),'Approval WF'): browser.sleep(50);

    }

    public DisconectClick() {
        Common.Log("QB : disconect");
        let mainWF = new AllWorkflows();
        mainWF.DisconectClick();
    }

    public ConnectToQb(reconnect = false) {
        if (reconnect == false){
            this.ClickQbIntegration();
        }
        else{
            this.ClickReconnectIntegration();
        }
        this.QbAuthorizationHandler();
        let mainWF = new AllWorkflows();
        mainWF.CloseCongratulationPopUp();
    }

    public QbAuthorizationHandler(){
        let qbLoginForm = new QbLoginForm();

        Common.Log('1');
        var self = this;

        var chooseCompanyAMinQBpage = this.chooseCompanyAMinQBpage;
        Common.Log('2');
        browser.wait((element(by.xpath(chooseCompanyAMinQBpage))).isPresent().then(function (result) {
            // Common.Log("chooseCompanyAMinQBpage: " + result.toString());
            Common.Log('3');
            return result ?  element(by.xpath(chooseCompanyAMinQBpage)).click() : qbLoginForm.Login(Page.Config.qbUser);
        }));
        Common.Log('4');
        browser.sleep(5000);
        chooseCompanyAMinQBpage = this.chooseCompanyAMinQBpage;
        browser.wait((element(by.xpath(chooseCompanyAMinQBpage))).isPresent().then(function (result) {
            // Common.Log("chooseCompanyAMinQBpage: " + result.toString());
            return result ?  element(by.xpath(chooseCompanyAMinQBpage)).click() : Common.Log('QB chooseCompanyAMinQBpage == false');
        }));

        // (qbLoginForm.authorize).isPresent().then(function (result) {
        //     return result ? browser.sleep(1000) : qbLoginForm.Login(Page.Config.qbUser);
        // });

        browser.sleep(2000);

        var textInVerifPage = this.textInVerifPage;
        browser.wait((textInVerifPage).isPresent().then(function (result) {

            // Common.Log("textInVerifPage: " + result.toString());
            return result ?  self.VerifAktivsystemsMail() : Common.Log('QB textInVerifPage == false');
        }));


        qbLoginForm.AuthorizeClick();

        Page.Wait.ElementDisplayed(this.textAfterConnect, "Disconnect from QB button",60000);
        browser.sleep(2500);

    }

    public ClickQbIntegration() {
        Common.Log("CompanySetting: Click QB Integration");
        browser.sleep(500);
        this.enableIntegrationQB.click();
        browser.sleep(2000);
    }

    public ClickReconnectIntegration() {
        Common.Log("CompanySetting: Click QB Integration");
        browser.sleep(500);
        this.reconnectIntegration.click();
        browser.sleep(2000);
    }

    public PurchaseOrderClick() {
        Common.Log("QB Workflow list: Purchase order click");
        this.ClickItem(this.purchaseOrderQB);
    }

    protected ClickItem(itemQA: string) {
        // let itemPath = this.GetGroupContainerPath() + Common.DateQaPath(itemQA);
        let itemPath = Common.DateQaPath(itemQA);
        let item = element(by.xpath(itemPath));
        Page.Wait.Element(item, "QB workflow item " + itemQA);
        browser.sleep(1000);
        Common.ScrollIntoView(item);
        item.click();
    }

    private VerifYandexMail() {
        Common.Log('Verif Yandex Mail in QB');
        this.continueVerifCodeButton.click();

        let url = 'https://www.yandex.ru';
        browser.driver.executeScript("$(window.open('https://www.yandex.ru'))");
        browser.sleep(2000);

        Common.SwitchToWindow(1);
        browser.sleep(2000);

        this.yandexName.sendKeys('amqbtest@yandex.ru');
        this.yandexPassword.sendKeys('AMfullacO1AM_');
        this.yandexLoginButton.click();
        browser.sleep(30000);
        this.yandexFirstMessage.click();
        browser.sleep(5000);


        this.SetQBVerifYandexCode(this.codePath);
    }

    private SetQBVerifYandexCode(code){
        var matchCode;
        code.getText().then(function (text) {
            var verifCodeField = element(by.xpath('//*[@id="ius-mfa-confirm-code"]'));
            var continueVerifCodeButton = element(by.xpath('//*[@id="ius-mfa-otp-submit-btn"]'));
            matchCode = text.match(/\d+/).toString();
            browser.close();
            Common.SwitchToWindow(0);
            browser.sleep(2000);
            verifCodeField.sendKeys(matchCode);
            continueVerifCodeButton.click();
        });
    }


    private VerifAktivsystemsMail() {
        Common.Log('Verif Aktivsystems Mail in QB');
        this.continueVerifCodeButton.click();
        browser.sleep(2000);
        Page.Wait.Element(this.verifCodeField, "Code Field");

        let url = 'https://www.aktivsystems.ru/worldclient.dll?Session=FIMTOWP&View=Logout';
        browser.driver.executeScript("$(window.open('https://www.aktivsystems.ru/worldclient.dll?Session=FIMTOWP&View=Logout'))");
        browser.sleep(2000);

        Common.SwitchToWindow(1);
        browser.sleep(2000);

        this.aktivsystemsName.sendKeys(Page.Config.qbUser.Email);
        this.aktivsystemsPassword.sendKeys(Page.Config.qbUser.Password);
        Common.Log('Sleep == 30 sec');
        browser.sleep(30000);
        this.aktivsystemsLoginButton.click();
        browser.sleep(3000);
        this.inboxFolder.click();
        browser.sleep(5000);
        Common.Log('aktivsystemsFirstMessage');
        this.aktivsystemsFirstMessage.click();
        Common.Log('Sleep == 5 sec');
        browser.sleep(5000);
        Common.Log('switchTo frame');
        browser.switchTo().frame(this.iframeContainerID);


        this.SetQBVerifAktivsystemsCode(this.aktivsystemsCodePath);
    }

    private SetQBVerifAktivsystemsCode(code){
        var matchCode;
        code.getText().then(function (text) {
            var verifCodeField = element(by.xpath('//*[@id="ius-mfa-confirm-code"]'));
            var continueVerifCodeButton = element(by.xpath('//*[@id="ius-mfa-otp-submit-btn"]'));
            matchCode = text.match(/\d+/).toString();
            browser.close();
            Common.SwitchToWindow(0);
            browser.sleep(2000);
            verifCodeField.sendKeys(matchCode);
            continueVerifCodeButton.click();
        });
    }




    public PurchaseGetText() {
        Common.Log("QB : Get Purchase Order Text");
        this.GetText(this.purchaseOrderQaDescription)
    }

    public GetText( text) {
        let textElement = element(by.className(this.textPO));
        expect(textElement.getText()).toBe(text, "Text does not match");
    }



    private purchaseOrderQB = "wfl-qbooks-card__open-template-QBooks-PO";



    private enableIntegrationQB = Common.ElementByDateQa("wfl-empty-card__connect-button",1);

    private reconnectIntegration = Common.ElementByDateQa("wfl-int-card-normal-header__reconnect-button");


    private getCodeRadioButton = element(by.xpath('//*[@id="ius-label-mfa-send-an-email-to"]'));
    private continueVerifCodeButton = element(by.xpath('//*[@id="ius-mfa-options-submit-btn"]'));
    private verifCodeField = element(by.xpath('//*[@id="ius-mfa-confirm-code"]'));

    private yandexName = element(by.name('login'));
    private yandexPassword = element(by.name('passwd'));
    private yandexLoginButton = element(by.xpath('//button[contains(@class,"button auth__button")]'));
    private yandexFirstMessage = element.all(by.className('mail-MessageSnippet-Wrapper')).first();
    private codePath = element(by.xpath("//p[contains(text(),'Confirmation code:')]/following-sibling::*[1]"));
    private textInVerifPage = element(by.xpath('//span[contains(text(),"Get a code emailed to:")]'));
    private nameCompanyInQB = "AM";
    // private chooseCompanyAMinQBpage = element(by.xpath('//div[contains(text(),"'+this.nameCompanyInQB+'")]'));
    chooseCompanyAMinQBpage = '//a[contains(text(),"'+this.nameCompanyInQB+'")]';

    private aktivsystemsName = element(by.name('User'));
    private aktivsystemsPassword = element(by.name('Password'));
    private aktivsystemsLoginButton = element(by.name('Logon'));
    private inboxFolder = element(by.id('f0'));
    // private aktivsystemsFirstMessage = element.all(by.className('listCell status')).first();
    private aktivsystemsFirstMessage = element.all(by.xpath("//*[@class='listCell']")).first();

    private aktivsystemsCodePath = element(by.xpath("//p[contains(text(),'Confirmation code:')]/following-sibling::*[1]"));
    private iframeContainerID = "MsgBody";

    private textPO = "wfl-quick-books-card__list-item-description";
    private purchaseOrderQaDescription = "Create Purchase Orders in ApprovalMax and run them through a multi-step approval workflow.";




}