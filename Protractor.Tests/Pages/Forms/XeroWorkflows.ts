import { Common } from "../../Common/Common";
import { CollapsedState ,XeroLoginMethod} from "../../Common/Enums";
import { Page } from "../Page";
import { XeroLoginForm } from "../Forms/XeroLoginForm";
import { AllWorkflows } from "../Forms/AllWorkflows";
import { WarningXeroCompanyChange } from "../../Pages/Popup/WarningXeroCompanyChange";


export class XeroWorkflows extends AllWorkflows {

    constructor() {
        super();
        browser.sleep(1500);
    }

    public DisconectClick() {
        Common.Log("XeroWorkflows: disconect");
        let mainWF = new AllWorkflows();
        mainWF.DisconectClick();
    }

    public ConnectToXero(loginMethod: XeroLoginMethod, reconnect = false, otherCompany = false) {
        if (reconnect == false){
                this.ClickXeroIntegration();
            }
            else{
                this.ClickReconnectXeroIntegration();
        }

        let xeroLoginForm = new XeroLoginForm(loginMethod);
        let userConf =  Page.Config.testUser;

        if (otherCompany){
            userConf =  Page.Config.secondXeroCompany;
        }

        xeroLoginForm.Login(userConf);
        xeroLoginForm.AllowAccessClick();
        browser.sleep(2500);

        if (otherCompany) {
            let warningOtherCompany = new WarningXeroCompanyChange();
        }else {
            Page.Wait.ElementDisplayed(this.textAfterConnect, "Text: Connected to...",60000);
            browser.sleep(2500);
            let mainWF = new AllWorkflows();
            reconnect ?   browser.sleep(50) : mainWF.CloseCongratulationPopUp();
        }
    }

    public ClickXeroIntegration() {
        Common.Log("CompanySetting: Click Xero Integration");
        browser.sleep(500);
        this.enableIntegrationXero.click();
        browser.sleep(2000);
    }

    public ClickReconnectXeroIntegration() {
        Common.Log("CompanySetting: Click Reconnect Integration");
        browser.sleep(500);
        this.reconnectIntegrationXero.click();
        browser.sleep(2000);
    }


    public PayableWorkflows: XeroPayableWorkflowsGroup = new XeroPayableWorkflowsGroup();
    public ReceivableWorkflows: XeroReceivableWorkflowsGroup = new XeroReceivableWorkflowsGroup();

    private listWFclass = element(by.css(".wfl-xero-card__tpl-list"));

    private enableIntegrationXero = Common.ElementByDateQa("wfl-empty-card__connect-button",0);
    private reconnectIntegrationXero = Common.ElementByDateQa("wfl-int-card-normal-header__reconnect-button");

    private cancelAfterTryConnectSecondCompany = element(by.id('closeOverride'));
}

class BaseXeroWorkflowGroup {
    constructor(private groupQA: string) {
    }

    public ClickGroup(collapsed: CollapsedState) {
        let groupItem = Common.ElementByDateQa(this.groupQA);
        Page.Wait.Element(groupItem, "Xero group item " + this.groupQA);
        Common.ScrollIntoView(groupItem);
        groupItem.click()
        browser.sleep(500);

        let groupItemsContainer = element(by.xpath(this.GetGroupContainerPath()));
        switch (collapsed) {
            case CollapsedState.Expand:
                expect(Common.PresentAndDisplayed(groupItemsContainer)).toBe(true, "Xero group item " + this.groupQA + " not displayed");
                break;
            case CollapsedState.Collapsed:
                expect(Common.PresentAndDisplayed(groupItemsContainer)).toBe(false, "Xero group item " + this.groupQA + " displayed");
                break;
        }
    }

    protected ClickItem(itemQA: string) {
        // let itemPath = this.GetGroupContainerPath() + Common.DateQaPath(itemQA);
        let itemPath = Common.DateQaPath(itemQA);
        let item = element(by.xpath(itemPath));
        Page.Wait.Element(item, "Xero workflow item " + itemQA);
        browser.sleep(1000);
        Common.ScrollIntoView(item);
        item.click();
    }

