import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { CompanySetting } from "../../Pages/CompanySetting";
import {
    DropDownState, Validation, DisplayState, WorkFlowType, ConditionsType, XeroLoginMethod, ValueState,
    EnabledState
} from "../../Common/Enums";
import { Common } from "../../Common/Common";
import { RandomGenerator } from "../../Common/RandomGenerator";
import { WorkflowStep } from "../../Pages/Forms/WorkflowStep";
import { StandAloneWorkflowCard, XeroWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { StandaloneWorkflows } from "../../Pages/Forms/StandaloneWorkflows";
import { XeroWorkflows } from "../../Pages/Forms/XeroWorkflows";
import { StandAloneMatrix } from "../../Pages/Matrix/StandAloneMatrix";
import { MatrixPopup } from "../../Pages/Matrix/MatrixPopup";

import { MatrixLine } from "../../Pages/Matrix/MatrixLine";
import { MatrixLinesContainer } from "../../Pages/Matrix/MatrixLinesContainer";


describe("7_Workflows_ApprovalMatrix . ts ", function () {

    let companyName = "test" + RandomGenerator.generate(6);
    let defaultNameStep = Page.Config.defaultStepName;

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

    it("Approval Matrix StandAlone WorkFlow", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_7_2u3zx8r ');


        let existingApprover2 = "Test Auto";

        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let standaloneWorkflows = new StandaloneWorkflows();
        standaloneWorkflows.CreateFirstClick();

        let workflowCard = new StandAloneWorkflowCard();

        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);

        //5 Click Approval Matrix in first step	"Open Approval Matrix:
        //One line == administrator user
        //One column == Amount (USD)
        workflowStep1.ApproverMatrixClick();
        let matrix = new StandAloneMatrix();
        let matrixLine = MatrixLinesContainer.GetFirstLineByName(existingApprover2);


        //6 Set value == Over or equal to 111         IN 1 string 1 column
        //7 Check value IN 1 string 1 column	.== Over or equal to 111.00 USD
        let amountConditionCell = matrixLine.GetAmountConditionCell();
        amountConditionCell.SelectConditionType(ConditionsType.OverOrEqualTo);
        amountConditionCell.SetValue1('133', ConditionsType.OverOrEqualTo);

        //8 Set value == Under 999        IN 1 string 1 column
        //9 Check value IN 1 string 1 column	.== Under 999.00 USD
        amountConditionCell.SelectConditionType(ConditionsType.Under);
        amountConditionCell.SetValue1('999', ConditionsType.Under);

        //10 Set value == Within 1001 -- 2222        IN 1 string 1 column
        //11 Check value IN 1 string 1 column	.== Within 1,001.00 USD-2,222.00 USD
        amountConditionCell.SelectConditionType(ConditionsType.Within);
        amountConditionCell.SetValue1('1001', ConditionsType.Within, Validation.NotValid);

        amountConditionCell.SelectConditionType(ConditionsType.Within);
        amountConditionCell.SetValue2('2222', ConditionsType.Within);

        //12 Set value == Any amount        IN 1 string 1 column
        //13 Check value IN 1 string 1 column	 Any amount
        amountConditionCell.SelectConditionType(ConditionsType.Any);

        //14 Set value == Within 1 -- 300        IN 1 string 1 column
        //15 Check value IN 1 string 1 column	.== Within 1.00 USD-300.00 USD
        amountConditionCell.SelectConditionType(ConditionsType.Within);
        amountConditionCell.SetValue1('1', ConditionsType.Within, null, protractor.Key.TAB);
        amountConditionCell.SetValue2('300', ConditionsType.Within);

        //16 Add new column == Test	Column added
        let headerColumn = matrix.AddNewField("Test");

        //17 Set value == Test matches ""QAQAtest""        IN 1 string 2 column
        //18 Check value IN 1 string 2 column	, == Test matches "QAQAtest"
        let conditionCell = matrixLine.GetConditionCell("Test");
        conditionCell.SelectConditionType(ConditionsType.Matches);
        conditionCell.AddNewConditonValue('QAQAtest', ['QAQAtest']);

        //19 Add new value  IN 1 string 2 column == 123_321
        //20 Check value IN 1 string 2 column	 Test matches "QAQAtest" "123_321"
        conditionCell.AddNewConditonValue('123_321', ['QAQAtest', '123_321']);
        matrix.Done();

        //22 Click Approval Matrix in first step
        workflowStep1.ApproverMatrixClick();

        //23 Check value IN 1 string 1 column .== Within 1.00 USD-300.00 USD
        amountConditionCell.CheckPreview('Within 1.00 USD-300.00 USD');

        //24 Check value IN 1 string 2 column	 Test matches "QAQAtest" "123_321"
        conditionCell.CheckSelected(['123_321', 'QAQAtest']);
        matrix.Done();

        workflowCard.SaveWorkflow();
        workflowCard.ActivateWorkflow(EnabledState.Disabled);
        workflowCard.Close();

    });

    it("Approval Matrix Xero WorkFlow", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_7_2u3zx8r ');

        let existingApprover2 = "Test Auto";
        browser.sleep(1500);
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);
        xeroWorkflows.PayableWorkflows.BillClick();
        let workflowCard = new XeroWorkflowCard();

        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);


        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();
        let matrixLine = MatrixLinesContainer.GetFirstLineByName(existingApprover2);

        //11 "Set value Total amount (RUB) == Over or equal to 123        "	Is set
        //12 Check value IN Total amount (RUB) column	.==Over or equal to 123.00 RUB
        let amountConditionCell = matrixLine.GetAmountConditionCell();
        amountConditionCell.SelectConditionType(ConditionsType.OverOrEqualTo);
        amountConditionCell.SetValue1('123', ConditionsType.OverOrEqualTo);

        //13 Set value Supplier == Supplier matches         Is set
        //14 Choose Supplier == TestUser	                TestUser is set in Supplier column
        //15 Check value IN Supplier  column	            .==TestUser
        let supplierCell = matrixLine.GetAsyncConditionCell('Supplier');
        supplierCell.SelectConditionType(ConditionsType.Matches);
        supplierCell.SelectConditionValue('TestUser', ['TestUser']);

        //16 Set value Account == Account matches       Is set
        //17 Choose Supplier == 404 - Bank Fees	        404 - Bank Fees is set in Account column
        //18 Check value IN Account column	            .== 404 - Bank Fees
        let accountCell = matrixLine.GetAsyncConditionCell('Account');
        accountCell.SelectConditionType(ConditionsType.Matches);
        accountCell.SelectConditionValue('404 - Bank Fees', ['404 - Bank Fees']);

        //19 "Set value Item == Item matches
        //20 Choose Item == Code_QaaAutoTest : QaaAutoTest	        "Code_QaaAutoTest : QaaAutoTest" is set in Item column
        //21 Check value IN Item column	                            .== Code_QaaAutoTest : QaaAutoTest
        let itemCell = matrixLine.GetAsyncConditionCell('Item');
        itemCell.SelectConditionType(ConditionsType.Matches);
        itemCell.SelectConditionValue('Code_QaaAutoTest : QaaAutoTest', ['Code_QaaAutoTest : QaaAutoTest']);

        // "Set value Tax == Tax matches
        // Choose Tax == Tax on Sales	        "Tax on Sales" is set in Tax column
        // Check value IN Tax column	        .== Tax on Sales
        let taxCell = matrixLine.GetAsyncConditionCell('Tax');
        taxCell.SelectConditionType(ConditionsType.Matches);
        taxCell.SelectConditionValue('Tax on Sales', ['Tax on Sales']);

        //25 Click Done          Approval matrix closed.
        matrix.Done();

        //26 Click Approval Matrix in first step
        workflowStep1.ApproverMatrixClick();

        // 27 Check value in all column
        // Total amount (RUB)==Over or equal to 123.00 RUB
        // Supplier==TestUser
        // Account==404 - Bank Fees
        // Item==Code_QaaAutoTest : QaaAutoTest
        // Tax==Tax on Sales"
        amountConditionCell.CheckPreviewContain('123');
        supplierCell.CheckSelected(['TestUser']);
        accountCell.CheckSelected(['404 - Bank Fees']);
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest']);
        taxCell.CheckSelected(['Tax on Sales']);

        //28 "Set value Supplier == Any supplier
        supplierCell.SelectConditionType(ConditionsType.Any);

        //30 Set value Account == Account does not match
        //31 Check value IN Account column	.==404 - Bank Fees (the value was gray)
        accountCell.SelectConditionType(ConditionsType.DoesNotMatches);
        accountCell.CheckSelected(['404 - Bank Fees']);

        //32 Add new Item == Empty
        //33 Check value IN Item column	"1. == Code_QaaAutoTest : QaaAutoTest (green)   2. == Empty (gray) "
        itemCell.SelectConditionValue('Empty', ['Code_QaaAutoTest : QaaAutoTest', 'Empty']);

        //34 Add new Tax == Tax on Purchases
        //35 Check value IN Tax column	"1. == Tax on Sales (green)        2. == Tax on Purchases (green) "
        taxCell.SelectConditionValue('Tax on Purchases', ['Tax on Sales', 'Tax on Purchases']);

        matrix.Done();

        workflowCard.SaveWorkflow();
        workflowCard.ActivateWorkflow();
        workflowCard.Close();

    });

});
