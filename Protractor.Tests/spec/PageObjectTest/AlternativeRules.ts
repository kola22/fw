import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { CompanySetting } from "../../Pages/CompanySetting";
import { DropDownState, Validation, DisplayState, WorkFlowType, ConditionsType, XeroLoginMethod, ValueState } from "../../Common/Enums";
import { Common } from "../../Common/Common";
import { RandomGenerator } from "../../Common/RandomGenerator";
import { WorkflowStep } from "../../Pages/Forms/WorkflowStep";
import { StandAloneWorkflowCard, XeroWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { StandaloneWorkflows } from "../../Pages/Forms/StandaloneWorkflows";
import { MatrixLine } from "../../Pages/Matrix/MatrixLine";
import { MatrixLineAlternativeRule } from "../../Pages/Matrix/MatrixLineAlternativeRule";
import { MatrixPopup } from "../../Pages/Matrix/MatrixPopup";
import { MatrixHeader } from "../../Pages/Matrix/MatrixHeader";
import { MatrixAsyncConditionCell } from "../../Pages/Matrix/MatrixAsyncConditionCell";
import { MatrixLinesContainer } from "../../Pages/Matrix/MatrixLinesContainer";
import { XeroWorkflows } from "../../Pages/Forms/XeroWorkflows";

describe("AlternativeRules", function () {

    let companyName = "test" + RandomGenerator.generate(6);
    let addSAWorkflow = function (name: string) {
        let standaloneWorkflows = new StandaloneWorkflows();
        standaloneWorkflows.CreateClick();

        let workflowCard = new StandAloneWorkflowCard();

        workflowCard = new StandAloneWorkflowCard();

        workflowCard.SetName(name);

        workflowCard.SaveWorkflow();

        workflowCard.Close();

    };

    beforeEach(function () {
        Common.Log('BeforeEach');
        Common.Spies.Set();

        Page.Navigate.TestApp();
        LoginForm.Login(Page.Config.testUser);
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

    it("Alternative rule: Xero workflows", function () {
       
        let defaultNameStep = Page.Config.defaultStepName;
        let newStep1 = 'testtest';
        let newStep2 = 'QA_QA_QA';

        let existingApprover2 = "Test Auto";
        let newApproverMail = "someQA@mail.com";
        let newApproverName = "someQA";

        let overView = new OverviewPage();
        overView.HamburgerClick();

        overView.AddNewCompany(companyName);
        let settingCompany = new CompanySetting();
        settingCompany.ConnectToXeroInSettingPage();

        overView.HamburgerClick();

        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();

        xeroWorkflows.PayableWorkflows.BillClick();

        let workflowCard = new XeroWorkflowCard();

        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.RenameStep(newStep1);
        workflowStep1.AddNewApprover(newApproverMail, [newApproverName.toLowerCase()]);
        workflowStep1.AddExistingApprover(existingApprover2, [newApproverName.toLowerCase(), existingApprover2]);

        workflowStep1.ApproverMatrixClick();

        let matrix = new MatrixPopup();


        let approver2LinesContainer = MatrixLinesContainer.ByName(existingApprover2);
        let approver2Line = approver2LinesContainer.GetFirstLine();

        let firstLineAccountCell = approver2Line.GetAsyncConditionCell("Account");
        firstLineAccountCell.SelectConditionType(ConditionsType.Matches);
        firstLineAccountCell.SelectConditionValue("320 - Direct Wages", ["320 - Direct Wages"]);

        approver2Line.AddAlternativeRule();
        approver2Line.AddAlternativeRule();

        let alternativeRuleLine1 = approver2LinesContainer.GetAlternativeRuleLine("1");
        let alternativeRuleLine2 = approver2LinesContainer.GetAlternativeRuleLine("2");

        let accountCell = alternativeRuleLine2.GetAsyncConditionCell("Account");
        accountCell.SelectConditionType(ConditionsType.Matches);
        accountCell.SelectConditionValue("200 - Sales", ["200 - Sales"]);
        accountCell.SelectConditionValue("260 - Other Revenue", ["200 - Sales", "260 - Other Revenue"]);
        accountCell.DeleteConditionValue("200 - Sales", ["260 - Other Revenue"]);

        alternativeRuleLine1.Remove();

        //alternative rule line 2 became 1 after removing
        alternativeRuleLine1 = approver2LinesContainer.GetAlternativeRuleLine("1");
        accountCell = alternativeRuleLine1.GetAsyncConditionCell("Account");
        accountCell.CheckSelected(["260 - Other Revenue"]);

        matrix.Done();
        workflowCard.SaveWorkflow();
        workflowCard.Close();
    });

});
