import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { XeroWorkflows } from "../../Pages/Forms/XeroWorkflows";
import { CompanySetting } from "../../Pages/CompanySetting";
import { DropDownState, Validation, DisplayState, WorkFlowType, CloseState, ConditionsType, XeroLoginMethod } from "../../Common/Enums";
import { Common } from "../../Common/Common";
import { RandomGenerator } from "../../Common/RandomGenerator";
import { WorkflowStep } from "../../Pages/Forms/WorkflowStep";
import { XeroWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { MatrixPopup } from "../../Pages/Matrix/MatrixPopup";
import { MatrixLinesContainer } from "../../Pages/Matrix/MatrixLinesContainer";
import { QbWorkflows } from "../../Pages/Forms/QbWorkflows";

describe("9_Workflows_POEachCell . ts", function () {

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



    it("Xero PO ", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_9_2grhSCQ ');
        let defaultNameStep = Page.Config.defaultStepName; //'Approval step'
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
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();
        let approverLinesContainer = MatrixLinesContainer.ByName(existingApprover2);
        let approverLine = approverLinesContainer.GetFirstLine();
        let totalAmount = approverLine.GetAmountConditionCell();
        totalAmount.CheckPreview('Any amount');
        let supplierCell = approverLine.GetAsyncConditionCell('Supplier');
        supplierCell.CheckTextTitle('Any Supplier');
        let accountCell = approverLine.GetAsyncConditionCell('Account');
        accountCell.CheckTextTitle('Any Account');
        let itemCell = approverLine.GetAsyncConditionCell('Item');
        itemCell.CheckTextTitle('Any Item');
        let taxCell = approverLine.GetAsyncConditionCell('Tax');
        taxCell.CheckTextTitle('Any Tax');

        let requesterCell = approverLine.GetAsyncConditionCell('Requester');
        requesterCell.CheckTextTitle('Any Requester');
        let brandingCell = approverLine.GetAsyncConditionCell('Branding');
        brandingCell.CheckTextTitle('Any Branding');

        // ----------------Requester------------------
        requesterCell.SelectConditionType(ConditionsType.Matches);
        let requesterCellDropDown = requesterCell.GetMultiSelectDropDown();
        requesterCellDropDown.FilterDropDown('',['Test Auto']);
        requesterCellDropDown.FilterDropDown('Te',['Test Auto']);
        requesterCellDropDown.FilterDropDown('123',['Empty']);
        requesterCell.SelectConditionType(ConditionsType.DoesNotMatches);
        requesterCellDropDown.FilterDropDown('',['Test Auto']);
        requesterCellDropDown.FilterDropDown('Te',['Test Auto']);
        requesterCellDropDown.FilterDropDown('123',['Empty']);
        requesterCellDropDown.FilterDropDown('Test Auto',['Test Auto']);
        taxCell.SelectConditionType(ConditionsType.Matches);
        taxCell.SelectConditionType(ConditionsType.Any);
        requesterCell.SelectConditionValue('Test Auto',['Test Auto']);
        requesterCell.SelectConditionType(ConditionsType.Any);
        requesterCell.SelectConditionType(ConditionsType.Matches);
        requesterCell.SelectConditionValue('Test Auto',['Test Auto']);
        matrix.Done();

        workflowStep1.ApproverMatrixClick();
        requesterCell.CheckSelected(['Test Auto']);
        requesterCell.DeleteConditionValue('Test Auto');
        matrix.Done();
        requesterCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();

        // ----------------Branding------------------
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Supplier');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
        requesterCell.CheckTextTitle('Any Requester');
        brandingCell.CheckTextTitle('Any Branding');

        brandingCell.SelectConditionType(ConditionsType.Matches);
        let brandingCellDropDown = brandingCell.GetMultiSelectDropDown();
        brandingCellDropDown.FilterDropDown('',['Standard']);
        brandingCellDropDown.FilterDropDown('St',['Standard']);
        brandingCellDropDown.FilterDropDown('123',['Empty']);
        brandingCell.SelectConditionType(ConditionsType.DoesNotMatches);
        brandingCellDropDown.FilterDropDown('',['Standard']);
        brandingCellDropDown.FilterDropDown('St',['Standard']);
        brandingCellDropDown.FilterDropDown('123',['Empty']);
        taxCell.SelectConditionType(ConditionsType.Matches);
        taxCell.SelectConditionType(ConditionsType.Any);
        brandingCell.SelectConditionValue('Standard',['Standard']);
        brandingCellDropDown.FilterDropDown('',['Empty']);
        brandingCell.SelectConditionType(ConditionsType.Any);
        brandingCell.SelectConditionType(ConditionsType.Matches);
        brandingCell.SelectConditionValue('Standard',['Standard']);
        matrix.Done();

        workflowStep1.ApproverMatrixClick();
        brandingCell.CheckSelected(['Standard']);
        brandingCell.DeleteConditionValue('Standard');
        matrix.Done();
        brandingCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();


    //     нужно добавить QB
    //     нужно добавить проверки остальных ячеек, которые уже проверяются в 8_Workflows_EachStateEachCellInXeroWF.ts

    });
});

