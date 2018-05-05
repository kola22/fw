import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { XeroWorkflows } from "../../Pages/Forms/XeroWorkflows";
import { CompanySetting } from "../../Pages/CompanySetting";
import { DropDownState, Validation, DisplayState, WorkFlowType, CloseState, ConditionsType, XeroLoginMethod,AddAction } from "../../Common/Enums";
import { Common } from "../../Common/Common";
import { RandomGenerator } from "../../Common/RandomGenerator";
import { WorkflowStep } from "../../Pages/Forms/WorkflowStep";
import { XeroWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { MatrixPopup } from "../../Pages/Matrix/MatrixPopup";
import { MatrixLinesContainer } from "../../Pages/Matrix/MatrixLinesContainer";
import { XeroSyncPopup } from "../../Pages/Popup/XeroSyncPopup";

describe("10_Workflows_EditMatrix . ts", function () {

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


    it("Edit Matrix without tracking category", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_10_2g8weeM');
        let defaultNameStep = 'Approval step';
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
        xeroWorkflows.PayableWorkflows.BillClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ReviwersTabClick();
        workflowStep1.AddExistingReviwer(existingApprover2);
        workflowStep1.ReviwerMatrixClick();

        let matrix = new MatrixPopup();
        let approverLinesContainer = MatrixLinesContainer.ByName(existingApprover2);
        let approverLine = approverLinesContainer.GetFirstLine();

        let accountCell = approverLine.GetAsyncConditionCell('Account');
        accountCell.CheckTextTitle('Any Account');
        accountCell.SelectConditionType(ConditionsType.Matches);

        let accountCellDropDown = accountCell.GetMultiSelectDropDown();
        accountCellDropDown.FilterDropDown('',['200 - Sales','260 - Other Revenue','270 - Interest Income']);
        accountCellDropDown.FilterDropDown('200',['200 - Sales']);
        accountCellDropDown.FilterDropDown('Sales',['200 - Sales','820 - Sales Tax']);
        accountCellDropDown.FilterDropDown('123',['Empty']);
        accountCell.SelectConditionType(ConditionsType.DoesNotMatches);
        accountCellDropDown.FilterDropDown('',['200 - Sales','260 - Other Revenue','270 - Interest Income']);
        accountCellDropDown.FilterDropDown('21',['721 - Less Accumulated Depreciation on Computer Equipment']);
        accountCellDropDown.FilterDropDown('$%$',['Empty']);
        accountCellDropDown.FilterDropDown('404',['404 - Bank Fees']);
        accountCellDropDown.AddNewItem('404 - Bank Fees',AddAction.ByEnter,false);
        accountCell.SelectConditionType(ConditionsType.Matches);
        accountCellDropDown.FilterDropDown('',['200 - Sales','260 - Other Revenue','270 - Interest Income']);
        accountCellDropDown.FilterDropDown('970',['970 - Owner A Share Capital']);
        accountCellDropDown.AddNewItem('970 - Owner A Share Capital',AddAction.ByEnter,false);
        accountCell.SelectConditionType(ConditionsType.DoesNotMatches);
        accountCellDropDown.FilterDropDown('200',['200 - Sales']);
        accountCellDropDown.AddNewItem('200 - Sales',AddAction.ByEnter,false);
        matrix.Done();

        workflowStep1.ReviwerMatrixClick();
        accountCell.CheckSelected(['200 - Sales','404 - Bank Fees','970 - Owner A Share Capital']);
        accountCell.DeleteConditionValue('970 - Owner A Share Capital');
        accountCell.CheckSelected(['200 - Sales','404 - Bank Fees']);
        accountCell.SelectConditionValue('970 - Owner A Share Capital',['200 - Sales','404 - Bank Fees','970 - Owner A Share Capital']);
        accountCell.DeleteConditionValue('970 - Owner A Share Capital');
        accountCell.DeleteConditionValue('200 - Sales');
        accountCell.DeleteConditionValue('404 - Bank Fees');
        matrix.Done();
        accountCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();


    });
});
