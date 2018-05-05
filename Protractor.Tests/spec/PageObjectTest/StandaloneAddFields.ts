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
import { MatrixLinesContainer } from "../../Pages/Matrix/MatrixLinesContainer";
import { StandAloneMatrix } from "../../Pages/Matrix/StandAloneMatrix";
import { MatrixHeader } from "../../Pages/Matrix/MatrixHeader";
import { XeroWorkflows } from "../../Pages/Forms/XeroWorkflows";

describe("StandaloneAddFields", function () {

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

    it("StandaloneAddFields", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_1_2sKlhEF ');

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

        let matrix = new StandAloneMatrix();
        // let header1 = matrix.AddNewField("aaa");
        // let header2 = matrix.AddNewField("bbb");
        // let header3 = matrix.AddNewField("ccc");
        //
        // header2.Remove();
        // header3.RenameByDropDown("fff");

        // let newuserName1 = "someQA" + RandomGenerator.generate(4);
        // matrix.AddNewUser(newuserName1);
        //
        // let newuserName2 = "someQA" + RandomGenerator.generate(4);
        // matrix.AddNewUser(newuserName2);

        let matrixLine = MatrixLinesContainer.GetFirstLineByName(existingApprover2);

        let conditionCell = matrixLine.GetAmountConditionCell();
        conditionCell.SelectConditionType(ConditionsType.Within);
        conditionCell.SetValue1('77', ConditionsType.Within, null, protractor.Key.TAB);
        conditionCell.SetValue2('99', ConditionsType.Within);

        conditionCell.SelectConditionType(ConditionsType.Under);
        conditionCell.SetValue1('33', ConditionsType.Under);

        conditionCell.SelectConditionType(ConditionsType.OverOrEqualTo);
        conditionCell.SetValue1('133', ConditionsType.OverOrEqualTo);

        //TO DO 
        //Somthing wrongs when value is "." need research
        //conditionCell.SelectConditionType(ConditionsType.OverOrEqualTo);
        //conditionCell.SetValue1('.', ConditionsType.OverOrEqualTo, Validation.NotValid);

        conditionCell.SelectConditionType(ConditionsType.OverOrEqualTo);
        conditionCell.SetValue1('656', ConditionsType.OverOrEqualTo);

        conditionCell.SelectConditionType(ConditionsType.Any);

        matrix.Done();
        workflowCard.SaveWorkflow();
        workflowCard.Close();
    });

});
