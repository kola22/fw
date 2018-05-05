import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { MainPage } from "../../Pages/MainPage";
import { OverviewPage } from "../../Pages/OverviewPage";
import { XeroWorkflows } from "../../Pages/Forms/XeroWorkflows";
import { QbWorkflows } from "../../Pages/Forms/QbWorkflows";
import { DropDownState, Validation, DisplayState, WorkFlowType, ConditionsType, EnabledState, XeroLoginMethod } from "../../Common/Enums";
import { Common } from "../../Common/Common";
import { RandomGenerator } from "../../Common/RandomGenerator";
import { WorkflowStep } from "../../Pages/Forms/WorkflowStep";
import { CompanyMenuGroup } from "../../Pages/Controls/CompanyMenuGroup";
import { MatrixLine } from "../../Pages/Matrix/MatrixLine";
import { MatrixPopup } from "../../Pages/Matrix/MatrixPopup";
import { DurationEditor } from "../../Pages/Popup/DurationEditor";
import { XeroSyncPopup } from "../../Pages/Popup/XeroSyncPopup";
import { XeroWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { MatrixLinesContainer } from "../../Pages/Matrix/MatrixLinesContainer";
import { StandAloneWorkflowCard } from "../../Pages/Forms/WorkflowCard";
import { StandaloneWorkflows } from "../../Pages/Forms/StandaloneWorkflows";


describe("19_Workflows_NewUser  .  ts", function () {

    let companyName = "test" + RandomGenerator.generate(6);
    let defaultNameStep = Page.Config.defaultStepName;

    beforeEach(function () {
        Common.Log('BeforeEach');
        Common.Spies.Set();

        Page.Navigate.TestApp();
        LoginForm.Login(Page.Config.testUser);
        let overView = new OverviewPage();
        overView.CloseNotificationBar();
        browser.sleep(1500);
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

    it("New users Xero Bill", function () {

        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_19_2wXLkKI');

        let administratorUser = "Test Auto";
        let newUSerMail = 'test@test.com';
        let newUSerName = 'test';

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
        workflowStep1.RenameStep('step1');

        workflowStep1.AddApproverClick();
        workflowStep1.CheckDropDownItems([administratorUser]);
        workflowStep1.ReviwersTabClick();
        workflowStep1.ApproversTabClick();
        workflowStep1.AddExistingApprover(administratorUser,[administratorUser]);
        workflowStep1.AddNewApprover('XXXtest',null,DisplayState.Shown);
        workflowStep1.ReviwersTabClick();
        workflowStep1.ApproversTabClick();
        workflowStep1.AddNewApprover(newUSerMail);
        // BUG workflowStep1.DeleteApprover(newUSerMail);
        // BUG workflowStep1.AddNewApprover(newUSerMail);
        workflowStep1.ReviwersTabClick();
        workflowStep1.AddExistingReviwer(newUSerMail);
        /*Delete requester from Xero requester
         Click Choose in Xero requester
         Chosee test@test.com */
        let step2 = workflowCard.AddNewStep('22222stp');
        step2.AddExistingApprover(newUSerMail);

        // workflowCard.ActivateWorkflow(); Нужно добавить инвайнт новых юзеров
        workflowStep1.ApproversTabClick();
        workflowStep1.CheckApprovers([newUSerMail]);
        step2.CheckApprovers([newUSerMail]);
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();

        let user3mail = '111@zzz.tt';
        let user3name = '111';
        matrix.AddNewUser(user3mail);
        matrix.Done();
        step2.AddApproverClick();
        // step2.CheckDropDownItems([administratorUser,user3name]);

        step2.CheckDropDownItems([administratorUser,user3mail]);

        workflowStep1.ReviwersTabClick();
        workflowStep1.ReviwerMatrixClick();
        let user4 = 'qwqwqwqw4qwqw@mail.ru';
        matrix = new MatrixPopup();
        browser.sleep(2000);
        matrix.AddNewUser(user4);
        let matrixLine = MatrixLinesContainer.GetFirstLineById(user4);

        matrix.Done();
        step2.AddApproverClick();
        step2.CheckDropDownItems([administratorUser,user3mail]);
    });

    it("New users Ap Credit Note", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_19_2wXLkKI');

        let administratorUser = "Test Auto";
        let newUSerMail = 'test@test.com';
        let newUSerName = 'test';

        browser.sleep(1500);
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);
        xeroWorkflows.PayableWorkflows.ApCreditNoteClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.RenameStep('step1');

        //4 Click Add Approver button	"Appears:Input field of the new mail user == Enter email List of existing users: TestAuto"
        workflowStep1.AddApproverClick();
        workflowStep1.CheckDropDownItems([administratorUser]);
        workflowCard.ToolBarMenuClick(); //клик по другой области, чтобы закрыть выпадающий список аппруверов
        //5 Click TestAuto	TestAuto added as approver
        workflowStep1.AddExistingApprover(administratorUser,[administratorUser]);
        //7 Set value in "Enter email" field == XXXtest	Appears warning: Enter a valid email to invite a new user
        workflowStep1.AddNewApprover('XXXtest',null,DisplayState.Shown);
        workflowCard.ToolBarMenuClick(); //клик по другой области, чтобы закрыть выпадающий список аппруверов
        workflowStep1.AddNewApprover(newUSerMail,[newUSerMail,administratorUser]);
        //14 Delete approver == test@test.com
        workflowStep1.DeleteApprover(newUSerMail);
        //17 Click "Add test@test.com..."	Added a new user in Approvers
        workflowStep1.AddNewApprover(newUSerMail);

        /*Delete requester from Xero requester
         Click Choose in Xero requester
         Chosee test@test.com */

        //24 Add new step
        let step2 = workflowCard.AddNewStep('22222stp');
        //25 Click Add Approver icon in 2 step
        //26 Chose test@test.com
        step2.AddExistingApprover(newUSerMail);

        // workflowCard.ActivateWorkflow(); Нужно добавить инвайнт новых юзеров
        //BUG workflowStep1.CheckApprovers([newUSerName]);
        step2.CheckApprovers([newUSerMail]);

        //30 Click Approval Matrix in first step
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();
        let user3mail = '111@zzz.tt';
        let user3name = '111';
        //33 Click "Add 111@zzz.tt..."
        matrix.AddNewUser(user3mail);
        //34 Click Done
        matrix.Done();

        //35 Click Add Approver icon in 2 step
        step2.AddApproverClick();
        step2.CheckDropDownItems([administratorUser,user3mail]);
    });

    it("New users AR Credit Note", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_19_2wXLkKI');

        let administratorUser = "Test Auto";
        let newUSerMail = 'test@test.com';
        let newUSerName = 'test';

        browser.sleep(1500);
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);

        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);
        xeroWorkflows.ReceivableWorkflows.ARCreditNoteClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.RenameStep('step1');

        //4 Click Add Approver button	"Appears:Input field of the new mail user == Enter email List of existing users: TestAuto"
        workflowStep1.AddApproverClick();
        workflowStep1.CheckDropDownItems([administratorUser]);
        workflowCard.ToolBarMenuClick(); //клик по другой области, чтобы закрыть выпадающий список аппруверов
        //5 Click TestAuto	TestAuto added as approver
        workflowStep1.AddExistingApprover(administratorUser,[administratorUser]);
        //7 Set value in "Enter email" field == XXXtest	Appears warning: Enter a valid email to invite a new user
        workflowStep1.AddNewApprover('XXXtest',null,DisplayState.Shown);
        workflowCard.ToolBarMenuClick(); //клик по другой области, чтобы закрыть выпадающий список аппруверов
        workflowStep1.AddNewApprover(newUSerMail);
        //14 Delete approver == test@test.com
        // BUG workflowStep1.DeleteApprover(newUSerMail);
        //17 Click "Add test@test.com..."	Added a new user in Approvers
        // BUG workflowStep1.AddNewApprover(newUSerMail);

        /*Delete requester from Xero requester
         Click Choose in Xero requester
         Chosee test@test.com */

        //24 Add new step
        let step2 = workflowCard.AddNewStep('22222stp');
        //25 Click Add Approver icon in 2 step
        //26 Chose test@test.com
        step2.AddExistingApprover(newUSerMail);

        // workflowCard.ActivateWorkflow(); Нужно добавить инвайнт новых юзеров
        workflowStep1.CheckApprovers([newUSerMail]);
        step2.CheckApprovers([newUSerMail]);

        //30 Click Approval Matrix in first step
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();
        let user3mail = '111@zzz.tt';
        let user3name = '111';
        //33 Click "Add 111@zzz.tt..."
        matrix.AddNewUser(user3mail);
        //34 Click Done
        matrix.Done();

        //35 Click Add Approver icon in 2 step
        step2.AddApproverClick();
        step2.CheckDropDownItems([administratorUser,user3mail]);
    });

    it("New users Sales Invoice", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_19_2wXLkKI');

        let administratorUser = "Test Auto";
        let newUSerMail = 'test@test.com';
        let newUSerName = 'test';

        browser.sleep(1500);
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);
        xeroWorkflows.ReceivableWorkflows.SalesInvoiceClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.RenameStep('step1');

        //4 Click Add Approver button	"Appears:Input field of the new mail user == Enter email List of existing users: TestAuto"
        workflowStep1.AddApproverClick();
        workflowStep1.CheckDropDownItems([administratorUser]);
        workflowCard.ToolBarMenuClick(); //клик по другой области, чтобы закрыть выпадающий список аппруверов
        //5 Click TestAuto	TestAuto added as approver
        workflowStep1.AddExistingApprover(administratorUser,[administratorUser]);
        //7 Set value in "Enter email" field == XXXtest	Appears warning: Enter a valid email to invite a new user
        workflowStep1.AddNewApprover('XXXtest',null,DisplayState.Shown);
        workflowCard.ToolBarMenuClick(); //клик по другой области, чтобы закрыть выпадающий список аппруверов
        workflowStep1.AddNewApprover(newUSerMail);
        //14 Delete approver == test@test.com
        // BUG workflowStep1.DeleteApprover(newUSerMail);
        //17 Click "Add test@test.com..."	Added a new user in Approvers
        // BUG workflowStep1.AddNewApprover(newUSerMail);

        /*Delete requester from Xero requester
         Click Choose in Xero requester
         Chosee test@test.com */

        //24 Add new step
        let step2 = workflowCard.AddNewStep('22222stp');
        //25 Click Add Approver icon in 2 step
        //26 Chose test@test.com
        step2.AddExistingApprover(newUSerMail);

        // workflowCard.ActivateWorkflow(); Нужно добавить инвайнт новых юзеров
        workflowStep1.CheckApprovers([newUSerMail]);
        step2.CheckApprovers([newUSerMail]);

        //30 Click Approval Matrix in first step
        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();
        let user3mail = '111@zzz.tt';
        let user3name = '111';
        //33 Click "Add 111@zzz.tt..."
        matrix.AddNewUser(user3mail);
        //34 Click Done
        matrix.Done();

        //35 Click Add Approver icon in 2 step
        step2.AddApproverClick();
        step2.CheckDropDownItems([administratorUser,user3mail]);
    });

    it("New users Xero PO", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_19_2wXLkKI');

        let administratorUser = "Test Auto";
        let newUSerMail = 'test@test.com';
        let newUSerName = 'test';

        browser.sleep(1500);
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let xeroWorkflows = new XeroWorkflows();
        xeroWorkflows.ConnectToXero(XeroLoginMethod.WithoutForm);
        xeroWorkflows.PayableWorkflows.PurchaseOrderClick();

        let workflowCard = new XeroWorkflowCard();
        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.RenameStep('step1');

        workflowStep1.AddExistingApprover(administratorUser,[administratorUser]);
        workflowStep1.AddNewApprover('XXXtest',null,DisplayState.Shown);
        workflowCard.ToolBarMenuClick(); //клик по другой области, чтобы закрыть выпадающий список аппруверов
        workflowStep1.AddNewApprover(newUSerMail);
        workflowStep1.CheckApprovers([newUSerMail,administratorUser]);
        workflowStep1.AddNewApprover(newUSerMail);
        workflowStep1.CheckApprovers([newUSerMail,administratorUser]);
        // BUG workflowStep1.DeleteApprover(newUSerMail);
        // BUG workflowStep1.AddNewApprover(newUSerMail);
        // BUG workflowStep1.CheckApprovers([newUSerName,administratorUser]);

        /* Delete requester from Xero requester
           Click Choose in Xero requester
           Chosee test@test.com 	test@test.com added as Xero requester*/

        let step2 = workflowCard.AddNewStep('22222stp');
        step2.AddExistingApprover(newUSerMail);
        step2.CheckApprovers([newUSerMail]);

        /*Click Add Requester in Requester	"Appears:
         List of existing users:
         TestAuto
         test@test.com "
         Set value in "Enter email" field == qaqaqa	Appears warning: Enter a valid email to invite a new user
         Press ENTER	"No change.
         Appears warning: Enter a valid email to invite a new user"
         Set value in "Enter email" field == qa@xx.com	Appears "Add qa@xx.com..."
         Click "Add qa@xx.com..."	Added a new user in Requester
        * */

        // workflowCard.ActivateWorkflow();
        workflowStep1.CheckApprovers([newUSerMail,administratorUser]);
        step2.CheckApprovers([newUSerMail]);

        /*Go to company setting 	"Appers 3 user :
         TestAuto
         test@test.com
         qa@xx.com"*/

        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();
        let user3mail = '111@zzz.tt';
        let user3name = '111';
        //35 Click "Add 111@zzz.tt..."
        matrix.AddNewUser(user3mail);
        matrix.Done();

        step2.AddApproverClick();
        step2.CheckDropDownItems([administratorUser,user3mail]);

        /* Click Requesters Matrix
         Click Add Approver button
         Set value in "Enter email" field == asdf@NEW.tt
         Click "Add asdf@NEW.tt..."
         Click Done
         Click Add Approver icon in 2 step	Among the users is displayed asdf@NEW.tt
         Choose asdf@NEW.tt	asdf@NEW.tt add as approver in 2 step*/
    });

    it("New users StandAlone", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_19_2wXLkKI');

        let administratorUser = "Test Auto";
        let newUSerMail = 'test@test.com';
        let newUSerName = 'test';

        browser.sleep(1500);
        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.AddNewCompany(companyName);
        overView.HamburgerClick();
        overView.OpenWorkFlowTab(companyName);
        let standaloneWorkflows = new StandaloneWorkflows();
        standaloneWorkflows.CreateFirstClick();
        let workflowCardSA = new StandAloneWorkflowCard();

        let workflowStep1 = new WorkflowStep(defaultNameStep);
        workflowStep1.RenameStep("step1");

        workflowStep1.AddExistingApprover(administratorUser,[administratorUser]);
        workflowStep1.AddNewApprover('XXXtest',null,DisplayState.Shown);
        workflowCardSA.ToolBarMenuClick(); //клик по другой области, чтобы закрыть выпадающий список аппруверов
        workflowStep1.AddNewApprover(newUSerMail);
        workflowStep1.CheckApprovers([newUSerMail,administratorUser]);
        workflowStep1.AddNewApprover(newUSerMail);
        workflowStep1.CheckApprovers([newUSerMail,administratorUser]);
        // BUG workflowStep1.DeleteApprover(newUSerMail);
        // BUG workflowStep1.AddNewApprover(newUSerMail);
        // BUG workflowStep1.CheckApprovers([newUSerName,administratorUser]);

        /* Delete requester from Xero requester
         Click Choose in Xero requester
         Chosee test@test.com 	test@test.com added as Xero requester*/

        let step2 = workflowCardSA.AddNewStep('22222stp');
        step2.AddExistingApprover(newUSerMail);
        step2.CheckApprovers([newUSerMail]);

        /*Click Add Requester in Requester	"Appears:
         List of existing users:
         TestAuto
         test@test.com "
         Set value in "Enter email" field == qaqaqa	Appears warning: Enter a valid email to invite a new user
         Press ENTER	"No change.
         Appears warning: Enter a valid email to invite a new user"
         Set value in "Enter email" field == qa@xx.com	Appears "Add qa@xx.com..."
         Click "Add qa@xx.com..."	Added a new user in Requester
         * */

        // workflowCard.ActivateWorkflow();
        workflowStep1.CheckApprovers([newUSerMail,administratorUser]);
        step2.CheckApprovers([newUSerMail]);

        /*Go to company setting 	"Appers 3 user :
         TestAuto
         test@test.com
         qa@xx.com"*/

        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();
        let user3mail = '111@zzz.tt';
        let user3name = '111';
        //35 Click "Add 111@zzz.tt..."
        matrix.AddNewUser(user3mail);
        matrix.Done();

        step2.AddApproverClick();
        step2.CheckDropDownItems([administratorUser,user3mail]);

        /* Click Requesters Matrix
         Click Add Approver button
         Set value in "Enter email" field == asdf@NEW.tt
         Click "Add asdf@NEW.tt..."
         Click Done
         Click Add Approver icon in 2 step	Among the users is displayed asdf@NEW.tt
         Choose asdf@NEW.tt	asdf@NEW.tt add as approver in 2 step*/
    });

    it("New users QB PO", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Workflows_19_2wXLkKI');

        let administratorUser = "Test Auto";
        let newUSerMail = 'test@test.com';
        let newUSerName = 'test';

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
        workflowStep1.RenameStep("step1");

        workflowStep1.AddExistingApprover(administratorUser,[administratorUser]);
        workflowStep1.AddNewApprover('XXXtest',null,DisplayState.Shown);
        workflowCard.ToolBarMenuClick(); //клик по другой области, чтобы закрыть выпадающий список аппруверов
        workflowStep1.AddNewApprover(newUSerMail);
        workflowStep1.CheckApprovers([newUSerMail,administratorUser]);
        workflowStep1.AddNewApprover(newUSerMail);
        workflowStep1.CheckApprovers([newUSerMail,administratorUser]);
        // BUG workflowStep1.DeleteApprover(newUSerMail);
        // BUG workflowStep1.AddNewApprover(newUSerMail);
        // BUG workflowStep1.CheckApprovers([newUSerName,administratorUser]);

        /* Delete requester from Xero requester
         Click Choose in Xero requester
         Chosee test@test.com 	test@test.com added as Xero requester*/

        let step2 = workflowCard.AddNewStep('22222stp');
        step2.AddExistingApprover(newUSerMail);
        step2.CheckApprovers([newUSerMail]);

        /*Click Add Requester in Requester	"Appears:
         List of existing users:
         TestAuto
         test@test.com "
         Set value in "Enter email" field == qaqaqa	Appears warning: Enter a valid email to invite a new user
         Press ENTER	"No change.
         Appears warning: Enter a valid email to invite a new user"
         Set value in "Enter email" field == qa@xx.com	Appears "Add qa@xx.com..."
         Click "Add qa@xx.com..."	Added a new user in Requester
         * */

        // workflowCard.ActivateWorkflow();
        workflowStep1.CheckApprovers([newUSerMail,administratorUser]);
        step2.CheckApprovers([newUSerMail]);

        /*Go to company setting 	"Appers 3 user :
         TestAuto
         test@test.com
         qa@xx.com"*/

        workflowStep1.ApproverMatrixClick();
        let matrix = new MatrixPopup();
        let user3mail = '111@zzz.tt';
        let user3name = '111';
        //35 Click "Add 111@zzz.tt..."
        matrix.AddNewUser(user3mail);
        matrix.Done();

        step2.AddApproverClick();
        step2.CheckDropDownItems([administratorUser,user3mail]);

        /* Click Requesters Matrix
         Click Add Approver button
         Set value in "Enter email" field == asdf@NEW.tt
         Click "Add asdf@NEW.tt..."
         Click Done
         Click Add Approver icon in 2 step	Among the users is displayed asdf@NEW.tt
         Choose asdf@NEW.tt	asdf@NEW.tt add as approver in 2 step*/
    });

});
