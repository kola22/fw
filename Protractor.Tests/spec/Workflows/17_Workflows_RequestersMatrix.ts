import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { XeroWorkflows } from "../../Pages/Forms/XeroWorkflows";
import { CompanySetting } from "../../Pages/CompanySetting";
import { DropDownState, Validation, DisplayState, CheckBoxState, CloseState, ConditionsType, XeroLoginMethod,AddAction } from "../../Common/Enums";
import { Common } from "../../Common/Common";
import { RandomGenerator } from "../../Common/RandomGenerator";
import { WorkflowStep } from "../../Pages/Forms/WorkflowStep";
import { XeroWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { MatrixPopup } from "../../Pages/Matrix/MatrixPopup";
import { MatrixLinesContainer } from "../../Pages/Matrix/MatrixLinesContainer";
import { QbWorkflows } from "../../Pages/Forms/QbWorkflows";

describe("17_Workflows_RequestersMatrix . ts", function () {

    let companyName = "test" + RandomGenerator.generate(6);

    beforeEach(function () {
        Common.Log('BeforeEach');
        Common.Spies.Set();

        Page.Navigate.TestApp();
        LoginForm.Login(Page.Config.testUser);
        let overView = new OverviewPage();
        overView.CloseNotificationBar();

    });

    afterEach(function () {
        Common.Log('AfterEach');

        Page.Navigate.TestApp();
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.DeleteCompany(companyName);

        let logoMenu = new LogoMenu();
        logoMenu.LogoMenuClick(DropDownState.Open);

        logoMenu.LogoutCLick();
        browser.sleep(1000);
        Common.Spies.Log();
    });


    it("Xero PO", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_17_2yufLpN ');
        let defaultNameStep = Page.Config.defaultStepName;
        let existingApprover2 = "Test Auto";
        browser.sleep(1500);

        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        let settingCompany = new CompanySetting();
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);
        xeroWorkflows.PayableWorkflows.PurchaseOrderClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowCard.RequesterMatrixClick();


        let matrix = new MatrixPopup();
        let approverLinesContainer = MatrixLinesContainer.ByName(existingApprover2);
        let approverLine = approverLinesContainer.GetFirstLine();

        let accountCell = approverLine.GetAsyncConditionCell('Account');
        accountCell.CheckTextTitle('Any Account');

        let itemCell = approverLine.GetAsyncConditionCell('Item');
        itemCell.CheckTextTitle('Any Item');

        let taxCell = approverLine.GetAsyncConditionCell('Tax');
        taxCell.CheckTextTitle('Any Tax');

        let brandingItem = approverLine.GetAsyncConditionCell('Branding');
        brandingItem.CheckTextTitle('Any Branding');




        let supplierCell = approverLine.GetSupplierCreationConditionCell('Supplier');
        supplierCell.CheckTextTitle('Any existing Contact');

        supplierCell.SelectConditionType(ConditionsType.Matches,true);


        let supplierCellDropDown = supplierCell.GetMultiSelectDropDown();
        supplierCellDropDown.FilterDropDown(' ',['TestUser']);
        supplierCellDropDown.FilterDropDown('Te',['TestUser']);
        supplierCellDropDown.FilterDropDown('123',['Empty']);

        supplierCell.SelectConditionType(ConditionsType.DoesNotMatches,true);
        supplierCellDropDown.FilterDropDown(' ',['TestUser']);
        supplierCellDropDown.FilterDropDown('Te',['TestUser']);
        supplierCellDropDown.FilterDropDown('123',['Empty']);
        supplierCellDropDown.FilterDropDown('Test',['TestUser']);

        supplierCell.SelectConditionType(ConditionsType.Any,true);
        supplierCell.SelectConditionType(ConditionsType.DoesNotMatches,true);


        supplierCell.SelectConditionValue('TestUser');
        supplierCell.SelectConditionType(ConditionsType.Matches,true);
        supplierCellDropDown.FilterDropDown(' ',['Empty']);
        supplierCell.SelectConditionType(ConditionsType.AnyAsSupplier,true);
        supplierCell.SelectConditionType(ConditionsType.Matches,true);
        supplierCell.SelectConditionValue('TestUser');
        matrix.Done();

        workflowCard.RequesterMatrixClick();
        supplierCell.CheckSelected(['TestUser']);
        supplierCell.DeleteConditionValue('TestUser');
        supplierCell.SelectConditionType(ConditionsType.Any,true);
        supplierCell.CheckCreateCheckBox(CheckBoxState.Unchecked);
        supplierCell.CheckBoxClick();
        matrix.Done();
        workflowCard.RequesterMatrixClick();
        supplierCell.CheckCreateCheckBox(CheckBoxState.Checked);

    });

    it("QB PO", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_17_2yufLpN ');
        let defaultNameStep = Page.Config.defaultStepName;
        let existingApprover2 = "Test Auto";
        browser.sleep(1500);

        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        let settingCompany = new CompanySetting();
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);

        let qbWorkflows = new QbWorkflows();
        qbWorkflows.ConnectToQb();
        qbWorkflows.PurchaseOrderClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowCard.RequesterMatrixClick();


        let matrix = new MatrixPopup();
        let approverLinesContainer = MatrixLinesContainer.ByName(existingApprover2);
        let approverLine = approverLinesContainer.GetFirstLine();

        let vendorCell = approverLine.GetAsyncConditionCell('Vendor');
        vendorCell.CheckTextTitle('Any Vendor');

        let productCell = approverLine.GetAsyncConditionCell('Product/Service');
        productCell.CheckTextTitle('Any Product/Service');


        //    ------------------------ Vendor --------------------------------
        vendorCell.SelectConditionType(ConditionsType.Matches);

        let vendorCellDropDown = vendorCell.GetMultiSelectDropDown();
        vendorCellDropDown.FilterDropDown(' ',['QB test']);
        vendorCellDropDown.FilterDropDown('QB',['QB test']);
        vendorCellDropDown.FilterDropDown('123',['Empty']);

        vendorCell.SelectConditionType(ConditionsType.DoesNotMatches);
        vendorCellDropDown.FilterDropDown(' ',['QB test']);
        vendorCellDropDown.FilterDropDown('QB',['QB test']);
        vendorCellDropDown.FilterDropDown('123',['Empty']);
        vendorCellDropDown.FilterDropDown('QB test',['QB test']);

        vendorCell.SelectConditionType(ConditionsType.Any);
        vendorCell.SelectConditionType(ConditionsType.DoesNotMatches);


        vendorCell.SelectConditionValue('QB test');
        vendorCell.SelectConditionType(ConditionsType.Matches);
        vendorCellDropDown.FilterDropDown(' ',['Empty']);
        vendorCell.SelectConditionType(ConditionsType.Any);
        vendorCell.SelectConditionType(ConditionsType.Matches);
        vendorCell.SelectConditionValue('QB test');
        matrix.Done();

        workflowCard.RequesterMatrixClick();
        vendorCell.CheckSelected(['QB test']);
        vendorCell.DeleteConditionValue('QB test');
        matrix.Done();
        vendorCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();

        //    ------------------------ Product --------------------------------

        workflowCard.RequesterMatrixClick();
        productCell.SelectConditionType(ConditionsType.Matches);

        let productCellDropDown = productCell.GetMultiSelectDropDown();
        productCellDropDown.FilterDropDown(' ',['Oil 777']);
        productCellDropDown.FilterDropDown('Oil',['Oil 777']);
        productCellDropDown.FilterDropDown('123',['Empty']);

        productCell.SelectConditionType(ConditionsType.DoesNotMatches);
        productCellDropDown.FilterDropDown(' ',['Oil 777']);
        productCellDropDown.FilterDropDown('Oil',['Oil 777']);
        productCellDropDown.FilterDropDown('123',['Empty']);
        productCellDropDown.FilterDropDown('Oil 777',['Oil 777']);

        productCell.SelectConditionType(ConditionsType.Any);
        productCell.SelectConditionType(ConditionsType.DoesNotMatches);

        productCell.SelectConditionValue('Oil 777');
        productCell.SelectConditionType(ConditionsType.Matches);
        productCellDropDown.FilterDropDown(' ',['Empty']);
        productCell.SelectConditionType(ConditionsType.Any);
        productCell.SelectConditionType(ConditionsType.Matches);
        productCell.SelectConditionValue('Oil 777');
        matrix.Done();

        workflowCard.RequesterMatrixClick();
        productCell.CheckSelected(['Oil 777']);
        productCell.DeleteConditionValue('Oil 777');
        matrix.Done();
        productCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();

    });
});