describe("9_Workflows_POEachCell QB. ts", function () {

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



    it("QB PO ", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_9_2grhSCQ ');
        let defaultNameStep = Page.Config.defaultStepName; //'Approval step'
        let existingApprover2 = "Test Auto";
        browser.sleep(1500);

        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let qbWorkflows = new QbWorkflows();
        qbWorkflows.ConnectToQb();
        qbWorkflows.PurchaseOrderClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();
        let approverLinesContainer = MatrixLinesContainer.ByName(existingApprover2);
        let approverLine = approverLinesContainer.GetFirstLine();

        let totalAmount = approverLine.GetAmountConditionCell();
        totalAmount.CheckPreview('Any amount');

        let vendorCell = approverLine.GetAsyncConditionCell('Vendor');
        vendorCell.CheckTextTitle('Any Vendor');

        let productCell = approverLine.GetAsyncConditionCell('Product/Service');
        productCell.CheckTextTitle('Any Product/Service');

        //    ------------------------ Requester ------------------
        // https://approvalmax.myjetbrains.com/youtrack/issue/AM-1779


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

        workflowStep1.ApproverMatrixClick();
        vendorCell.CheckSelected(['QB test']);
        vendorCell.DeleteConditionValue('QB test');
        matrix.Done();
        vendorCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();

        //    ------------------------ Product --------------------------------

        workflowStep1.ApproverMatrixClick();
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

        workflowStep1.ApproverMatrixClick();
        productCell.CheckSelected(['Oil 777']);
        productCell.DeleteConditionValue('Oil 777');
        matrix.Done();
        productCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();


// ----------------Total amount cell       Under------------------
        Common.LogNameTestPlan('Total amount cell       Under');
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Any amount');
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('',ConditionsType.Under,Validation.NotValid,protractor.Key.TAB);
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('abcde',ConditionsType.Under,Validation.NotValid,protractor.Key.TAB);
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('    ',ConditionsType.Under,Validation.NotValid,protractor.Key.TAB);

        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('123',ConditionsType.Under);
        totalAmount.CheckPreview('Under 123.00 ANG');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('12345',ConditionsType.Under);
        totalAmount.CheckPreview('Under 12,345.00 ANG');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('0000',ConditionsType.Under);
        totalAmount.CheckPreview('Under 0.00 ANG');
        // ПОКА НЕ РАБОТАЕТ
        // totalAmount.SelectConditionType(ConditionsType.Any);
        // totalAmount.SelectConditionType(ConditionsType.Under);
        // totalAmount.SetValue1('0,123',ConditionsType.Under);
        // totalAmount.CheckPreview('Under 0.12 RUB');
        // totalAmount.SelectConditionType(ConditionsType.Any);
        // totalAmount.SelectConditionType(ConditionsType.Under);
        // totalAmount.SetValue1('0,129',ConditionsType.Under);
        // totalAmount.CheckPreview('Under 0.13 RUB');
        // totalAmount.SelectConditionType(ConditionsType.Any);
        // totalAmount.SelectConditionType(ConditionsType.Under);
        // totalAmount.SetValue1('0,9',ConditionsType.Under);
        // totalAmount.CheckPreview('Under 0.90 RUB');
        // totalAmount.SelectConditionType(ConditionsType.Any);
        // totalAmount.SelectConditionType(ConditionsType.Under);
        // totalAmount.SetValue1('0.123',ConditionsType.Under);
        // totalAmount.CheckPreview('Under 0.12 RUB');
        // totalAmount.SelectConditionType(ConditionsType.Any);
        // totalAmount.SelectConditionType(ConditionsType.Under);
        // totalAmount.SetValue1('0.129',ConditionsType.Under);
        // totalAmount.CheckPreview('Under 0.13 RUB');
        // totalAmount.SelectConditionType(ConditionsType.Any);
        // totalAmount.SelectConditionType(ConditionsType.Under);
        // totalAmount.SetValue1('0.9',ConditionsType.Under);
        // totalAmount.CheckPreview('Under 0.90 RUB');
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 0.00 ANG');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('678',ConditionsType.Under);
        totalAmount.CheckPreview('Under 678.00 ANG');
        matrix.Done();

        workflowCard.ActivateWorkflow();
        // workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 678.00 ANG');
        totalAmount.SelectConditionType(ConditionsType.Any);
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('    ',ConditionsType.Under,Validation.NotValid,protractor.Key.TAB);
        matrix.Done();
        totalAmount.SelectConditionType(ConditionsType.Any);
        matrix.Done();


        // ----------------Total amount cell        Over or equal to------------------
        Common.LogNameTestPlan('Total amount cell        Over or equal to');
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Any amount');
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);

        totalAmount.SetValue1('',ConditionsType.OverOrEqualTo,Validation.NotValid,protractor.Key.TAB);
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('abcde',ConditionsType.OverOrEqualTo,Validation.NotValid,protractor.Key.TAB);
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('    ',ConditionsType.OverOrEqualTo,Validation.NotValid,protractor.Key.TAB);

        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('123',ConditionsType.OverOrEqualTo);
        totalAmount.CheckPreview('Over or equal to 123.00 ANG');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('12345',ConditionsType.OverOrEqualTo);
        totalAmount.CheckPreview('Over or equal to 12,345.00 ANG');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('0000',ConditionsType.OverOrEqualTo);
        totalAmount.CheckPreview('Over or equal to 0.00 ANG');
        // // ПОКА НЕ РАБОТАЕТ
        // // totalAmount.SelectConditionType(ConditionsType.Any);
        // // totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        // // totalAmount.SetValue1('0,123',ConditionsType.OverOrEqualTo);
        // // totalAmount.CheckPreview('Over or equal to 0.12 RUB');
        // // totalAmount.SelectConditionType(ConditionsType.Any);
        // // totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        // // totalAmount.SetValue1('0,129',ConditionsType.OverOrEqualTo);
        // // totalAmount.CheckPreview('Over or equal to 0.13 RUB');
        // // totalAmount.SelectConditionType(ConditionsType.Any);
        // // totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        // // totalAmount.SetValue1('0,9',ConditionsType.OverOrEqualTo);
        // // totalAmount.CheckPreview('Over or equal to 0.90 RUB');
        // // totalAmount.SelectConditionType(ConditionsType.Any);
        // // totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        // // totalAmount.SetValue1('0.123',ConditionsType.OverOrEqualTo);
        // // totalAmount.CheckPreview('Over or equal to 0.12 RUB');
        // // totalAmount.SelectConditionType(ConditionsType.Any);
        // // totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        // // totalAmount.SetValue1('0.129',ConditionsType.OverOrEqualTo);
        // // totalAmount.CheckPreview('Over or equal to 0.13 RUB');
        // // totalAmount.SelectConditionType(ConditionsType.Any);
        // // totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        // // totalAmount.SetValue1('0.9',ConditionsType.OverOrEqualTo);
        // // totalAmount.CheckPreview('Over or equal to 0.90 RUB');

        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Over or equal to 0.00 ANG');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('678',ConditionsType.OverOrEqualTo);
        totalAmount.CheckPreview('Over or equal to 678.00 ANG');
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Over or equal to 678.00 ANG');
        totalAmount.SelectConditionType(ConditionsType.Any);
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('    ',ConditionsType.OverOrEqualTo,Validation.NotValid,protractor.Key.TAB);
        matrix.Done();
        totalAmount.SelectConditionType(ConditionsType.Any);
        matrix.Done();

        // ----------------Total amount cell        Within------------------
        Common.LogNameTestPlan('Total amount cell        Within');
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Any amount');
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue2('',ConditionsType.Within,Validation.NotValid,protractor.Key.TAB);
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('abcde',null,Validation.NotValid,protractor.Key.TAB);
        totalAmount.SetValue2('abcde',ConditionsType.Within,Validation.NotValid,protractor.Key.TAB);
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1(' ',null,Validation.NotValid,protractor.Key.TAB);
        totalAmount.SetValue2(' ',ConditionsType.Within,Validation.NotValid,protractor.Key.TAB);
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('123',null,Validation.NotValid,protractor.Key.TAB);
        totalAmount.SetValue2('333',ConditionsType.Within);
        totalAmount.CheckPreview('Within 123.00 ANG-333.00 ANG');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('000',ConditionsType.Within);
        totalAmount.CheckPreview('Within 0.00 ANG-333.00 ANG');

        //ПОКА НЕ РАБОТАЕТ КУСОК С ТЕСТ-КЕЙСА С ПРОВЕРКОЙ ДЕСЯТИЧНЫХ
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('12345',null,Validation.Any,protractor.Key.TAB);
        totalAmount.SetValue2('100',ConditionsType.Within,Validation.NotValid,protractor.Key.TAB);
        totalAmount.CheckPreview('Within 12,345.00 ANG-100.00 ANG');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue2('33333',ConditionsType.Within);
        totalAmount.CheckPreview('Within 12,345.00 ANG-33,333.00 ANG');
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Within 12,345.00 ANG-33,333.00 ANG');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue2('22222',ConditionsType.Within);
        totalAmount.CheckPreview('Within 12,345.00 ANG-22,222.00 ANG');
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Within 12,345.00 ANG-22,222.00 ANG');

        // // НЕ ПОЛУЧАЕТСЯ ОЧИСТИТЬ ПОЛЯ
        // totalAmount.SelectConditionType(ConditionsType.Any);
        // totalAmount.SelectConditionType(ConditionsType.Within);
        // totalAmount.SetValue1('___',null,Validation.Any,protractor.Key.TAB);
        // totalAmount.SetValue2(' ',null,Validation.Any,protractor.Key.TAB);
        // matrix.Done();


        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue2('7',null,Validation.NotValid);
        totalAmount.CheckPreview('Within 12,345.00 ANG-7.00 ANG');
        matrix.Done();
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('99',null,Validation.NotValid);
        totalAmount.CheckPreview('Within 99.00 ANG-7.00 ANG');
        matrix.Done();
        // // // НЕ ПОЛУЧАЕТСЯ ОЧИСТИТЬ ПОЛЯ
        // totalAmount.SelectConditionType(ConditionsType.Any);
        // totalAmount.SelectConditionType(ConditionsType.Within);
        // totalAmount.SetValue2(' ',null,Validation.NotValid);
        // totalAmount.CheckPreview('Within 99.00 RUB-not set');
        matrix.Done();
        totalAmount.SelectConditionType(ConditionsType.Any);
        matrix.Done();

    });
});
