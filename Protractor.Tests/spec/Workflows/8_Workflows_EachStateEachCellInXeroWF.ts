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

describe("8_Workflows_EachStateEachCellInXeroWF . ts", function () {
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

    it("Bill", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_8_2ylQbCK');

        let defaultNameStep = Page.Config.defaultStepName;
        let existingApprover2 = "Test Auto";
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

        // // ----------------Supplier cell------------------
        Common.LogNameTestPlan('Supplier cell');
        supplierCell.SelectConditionType(ConditionsType.Matches);
        let supplierCellDropDown = supplierCell.GetMultiSelectDropDown();
        supplierCellDropDown.FilterDropDown('',['TestUser']);
        supplierCellDropDown.FilterDropDown('Te',['TestUser']);
        supplierCellDropDown.FilterDropDown('123',['Empty']);
        supplierCell.SelectConditionType(ConditionsType.DoesNotMatches);
        supplierCellDropDown = supplierCell.GetMultiSelectDropDown();
        supplierCellDropDown.FilterDropDown('',['TestUser']);
        supplierCellDropDown.FilterDropDown('Te',['TestUser']);
        supplierCellDropDown.FilterDropDown('123',['Empty']);
        supplierCellDropDown.FilterDropDown('Te',['TestUser']);
        supplierCellDropDown.FilterDropDown('  1 ',['Empty']);
        taxCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        taxCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        supplierCell.SelectConditionValue('TestUser');
        supplierCell.CheckSelected(['TestUser']);
        supplierCell.SelectConditionType(ConditionsType.Matches);
        supplierCell.CheckSelected(['TestUser']);
        supplierCell.SelectConditionType(ConditionsType.Any);
        supplierCell.SelectConditionType(ConditionsType.Matches);
        supplierCell.SelectConditionValue('TestUser');
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        supplierCell.CheckSelected(['TestUser']);
        supplierCell.DeleteConditionValue('TestUser');
        matrix.Done();
        supplierCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();


        // //----------------Account cell------------------
        Common.LogNameTestPlan('Account cell');
        workflowStep1.ApproverMatrixClick();

        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Supplier');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
        accountCell.SelectConditionType(ConditionsType.Matches);
        let accountCellDropDown = accountCell.GetMultiSelectDropDown();
        accountCellDropDown.FilterDropDown('',['200 - Sales','260 - Other Revenue','270 - Interest Income']);
        accountCellDropDown.FilterDropDown('200',['200 - Sales']);
        accountCellDropDown.FilterDropDown('Sales',['200 - Sales','820 - Sales Tax']);
        accountCellDropDown.FilterDropDown('123',['Empty']);
        accountCellDropDown.FilterDropDown('Sales',['200 - Sales','820 - Sales Tax']);
        accountCell.SelectConditionType(ConditionsType.DoesNotMatches);
        accountCellDropDown.FilterDropDown('',['200 - Sales','260 - Other Revenue','270 - Interest Income']);
        accountCellDropDown.FilterDropDown('21',['721 - Less Accumulated Depreciation on Computer Equipment']);
        accountCellDropDown.FilterDropDown('$%$',['Empty']);
        accountCellDropDown.FilterDropDown('200',['200 - Sales']);
        accountCellDropDown.FilterDropDown('404',['404 - Bank Fees']);
        taxCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        taxCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        accountCell.SelectConditionValue('404 - Bank Fees',['404 - Bank Fees']);
        accountCell.SelectConditionType(ConditionsType.Matches);
        accountCell.SelectConditionValue('970 - Owner A Share Capital',['404 - Bank Fees','970 - Owner A Share Capital']);
        accountCell.SelectConditionType(ConditionsType.DoesNotMatches);
        accountCell.SelectConditionValue('200 - Sales',['404 - Bank Fees','970 - Owner A Share Capital','200 - Sales']);
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        accountCell.CheckSelected(['200 - Sales','404 - Bank Fees','970 - Owner A Share Capital']);
        matrix.Done();
        workflowCard.ActivateWorkflow();
        workflowStep1.ApproverMatrixClick();
        accountCell.CheckSelected(['200 - Sales','404 - Bank Fees','970 - Owner A Share Capital']);
        accountCell.DeleteConditionValue('970 - Owner A Share Capital',['200 - Sales','404 - Bank Fees']);
        accountCell.SelectConditionValue('970 - Owner A Share Capital',['200 - Sales','404 - Bank Fees','970 - Owner A Share Capital']);
        accountCell.DeleteConditionValue('970 - Owner A Share Capital');
        accountCell.DeleteConditionValue('404 - Bank Fees');
        accountCell.DeleteConditionValue('200 - Sales');
        matrix.Done();
        accountCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();

        // ----------------Item cell------------------
        Common.LogNameTestPlan('Item cell');
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Supplier');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');

        itemCell.SelectConditionType(ConditionsType.Matches);
        let itemCellDropDown = itemCell.GetMultiSelectDropDown();
        itemCellDropDown.FilterDropDown('',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('e',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('Test',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('123',['EmptyItem']);
        itemCell.SelectConditionType(ConditionsType.DoesNotMatches);
        itemCellDropDown.FilterDropDown('',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('e',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('Test',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('123',['EmptyItem']);
        taxCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        taxCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        itemCell.SelectConditionValue('Code_QaaAutoTest : QaaAutoTest');
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest']);
        itemCell.SelectConditionType(ConditionsType.Matches);
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('',['EmptyItem']);
        itemCell.SelectConditionValue('Empty',['Code_QaaAutoTest : QaaAutoTest','Empty']);
        itemCell.SelectConditionType(ConditionsType.DoesNotMatches);
        itemCell.SelectConditionType(ConditionsType.Matches);
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest','Empty']);
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest','Empty']);
        itemCell.DeleteConditionValue('Code_QaaAutoTest : QaaAutoTest');
        itemCell.CheckSelected(['Empty']);
        matrix.Done();
        workflowCard.UpdateWorkflow();
        workflowStep1.ApproverMatrixClick();
        itemCell.SelectConditionValue('Code_QaaAutoTest : QaaAutoTest',['Empty','Code_QaaAutoTest : QaaAutoTest',]);
        itemCell.DeleteConditionValue('Code_QaaAutoTest : QaaAutoTest');
        itemCell.DeleteConditionValue('Empty');
        matrix.Done();
        itemCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();

        // // ----------------Tax cell------------------
        Common.LogNameTestPlan('Tax cell');
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Supplier');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');

        taxCell.SelectConditionType(ConditionsType.Matches);
        let taxCellDropDown = taxCell.GetMultiSelectDropDown();
        taxCellDropDown.FilterDropDown('',['Sales Tax on Imports','Tax on Purchases','Tax Exempt','Tax on Sales']);
        taxCellDropDown.FilterDropDown('sale',['Sales Tax on Imports','Tax on Sales']);
        taxCellDropDown.FilterDropDown('123',['Empty']);
        taxCell.SelectConditionType(ConditionsType.DoesNotMatches);
        taxCellDropDown.FilterDropDown('',['Sales Tax on Imports','Tax on Purchases','Tax Exempt','Tax on Sales']);
        taxCellDropDown.FilterDropDown('sale',['Sales Tax on Imports','Tax on Sales']);
        taxCellDropDown.FilterDropDown('123',['Empty']);
        taxCellDropDown.FilterDropDown('Exempt',['Tax Exempt']);
        itemCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        itemCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        taxCell.SelectConditionValue('Tax Exempt',['Tax Exempt']);
        taxCell.SelectConditionType(ConditionsType.Matches);
        taxCellDropDown.FilterDropDown('',['Sales Tax on Imports','Tax on Purchases','Tax on Sales']);
        itemCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        itemCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        taxCell.SelectConditionValue('Tax on Purchases',['Tax Exempt','Tax on Purchases']);
        taxCell.SelectConditionType(ConditionsType.DoesNotMatches);
        taxCell.SelectConditionType(ConditionsType.Matches);
        matrix.Done();

        workflowCard.UpdateWorkflow();
        // workflowCard.ActivateWorkflow();

        workflowStep1.ApproverMatrixClick();
        browser.sleep(3500);
        taxCell.CheckSelected(['Tax Exempt','Tax on Purchases']);
        matrix.Done();
        workflowCard.UpdateWorkflow();
        workflowStep1.ApproverMatrixClick();
        taxCell.CheckSelected(['Tax Exempt','Tax on Purchases']);
        taxCell.DeleteConditionValue('Tax Exempt');
        taxCell.DeleteConditionValue('Tax on Purchases');
        matrix.Done();
        taxCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();


        // ----------------Total amount cell       Under------------------
        Common.LogNameTestPlan('Total amount cell       Under');
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Supplier');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
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
        totalAmount.CheckPreview('Under 123.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('12345',ConditionsType.Under);
        totalAmount.CheckPreview('Under 12,345.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('0000',ConditionsType.Under);
        totalAmount.CheckPreview('Under 0.00 RUB');
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
        totalAmount.CheckPreview('Under 0.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('678',ConditionsType.Under);
        totalAmount.CheckPreview('Under 678.00 RUB');
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 678.00 RUB');
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
        supplierCell.CheckTextTitle('Any Supplier');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
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
        totalAmount.CheckPreview('Over or equal to 123.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('12345',ConditionsType.OverOrEqualTo);
        totalAmount.CheckPreview('Over or equal to 12,345.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('0000',ConditionsType.OverOrEqualTo);
        totalAmount.CheckPreview('Over or equal to 0.00 RUB');
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
        totalAmount.CheckPreview('Over or equal to 0.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('678',ConditionsType.OverOrEqualTo);
        totalAmount.CheckPreview('Over or equal to 678.00 RUB');
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Over or equal to 678.00 RUB');
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
        supplierCell.CheckTextTitle('Any Supplier');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
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
        totalAmount.CheckPreview('Within 123.00 RUB-333.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('000',ConditionsType.Within);
        totalAmount.CheckPreview('Within 0.00 RUB-333.00 RUB');

        //ПОКА НЕ РАБОТАЕТ КУСОК С ТЕСТ-КЕЙСА С ПРОВЕРКОЙ ДЕСЯТИЧНЫХ
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('12345',null,Validation.Any,protractor.Key.TAB);
        totalAmount.SetValue2('100',ConditionsType.Within,Validation.NotValid,protractor.Key.TAB);
        totalAmount.CheckPreview('Within 12,345.00 RUB-100.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue2('33333',ConditionsType.Within);
        totalAmount.CheckPreview('Within 12,345.00 RUB-33,333.00 RUB');
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Within 12,345.00 RUB-33,333.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue2('22222',ConditionsType.Within);
        totalAmount.CheckPreview('Within 12,345.00 RUB-22,222.00 RUB');
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Within 12,345.00 RUB-22,222.00 RUB');

        // // НЕ ПОЛУЧАЕТСЯ ОЧИСТИТЬ ПОЛЯ
        // totalAmount.SelectConditionType(ConditionsType.Any);
        // totalAmount.SelectConditionType(ConditionsType.Within);
        // totalAmount.SetValue1('___',null,Validation.Any,protractor.Key.TAB);
        // totalAmount.SetValue2(' ',null,Validation.Any,protractor.Key.TAB);
        // matrix.Done();


        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue2('7',null,Validation.NotValid);
        totalAmount.CheckPreview('Within 12,345.00 RUB-7.00 RUB');
        matrix.Done();
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('99',null,Validation.NotValid);
        totalAmount.CheckPreview('Within 99.00 RUB-7.00 RUB');
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

    it("Ap Credit Note", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_8_2ylQbCK');

        let defaultNameStep = Page.Config.defaultStepName;
        let existingApprover2 = "Test Auto";
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        let settingCompany = new CompanySetting();
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);
        xeroWorkflows.PayableWorkflows.ApCreditNoteClick();

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

        // // ----------------Supplier cell------------------
        Common.LogNameTestPlan('Supplier cell');
        supplierCell.SelectConditionType(ConditionsType.Matches);
        let supplierCellDropDown = supplierCell.GetMultiSelectDropDown();
        supplierCellDropDown.FilterDropDown('',['TestUser']);
        supplierCellDropDown.FilterDropDown('Te',['TestUser']);
        supplierCellDropDown.FilterDropDown('123',['Empty']);
        supplierCell.SelectConditionType(ConditionsType.DoesNotMatches);
        supplierCellDropDown = supplierCell.GetMultiSelectDropDown();
        supplierCellDropDown.FilterDropDown('',['TestUser']);
        supplierCellDropDown.FilterDropDown('Te',['TestUser']);
        supplierCellDropDown.FilterDropDown('123',['Empty']);
        supplierCellDropDown.FilterDropDown('Te',['TestUser']);
        supplierCellDropDown.FilterDropDown('  1 ',['Empty']);
        taxCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        taxCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        supplierCell.SelectConditionValue('TestUser');
        supplierCell.CheckSelected(['TestUser']);
        supplierCell.SelectConditionType(ConditionsType.Matches);
        supplierCell.CheckSelected(['TestUser']);
        supplierCell.SelectConditionType(ConditionsType.Any);
        supplierCell.SelectConditionType(ConditionsType.Matches);
        supplierCell.SelectConditionValue('TestUser');
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        supplierCell.CheckSelected(['TestUser']);
        supplierCell.DeleteConditionValue('TestUser');
        matrix.Done();
        supplierCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();


        // //----------------Account cell------------------
        Common.LogNameTestPlan('Account cell');
        workflowStep1.ApproverMatrixClick();

        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Supplier');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
        accountCell.SelectConditionType(ConditionsType.Matches);
        let accountCellDropDown = accountCell.GetMultiSelectDropDown();
        accountCellDropDown.FilterDropDown('',['200 - Sales','260 - Other Revenue','270 - Interest Income']);
        accountCellDropDown.FilterDropDown('200',['200 - Sales']);
        accountCellDropDown.FilterDropDown('Sales',['200 - Sales','820 - Sales Tax']);
        accountCellDropDown.FilterDropDown('123',['Empty']);
        accountCellDropDown.FilterDropDown('Sales',['200 - Sales','820 - Sales Tax']);
        accountCell.SelectConditionType(ConditionsType.DoesNotMatches);
        accountCellDropDown.FilterDropDown('',['200 - Sales','260 - Other Revenue','270 - Interest Income']);
        accountCellDropDown.FilterDropDown('21',['721 - Less Accumulated Depreciation on Computer Equipment']);
        accountCellDropDown.FilterDropDown('$%$',['Empty']);
        accountCellDropDown.FilterDropDown('200',['200 - Sales']);
        accountCellDropDown.FilterDropDown('404',['404 - Bank Fees']);
        taxCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        taxCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        accountCell.SelectConditionValue('404 - Bank Fees',['404 - Bank Fees']);
        accountCell.SelectConditionType(ConditionsType.Matches);
        accountCell.SelectConditionValue('970 - Owner A Share Capital',['404 - Bank Fees','970 - Owner A Share Capital']);
        accountCell.SelectConditionType(ConditionsType.DoesNotMatches);
        accountCell.SelectConditionValue('200 - Sales',['404 - Bank Fees','970 - Owner A Share Capital','200 - Sales']);
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        accountCell.CheckSelected(['200 - Sales','404 - Bank Fees','970 - Owner A Share Capital']);
        matrix.Done();
        workflowCard.ActivateWorkflow();
        workflowStep1.ApproverMatrixClick();
        accountCell.CheckSelected(['200 - Sales','404 - Bank Fees','970 - Owner A Share Capital']);
        accountCell.DeleteConditionValue('970 - Owner A Share Capital',['200 - Sales','404 - Bank Fees']);
        accountCell.SelectConditionValue('970 - Owner A Share Capital',['200 - Sales','404 - Bank Fees','970 - Owner A Share Capital']);
        accountCell.DeleteConditionValue('970 - Owner A Share Capital');
        accountCell.DeleteConditionValue('404 - Bank Fees');
        accountCell.DeleteConditionValue('200 - Sales');
        matrix.Done();
        accountCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();

        // ----------------Item cell------------------
        Common.LogNameTestPlan('Item cell');
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Supplier');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');

        itemCell.SelectConditionType(ConditionsType.Matches);
        let itemCellDropDown = itemCell.GetMultiSelectDropDown();
        itemCellDropDown.FilterDropDown('',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('e',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('Test',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('123',['EmptyItem']);
        itemCell.SelectConditionType(ConditionsType.DoesNotMatches);
        itemCellDropDown.FilterDropDown('',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('e',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('Test',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('123',['EmptyItem']);
        taxCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        taxCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        itemCell.SelectConditionValue('Code_QaaAutoTest : QaaAutoTest');
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest']);
        itemCell.SelectConditionType(ConditionsType.Matches);
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('',['EmptyItem']);
        itemCell.SelectConditionValue('Empty',['Code_QaaAutoTest : QaaAutoTest','Empty']);
        itemCell.SelectConditionType(ConditionsType.DoesNotMatches);
        itemCell.SelectConditionType(ConditionsType.Matches);
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest','Empty']);
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest','Empty']);
        itemCell.DeleteConditionValue('Code_QaaAutoTest : QaaAutoTest');
        itemCell.CheckSelected(['Empty']);
        matrix.Done();
        workflowCard.UpdateWorkflow();
        workflowStep1.ApproverMatrixClick();
        itemCell.SelectConditionValue('Code_QaaAutoTest : QaaAutoTest',['Empty','Code_QaaAutoTest : QaaAutoTest',]);
        itemCell.DeleteConditionValue('Code_QaaAutoTest : QaaAutoTest');
        itemCell.DeleteConditionValue('Empty');
        matrix.Done();
        itemCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();

        // // ----------------Tax cell------------------
        Common.LogNameTestPlan('Tax cell');
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Supplier');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');

        taxCell.SelectConditionType(ConditionsType.Matches);
        let taxCellDropDown = taxCell.GetMultiSelectDropDown();
        taxCellDropDown.FilterDropDown('',['Sales Tax on Imports','Tax on Purchases','Tax Exempt','Tax on Sales']);
        taxCellDropDown.FilterDropDown('sale',['Sales Tax on Imports','Tax on Sales']);
        taxCellDropDown.FilterDropDown('123',['Empty']);
        taxCell.SelectConditionType(ConditionsType.DoesNotMatches);
        taxCellDropDown.FilterDropDown('',['Sales Tax on Imports','Tax on Purchases','Tax Exempt','Tax on Sales']);
        taxCellDropDown.FilterDropDown('sale',['Sales Tax on Imports','Tax on Sales']);
        taxCellDropDown.FilterDropDown('123',['Empty']);
        taxCellDropDown.FilterDropDown('Exempt',['Tax Exempt']);
        itemCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        itemCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        taxCell.SelectConditionValue('Tax Exempt',['Tax Exempt']);
        taxCell.SelectConditionType(ConditionsType.Matches);
        taxCellDropDown.FilterDropDown('',['Sales Tax on Imports','Tax on Purchases','Tax on Sales']);
        itemCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        itemCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        taxCell.SelectConditionValue('Tax on Purchases',['Tax Exempt','Tax on Purchases']);
        taxCell.SelectConditionType(ConditionsType.DoesNotMatches);
        taxCell.SelectConditionType(ConditionsType.Matches);
        matrix.Done();

        workflowCard.UpdateWorkflow();
        // workflowCard.ActivateWorkflow();

        workflowStep1.ApproverMatrixClick();
        browser.sleep(3500);
        taxCell.CheckSelected(['Tax Exempt','Tax on Purchases']);
        matrix.Done();
        workflowCard.UpdateWorkflow();
        workflowStep1.ApproverMatrixClick();
        taxCell.CheckSelected(['Tax Exempt','Tax on Purchases']);
        taxCell.DeleteConditionValue('Tax Exempt');
        taxCell.DeleteConditionValue('Tax on Purchases');
        matrix.Done();
        taxCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();


        // ----------------Total amount cell       Under------------------
        Common.LogNameTestPlan('Total amount cell       Under');
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Supplier');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
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
        totalAmount.CheckPreview('Under 123.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('12345',ConditionsType.Under);
        totalAmount.CheckPreview('Under 12,345.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('0000',ConditionsType.Under);
        totalAmount.CheckPreview('Under 0.00 RUB');
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
        totalAmount.CheckPreview('Under 0.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('678',ConditionsType.Under);
        totalAmount.CheckPreview('Under 678.00 RUB');
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 678.00 RUB');
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
        supplierCell.CheckTextTitle('Any Supplier');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
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
        totalAmount.CheckPreview('Over or equal to 123.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('12345',ConditionsType.OverOrEqualTo);
        totalAmount.CheckPreview('Over or equal to 12,345.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('0000',ConditionsType.OverOrEqualTo);
        totalAmount.CheckPreview('Over or equal to 0.00 RUB');
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
        totalAmount.CheckPreview('Over or equal to 0.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('678',ConditionsType.OverOrEqualTo);
        totalAmount.CheckPreview('Over or equal to 678.00 RUB');
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Over or equal to 678.00 RUB');
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
        supplierCell.CheckTextTitle('Any Supplier');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
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
        totalAmount.CheckPreview('Within 123.00 RUB-333.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('000',ConditionsType.Within);
        totalAmount.CheckPreview('Within 0.00 RUB-333.00 RUB');

        //ПОКА НЕ РАБОТАЕТ КУСОК С ТЕСТ-КЕЙСА С ПРОВЕРКОЙ ДЕСЯТИЧНЫХ
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('12345',null,Validation.Any,protractor.Key.TAB);
        totalAmount.SetValue2('100',ConditionsType.Within,Validation.NotValid,protractor.Key.TAB);
        totalAmount.CheckPreview('Within 12,345.00 RUB-100.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue2('33333',ConditionsType.Within);
        totalAmount.CheckPreview('Within 12,345.00 RUB-33,333.00 RUB');
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Within 12,345.00 RUB-33,333.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue2('22222',ConditionsType.Within);
        totalAmount.CheckPreview('Within 12,345.00 RUB-22,222.00 RUB');
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Within 12,345.00 RUB-22,222.00 RUB');

        // // НЕ ПОЛУЧАЕТСЯ ОЧИСТИТЬ ПОЛЯ
        // totalAmount.SelectConditionType(ConditionsType.Any);
        // totalAmount.SelectConditionType(ConditionsType.Within);
        // totalAmount.SetValue1('___',null,Validation.Any,protractor.Key.TAB);
        // totalAmount.SetValue2(' ',null,Validation.Any,protractor.Key.TAB);
        // matrix.Done();


        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue2('7',null,Validation.NotValid);
        totalAmount.CheckPreview('Within 12,345.00 RUB-7.00 RUB');
        matrix.Done();
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('99',null,Validation.NotValid);
        totalAmount.CheckPreview('Within 99.00 RUB-7.00 RUB');
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

    it("Sales Invoice", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_8_2ylQbCK');

        let defaultNameStep = Page.Config.defaultStepName;
        let existingApprover2 = "Test Auto";
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        let settingCompany = new CompanySetting();
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);
        xeroWorkflows.ReceivableWorkflows.SalesInvoiceClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();

        let matrix = new MatrixPopup();
        let approverLinesContainer = MatrixLinesContainer.ByName(existingApprover2);
        let approverLine = approverLinesContainer.GetFirstLine();

        let totalAmount = approverLine.GetAmountConditionCell();
        totalAmount.CheckPreview('Any amount');

        let supplierCell = approverLine.GetAsyncConditionCell('Customer');
        supplierCell.CheckTextTitle('Any Customer');

        let accountCell = approverLine.GetAsyncConditionCell('Account');
        accountCell.CheckTextTitle('Any Account');

        let itemCell = approverLine.GetAsyncConditionCell('Item');
        itemCell.CheckTextTitle('Any Item');

        let taxCell = approverLine.GetAsyncConditionCell('Tax');
        taxCell.CheckTextTitle('Any Tax');

        // // ----------------Supplier cell------------------
        Common.LogNameTestPlan('Supplier cell');
        supplierCell.SelectConditionType(ConditionsType.Matches);
        let supplierCellDropDown = supplierCell.GetMultiSelectDropDown();
        supplierCellDropDown.FilterDropDown('',['TestUser']);
        supplierCellDropDown.FilterDropDown('Te',['TestUser']);
        supplierCellDropDown.FilterDropDown('123',['Empty']);
        supplierCell.SelectConditionType(ConditionsType.DoesNotMatches);
        supplierCellDropDown = supplierCell.GetMultiSelectDropDown();
        supplierCellDropDown.FilterDropDown('',['TestUser']);
        supplierCellDropDown.FilterDropDown('Te',['TestUser']);
        supplierCellDropDown.FilterDropDown('123',['Empty']);
        supplierCellDropDown.FilterDropDown('Te',['TestUser']);
        supplierCellDropDown.FilterDropDown('  1 ',['Empty']);
        taxCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        taxCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        supplierCell.SelectConditionValue('TestUser');
        supplierCell.CheckSelected(['TestUser']);
        supplierCell.SelectConditionType(ConditionsType.Matches);
        supplierCell.CheckSelected(['TestUser']);
        supplierCell.SelectConditionType(ConditionsType.Any);
        supplierCell.SelectConditionType(ConditionsType.Matches);
        supplierCell.SelectConditionValue('TestUser');
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        supplierCell.CheckSelected(['TestUser']);
        supplierCell.DeleteConditionValue('TestUser');
        matrix.Done();
        supplierCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();


        // //----------------Account cell------------------
        Common.LogNameTestPlan('Account cell');
        workflowStep1.ApproverMatrixClick();

        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Customer');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
        accountCell.SelectConditionType(ConditionsType.Matches);
        let accountCellDropDown = accountCell.GetMultiSelectDropDown();
        accountCellDropDown.FilterDropDown('',['200 - Sales','260 - Other Revenue','270 - Interest Income']);
        accountCellDropDown.FilterDropDown('200',['200 - Sales']);
        accountCellDropDown.FilterDropDown('Sales',['200 - Sales','820 - Sales Tax']);
        accountCellDropDown.FilterDropDown('123',['Empty']);
        accountCellDropDown.FilterDropDown('Sales',['200 - Sales','820 - Sales Tax']);
        accountCell.SelectConditionType(ConditionsType.DoesNotMatches);
        accountCellDropDown.FilterDropDown('',['200 - Sales','260 - Other Revenue','270 - Interest Income']);
        accountCellDropDown.FilterDropDown('21',['721 - Less Accumulated Depreciation on Computer Equipment']);
        accountCellDropDown.FilterDropDown('$%$',['Empty']);
        accountCellDropDown.FilterDropDown('200',['200 - Sales']);
        accountCellDropDown.FilterDropDown('404',['404 - Bank Fees']);
        taxCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        taxCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        accountCell.SelectConditionValue('404 - Bank Fees',['404 - Bank Fees']);
        accountCell.SelectConditionType(ConditionsType.Matches);
        accountCell.SelectConditionValue('970 - Owner A Share Capital',['404 - Bank Fees','970 - Owner A Share Capital']);
        accountCell.SelectConditionType(ConditionsType.DoesNotMatches);
        accountCell.SelectConditionValue('200 - Sales',['404 - Bank Fees','970 - Owner A Share Capital','200 - Sales']);
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        accountCell.CheckSelected(['200 - Sales','404 - Bank Fees','970 - Owner A Share Capital']);
        matrix.Done();
        workflowCard.ActivateWorkflow();
        workflowStep1.ApproverMatrixClick();
        accountCell.CheckSelected(['200 - Sales','404 - Bank Fees','970 - Owner A Share Capital']);
        accountCell.DeleteConditionValue('970 - Owner A Share Capital',['200 - Sales','404 - Bank Fees']);
        accountCell.SelectConditionValue('970 - Owner A Share Capital',['200 - Sales','404 - Bank Fees','970 - Owner A Share Capital']);
        accountCell.DeleteConditionValue('970 - Owner A Share Capital');
        accountCell.DeleteConditionValue('404 - Bank Fees');
        accountCell.DeleteConditionValue('200 - Sales');
        matrix.Done();
        accountCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();

        // ----------------Item cell------------------
        Common.LogNameTestPlan('Item cell');
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Customer');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');

        itemCell.SelectConditionType(ConditionsType.Matches);
        let itemCellDropDown = itemCell.GetMultiSelectDropDown();
        itemCellDropDown.FilterDropDown('',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('e',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('Test',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('123',['EmptyItem']);
        itemCell.SelectConditionType(ConditionsType.DoesNotMatches);
        itemCellDropDown.FilterDropDown('',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('e',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('Test',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('123',['EmptyItem']);
        taxCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        taxCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        itemCell.SelectConditionValue('Code_QaaAutoTest : QaaAutoTest');
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest']);
        itemCell.SelectConditionType(ConditionsType.Matches);
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('',['EmptyItem']);
        itemCell.SelectConditionValue('Empty',['Code_QaaAutoTest : QaaAutoTest','Empty']);
        itemCell.SelectConditionType(ConditionsType.DoesNotMatches);
        itemCell.SelectConditionType(ConditionsType.Matches);
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest','Empty']);
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest','Empty']);
        itemCell.DeleteConditionValue('Code_QaaAutoTest : QaaAutoTest');
        itemCell.CheckSelected(['Empty']);
        matrix.Done();
        workflowCard.UpdateWorkflow();
        workflowStep1.ApproverMatrixClick();
        itemCell.SelectConditionValue('Code_QaaAutoTest : QaaAutoTest',['Empty','Code_QaaAutoTest : QaaAutoTest',]);
        itemCell.DeleteConditionValue('Code_QaaAutoTest : QaaAutoTest');
        itemCell.DeleteConditionValue('Empty');
        matrix.Done();
        itemCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();

        // // ----------------Tax cell------------------
        Common.LogNameTestPlan('Tax cell');
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Customer');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');

        taxCell.SelectConditionType(ConditionsType.Matches);
        let taxCellDropDown = taxCell.GetMultiSelectDropDown();
        taxCellDropDown.FilterDropDown('',['Sales Tax on Imports','Tax on Purchases','Tax Exempt','Tax on Sales']);
        taxCellDropDown.FilterDropDown('sale',['Sales Tax on Imports','Tax on Sales']);
        taxCellDropDown.FilterDropDown('123',['Empty']);
        taxCell.SelectConditionType(ConditionsType.DoesNotMatches);
        taxCellDropDown.FilterDropDown('',['Sales Tax on Imports','Tax on Purchases','Tax Exempt','Tax on Sales']);
        taxCellDropDown.FilterDropDown('sale',['Sales Tax on Imports','Tax on Sales']);
        taxCellDropDown.FilterDropDown('123',['Empty']);
        taxCellDropDown.FilterDropDown('Exempt',['Tax Exempt']);
        itemCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        itemCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        taxCell.SelectConditionValue('Tax Exempt',['Tax Exempt']);
        taxCell.SelectConditionType(ConditionsType.Matches);
        taxCellDropDown.FilterDropDown('',['Sales Tax on Imports','Tax on Purchases','Tax on Sales']);
        itemCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        itemCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        taxCell.SelectConditionValue('Tax on Purchases',['Tax Exempt','Tax on Purchases']);
        taxCell.SelectConditionType(ConditionsType.DoesNotMatches);
        taxCell.SelectConditionType(ConditionsType.Matches);
        matrix.Done();

        workflowCard.UpdateWorkflow();
        // workflowCard.ActivateWorkflow();

        workflowStep1.ApproverMatrixClick();
        browser.sleep(3500);
        taxCell.CheckSelected(['Tax Exempt','Tax on Purchases']);
        matrix.Done();
        workflowCard.UpdateWorkflow();
        workflowStep1.ApproverMatrixClick();
        taxCell.CheckSelected(['Tax Exempt','Tax on Purchases']);
        taxCell.DeleteConditionValue('Tax Exempt');
        taxCell.DeleteConditionValue('Tax on Purchases');
        matrix.Done();
        taxCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();


        // ----------------Total amount cell       Under------------------
        Common.LogNameTestPlan('Total amount cell       Under');
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Customer');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
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
        totalAmount.CheckPreview('Under 123.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('12345',ConditionsType.Under);
        totalAmount.CheckPreview('Under 12,345.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('0000',ConditionsType.Under);
        totalAmount.CheckPreview('Under 0.00 RUB');
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
        totalAmount.CheckPreview('Under 0.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('678',ConditionsType.Under);
        totalAmount.CheckPreview('Under 678.00 RUB');
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 678.00 RUB');
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
        supplierCell.CheckTextTitle('Any Customer');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
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
        totalAmount.CheckPreview('Over or equal to 123.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('12345',ConditionsType.OverOrEqualTo);
        totalAmount.CheckPreview('Over or equal to 12,345.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('0000',ConditionsType.OverOrEqualTo);
        totalAmount.CheckPreview('Over or equal to 0.00 RUB');
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
        totalAmount.CheckPreview('Over or equal to 0.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('678',ConditionsType.OverOrEqualTo);
        totalAmount.CheckPreview('Over or equal to 678.00 RUB');
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Over or equal to 678.00 RUB');
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
        supplierCell.CheckTextTitle('Any Customer');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
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
        totalAmount.CheckPreview('Within 123.00 RUB-333.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('000',ConditionsType.Within);
        totalAmount.CheckPreview('Within 0.00 RUB-333.00 RUB');

        //ПОКА НЕ РАБОТАЕТ КУСОК С ТЕСТ-КЕЙСА С ПРОВЕРКОЙ ДЕСЯТИЧНЫХ
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('12345',null,Validation.Any,protractor.Key.TAB);
        totalAmount.SetValue2('100',ConditionsType.Within,Validation.NotValid,protractor.Key.TAB);
        totalAmount.CheckPreview('Within 12,345.00 RUB-100.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue2('33333',ConditionsType.Within);
        totalAmount.CheckPreview('Within 12,345.00 RUB-33,333.00 RUB');
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Within 12,345.00 RUB-33,333.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue2('22222',ConditionsType.Within);
        totalAmount.CheckPreview('Within 12,345.00 RUB-22,222.00 RUB');
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Within 12,345.00 RUB-22,222.00 RUB');

        // // НЕ ПОЛУЧАЕТСЯ ОЧИСТИТЬ ПОЛЯ
        // totalAmount.SelectConditionType(ConditionsType.Any);
        // totalAmount.SelectConditionType(ConditionsType.Within);
        // totalAmount.SetValue1('___',null,Validation.Any,protractor.Key.TAB);
        // totalAmount.SetValue2(' ',null,Validation.Any,protractor.Key.TAB);
        // matrix.Done();


        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue2('7',null,Validation.NotValid);
        totalAmount.CheckPreview('Within 12,345.00 RUB-7.00 RUB');
        matrix.Done();
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('99',null,Validation.NotValid);
        totalAmount.CheckPreview('Within 99.00 RUB-7.00 RUB');
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

    it("AR Credit Note", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_8_2ylQbCK');

        let defaultNameStep = Page.Config.defaultStepName;
        let existingApprover2 = "Test Auto";
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        let settingCompany = new CompanySetting();
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);
        xeroWorkflows.ReceivableWorkflows.ARCreditNoteClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.AddExistingApprover(existingApprover2, [existingApprover2]);
        workflowStep1.ApproverMatrixClick();

        let matrix = new MatrixPopup();
        let approverLinesContainer = MatrixLinesContainer.ByName(existingApprover2);
        let approverLine = approverLinesContainer.GetFirstLine();

        let totalAmount = approverLine.GetAmountConditionCell();
        totalAmount.CheckPreview('Any amount');

        let supplierCell = approverLine.GetAsyncConditionCell('Customer');
        supplierCell.CheckTextTitle('Any Customer');

        let accountCell = approverLine.GetAsyncConditionCell('Account');
        accountCell.CheckTextTitle('Any Account');

        let itemCell = approverLine.GetAsyncConditionCell('Item');
        itemCell.CheckTextTitle('Any Item');

        let taxCell = approverLine.GetAsyncConditionCell('Tax');
        taxCell.CheckTextTitle('Any Tax');

        // // ----------------Supplier cell------------------
        Common.LogNameTestPlan('Supplier cell');
        supplierCell.SelectConditionType(ConditionsType.Matches);
        let supplierCellDropDown = supplierCell.GetMultiSelectDropDown();
        supplierCellDropDown.FilterDropDown('',['TestUser']);
        supplierCellDropDown.FilterDropDown('Te',['TestUser']);
        supplierCellDropDown.FilterDropDown('123',['Empty']);
        supplierCell.SelectConditionType(ConditionsType.DoesNotMatches);
        supplierCellDropDown = supplierCell.GetMultiSelectDropDown();
        supplierCellDropDown.FilterDropDown('',['TestUser']);
        supplierCellDropDown.FilterDropDown('Te',['TestUser']);
        supplierCellDropDown.FilterDropDown('123',['Empty']);
        supplierCellDropDown.FilterDropDown('Te',['TestUser']);
        supplierCellDropDown.FilterDropDown('  1 ',['Empty']);
        taxCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        taxCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        supplierCell.SelectConditionValue('TestUser');
        supplierCell.CheckSelected(['TestUser']);
        supplierCell.SelectConditionType(ConditionsType.Matches);
        supplierCell.CheckSelected(['TestUser']);
        supplierCell.SelectConditionType(ConditionsType.Any);
        supplierCell.SelectConditionType(ConditionsType.Matches);
        supplierCell.SelectConditionValue('TestUser');
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        supplierCell.CheckSelected(['TestUser']);
        supplierCell.DeleteConditionValue('TestUser');
        matrix.Done();
        supplierCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();


        // //----------------Account cell------------------
        Common.LogNameTestPlan('Account cell');
        workflowStep1.ApproverMatrixClick();

        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Customer');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
        accountCell.SelectConditionType(ConditionsType.Matches);
        let accountCellDropDown = accountCell.GetMultiSelectDropDown();
        accountCellDropDown.FilterDropDown('',['200 - Sales','260 - Other Revenue','270 - Interest Income']);
        accountCellDropDown.FilterDropDown('200',['200 - Sales']);
        accountCellDropDown.FilterDropDown('Sales',['200 - Sales','820 - Sales Tax']);
        accountCellDropDown.FilterDropDown('123',['Empty']);
        accountCellDropDown.FilterDropDown('Sales',['200 - Sales','820 - Sales Tax']);
        accountCell.SelectConditionType(ConditionsType.DoesNotMatches);
        accountCellDropDown.FilterDropDown('',['200 - Sales','260 - Other Revenue','270 - Interest Income']);
        accountCellDropDown.FilterDropDown('21',['721 - Less Accumulated Depreciation on Computer Equipment']);
        accountCellDropDown.FilterDropDown('$%$',['Empty']);
        accountCellDropDown.FilterDropDown('200',['200 - Sales']);
        accountCellDropDown.FilterDropDown('404',['404 - Bank Fees']);
        taxCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        taxCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        accountCell.SelectConditionValue('404 - Bank Fees',['404 - Bank Fees']);
        accountCell.SelectConditionType(ConditionsType.Matches);
        accountCell.SelectConditionValue('970 - Owner A Share Capital',['404 - Bank Fees','970 - Owner A Share Capital']);
        accountCell.SelectConditionType(ConditionsType.DoesNotMatches);
        accountCell.SelectConditionValue('200 - Sales',['404 - Bank Fees','970 - Owner A Share Capital','200 - Sales']);
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        accountCell.CheckSelected(['200 - Sales','404 - Bank Fees','970 - Owner A Share Capital']);
        matrix.Done();
        workflowCard.ActivateWorkflow();
        workflowStep1.ApproverMatrixClick();
        accountCell.CheckSelected(['200 - Sales','404 - Bank Fees','970 - Owner A Share Capital']);
        accountCell.DeleteConditionValue('970 - Owner A Share Capital',['200 - Sales','404 - Bank Fees']);
        accountCell.SelectConditionValue('970 - Owner A Share Capital',['200 - Sales','404 - Bank Fees','970 - Owner A Share Capital']);
        accountCell.DeleteConditionValue('970 - Owner A Share Capital');
        accountCell.DeleteConditionValue('404 - Bank Fees');
        accountCell.DeleteConditionValue('200 - Sales');
        matrix.Done();
        accountCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();

        // ----------------Item cell------------------
        Common.LogNameTestPlan('Item cell');
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Customer');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');

        itemCell.SelectConditionType(ConditionsType.Matches);
        let itemCellDropDown = itemCell.GetMultiSelectDropDown();
        itemCellDropDown.FilterDropDown('',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('e',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('Test',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('123',['EmptyItem']);
        itemCell.SelectConditionType(ConditionsType.DoesNotMatches);
        itemCellDropDown.FilterDropDown('',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('e',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('Test',['EmptyItem','Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('123',['EmptyItem']);
        taxCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        taxCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        itemCell.SelectConditionValue('Code_QaaAutoTest : QaaAutoTest');
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest']);
        itemCell.SelectConditionType(ConditionsType.Matches);
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest']);
        itemCellDropDown.FilterDropDown('',['EmptyItem']);
        itemCell.SelectConditionValue('Empty',['Code_QaaAutoTest : QaaAutoTest','Empty']);
        itemCell.SelectConditionType(ConditionsType.DoesNotMatches);
        itemCell.SelectConditionType(ConditionsType.Matches);
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest','Empty']);
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        itemCell.CheckSelected(['Code_QaaAutoTest : QaaAutoTest','Empty']);
        itemCell.DeleteConditionValue('Code_QaaAutoTest : QaaAutoTest');
        itemCell.CheckSelected(['Empty']);
        matrix.Done();
        workflowCard.UpdateWorkflow();
        workflowStep1.ApproverMatrixClick();
        itemCell.SelectConditionValue('Code_QaaAutoTest : QaaAutoTest',['Empty','Code_QaaAutoTest : QaaAutoTest',]);
        itemCell.DeleteConditionValue('Code_QaaAutoTest : QaaAutoTest');
        itemCell.DeleteConditionValue('Empty');
        matrix.Done();
        itemCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();

        // // ----------------Tax cell------------------
        Common.LogNameTestPlan('Tax cell');
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Customer');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');

        taxCell.SelectConditionType(ConditionsType.Matches);
        let taxCellDropDown = taxCell.GetMultiSelectDropDown();
        taxCellDropDown.FilterDropDown('',['Sales Tax on Imports','Tax on Purchases','Tax Exempt','Tax on Sales']);
        taxCellDropDown.FilterDropDown('sale',['Sales Tax on Imports','Tax on Sales']);
        taxCellDropDown.FilterDropDown('123',['Empty']);
        taxCell.SelectConditionType(ConditionsType.DoesNotMatches);
        taxCellDropDown.FilterDropDown('',['Sales Tax on Imports','Tax on Purchases','Tax Exempt','Tax on Sales']);
        taxCellDropDown.FilterDropDown('sale',['Sales Tax on Imports','Tax on Sales']);
        taxCellDropDown.FilterDropDown('123',['Empty']);
        taxCellDropDown.FilterDropDown('Exempt',['Tax Exempt']);
        itemCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        itemCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        taxCell.SelectConditionValue('Tax Exempt',['Tax Exempt']);
        taxCell.SelectConditionType(ConditionsType.Matches);
        taxCellDropDown.FilterDropDown('',['Sales Tax on Imports','Tax on Purchases','Tax on Sales']);
        itemCell.SelectConditionType(ConditionsType.Matches); // чтобы уйти с поля ячейки
        itemCell.SelectConditionType(ConditionsType.Any); // чтобы уйти с поля ячейки
        taxCell.SelectConditionValue('Tax on Purchases',['Tax Exempt','Tax on Purchases']);
        taxCell.SelectConditionType(ConditionsType.DoesNotMatches);
        taxCell.SelectConditionType(ConditionsType.Matches);
        matrix.Done();

        workflowCard.UpdateWorkflow();
        // workflowCard.ActivateWorkflow();

        workflowStep1.ApproverMatrixClick();
        browser.sleep(3500);
        taxCell.CheckSelected(['Tax Exempt','Tax on Purchases']);
        matrix.Done();
        workflowCard.UpdateWorkflow();
        workflowStep1.ApproverMatrixClick();
        taxCell.CheckSelected(['Tax Exempt','Tax on Purchases']);
        taxCell.DeleteConditionValue('Tax Exempt');
        taxCell.DeleteConditionValue('Tax on Purchases');
        matrix.Done();
        taxCell.SelectConditionType(ConditionsType.Any);
        matrix.Done();


        // ----------------Total amount cell       Under------------------
        Common.LogNameTestPlan('Total amount cell       Under');
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Any amount');
        supplierCell.CheckTextTitle('Any Customer');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
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
        totalAmount.CheckPreview('Under 123.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('12345',ConditionsType.Under);
        totalAmount.CheckPreview('Under 12,345.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('0000',ConditionsType.Under);
        totalAmount.CheckPreview('Under 0.00 RUB');
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
        totalAmount.CheckPreview('Under 0.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Under);
        totalAmount.SetValue1('678',ConditionsType.Under);
        totalAmount.CheckPreview('Under 678.00 RUB');
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Under 678.00 RUB');
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
        supplierCell.CheckTextTitle('Any Customer');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
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
        totalAmount.CheckPreview('Over or equal to 123.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('12345',ConditionsType.OverOrEqualTo);
        totalAmount.CheckPreview('Over or equal to 12,345.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('0000',ConditionsType.OverOrEqualTo);
        totalAmount.CheckPreview('Over or equal to 0.00 RUB');
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
        totalAmount.CheckPreview('Over or equal to 0.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.OverOrEqualTo);
        totalAmount.SetValue1('678',ConditionsType.OverOrEqualTo);
        totalAmount.CheckPreview('Over or equal to 678.00 RUB');
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Over or equal to 678.00 RUB');
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
        supplierCell.CheckTextTitle('Any Customer');
        accountCell.CheckTextTitle('Any Account');
        itemCell.CheckTextTitle('Any Item');
        taxCell.CheckTextTitle('Any Tax');
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
        totalAmount.CheckPreview('Within 123.00 RUB-333.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('000',ConditionsType.Within);
        totalAmount.CheckPreview('Within 0.00 RUB-333.00 RUB');

        //ПОКА НЕ РАБОТАЕТ КУСОК С ТЕСТ-КЕЙСА С ПРОВЕРКОЙ ДЕСЯТИЧНЫХ
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('12345',null,Validation.Any,protractor.Key.TAB);
        totalAmount.SetValue2('100',ConditionsType.Within,Validation.NotValid,protractor.Key.TAB);
        totalAmount.CheckPreview('Within 12,345.00 RUB-100.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue2('33333',ConditionsType.Within);
        totalAmount.CheckPreview('Within 12,345.00 RUB-33,333.00 RUB');
        matrix.Done();
        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Within 12,345.00 RUB-33,333.00 RUB');
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue2('22222',ConditionsType.Within);
        totalAmount.CheckPreview('Within 12,345.00 RUB-22,222.00 RUB');
        matrix.Done();

        // workflowCard.ActivateWorkflow();
        workflowCard.UpdateWorkflow();

        workflowStep1.ApproverMatrixClick();
        totalAmount.CheckPreview('Within 12,345.00 RUB-22,222.00 RUB');

        // // НЕ ПОЛУЧАЕТСЯ ОЧИСТИТЬ ПОЛЯ
        // totalAmount.SelectConditionType(ConditionsType.Any);
        // totalAmount.SelectConditionType(ConditionsType.Within);
        // totalAmount.SetValue1('___',null,Validation.Any,protractor.Key.TAB);
        // totalAmount.SetValue2(' ',null,Validation.Any,protractor.Key.TAB);
        // matrix.Done();


        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue2('7',null,Validation.NotValid);
        totalAmount.CheckPreview('Within 12,345.00 RUB-7.00 RUB');
        matrix.Done();
        totalAmount.SelectConditionType(ConditionsType.Any);
        totalAmount.SelectConditionType(ConditionsType.Within);
        totalAmount.SetValue1('99',null,Validation.NotValid);
        totalAmount.CheckPreview('Within 99.00 RUB-7.00 RUB');
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