    private GetGroupContainerPath(): string {
        return Common.DateQaPath(this.groupQA) + "/following-sibling::*[contains(@class,'wfl-xero-card__list-group-container')]";
    }

    public GetText(workFlowQA, text) {
        Common.Log("XeroPayableWorkflows: Get Text");
        let textElement = element(by.xpath(Common.DateQaPath(workFlowQA) + this.textPath));
        expect(textElement.getText()).toBe(text, "Text does not match");
    }

    private textPath = "//*[@class='wfl-xero-card__list-item-description wfl-xero-card__list-item-description--disabled']";
}

class XeroPayableWorkflowsGroup extends BaseXeroWorkflowGroup {
    constructor() {
        super("wfl-xero-card__list-group-item-payable");
    }

    public PurchaseOrderClick() {
        Common.Log("XeroPayableWorkflows: Purchase order click");
        this.ClickItem(this.purchaseOrderQA);
    }

    public BillClick() {
        Common.Log("XeroPayableWorkflows: Bill click");
        this.ClickItem(this.billQA);
    }

    public ApCreditNoteClick() {
        Common.Log("XeroPayableWorkflows: Ap credit note click");
        this.ClickItem(this.apCreditNoteQA);
    }

    public PurchaseGetText() {
        Common.Log("XeroPayableWorkflows: Get Purchase Order Text");
        this.GetText(this.purchaseOrderQA,this.purchaseOrderQaDescription)
    }

    public ApCreditNoteGetText() {
        Common.Log("XeroPayableWorkflows: Get Ap Credit Note Text");
        this.GetText(this.apCreditNoteQA,this.apCreditNoteQaDescription)
    }

    public BillGetText() {
        Common.Log("XeroPayableWorkflows: Get Bill Text");
        this.GetText(this.billQA,this.billQaDescription)
    }




    private purchaseOrderQA = "wfl-xero-card__list-item-Xero-PO";
    private billQA = "wfl-xero-card__list-item-Xero-bill";
    private apCreditNoteQA = "wfl-xero-card__list-item-Xero-creditnotes-payable";


    private purchaseOrderQaDescription = 'Create Purchase Orders in ApprovalMax and run them through a multi-step approval workflow.';
    private apCreditNoteQaDescription = 'Run AP Credit Notes created in Xero through a multi-step approval workflow in ApprovalMax.';
    private billQaDescription = 'Run Bills created in Xero through a multi-step approval workflow in ApprovalMax.';
}

class XeroReceivableWorkflowsGroup extends BaseXeroWorkflowGroup {
    constructor() {
        super("wfl-xero-card__list-group-item-receivable");
    }

    public SalesInvoiceClick() {
        Common.Log("XeroReceivableWorkflows: Sales invoice click");
        this.ClickItem(this.salesInvoiceQA);
    }
    public ARCreditNoteClick() {
        Common.Log("XeroReceivableWorkflows: AR Credit Note click");
        this.ClickItem(this.arCreditNoteQA);
    }

    public ARCreditNoteGetText() {
        Common.Log("XeroPayableWorkflows: Get Bill Text");
        this.GetText(this.arCreditNoteQA,this.arCreditNoteQADescription);
    }

    public SalesInvoiceGetText() {
        Common.Log("XeroPayableWorkflows: Get Bill Text");
        this.GetText(this.salesInvoiceQA,this.salesInvoiceQADescription);
    }

    private salesInvoiceQA = "wfl-xero-card__list-item-Xero-invoice";
    private arCreditNoteQA = "wfl-xero-card__list-item-Xero-creditnotes-receivable";

    private salesInvoiceQADescription = "Run Sales Invoices created in Xero through a multi-step approval workflow in ApprovalMax.";
    private arCreditNoteQADescription = "Run AR Credit Notes created in Xero through a multi-step approval workflow in ApprovalMax.";
}