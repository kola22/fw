import { Page } from "../../Pages/Page";
import { LoginForm } from "../../Pages/Forms/LogIn";
import { OverviewPage } from "../../Pages/OverviewPage";
import { Common } from "../../Common/Common";
import { RandomGenerator } from "../../Common/RandomGenerator";
import { LogoMenu } from "../../Pages/Forms/LogoMenu";
import { DropDownState } from "../../Common/Enums";




describe("5_Company_Sorting  .  ts", function () {

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
        Common.Log('AfterAll');
        Page.Navigate.TestApp();
        let logoMenu = new LogoMenu();
        logoMenu.LogoMenuClick(DropDownState.Open);
        logoMenu.LogoutCLick();
        Common.Spies.Log();
        browser.sleep(1500);
    });


    it("Sorting", function () {
        Common.LogNameTestPlan('Test-plan: http://bit.ly/Company_5_2Bug4pf ');

        let overView = new OverviewPage();
        overView.HamburgerClick();
        overView.DeleteAllCompany();

        overView.AddNewCompany('first');
        overView.HamburgerClick();
        overView.CheckSortingCompany(["first"]);

        overView.AddNewCompany('SCND');
        overView.HamburgerClick();
        overView.CheckSortingCompany(["first","SCND"]);

        overView.AddNewCompany('33333');
        overView.HamburgerClick();
        overView.CheckSortingCompany(["33333","first","SCND"]);

        browser.refresh();
        overView = new OverviewPage();
        overView.HamburgerClick();
        overView.CheckSortingCompany(["33333","first","SCND"]);

        overView.AddNewCompany(' 3');
        overView.HamburgerClick();
        overView.CheckSortingCompany([" 3","33333","first","SCND"]);

        overView.AddNewCompany('___3');
        overView.HamburgerClick();
        overView.CheckSortingCompany([" 3","___3","33333","first","SCND"]);

        overView.DeleteCompany("first");
        overView.HamburgerClick();
        overView.CheckSortingCompany([" 3","___3","33333","SCND"]);

        overView.RenameCompany("SCND","2SCND");
        overView.HamburgerClick();
        overView.CheckSortingCompany([" 3","___3","2SCND","33333"]);

        overView.RenameCompany("2SCND"," 2SCND",false);
        overView.HamburgerClick();
        overView.CheckSortingCompany([" 2SCND"," 3","___3","33333"]);

        overView.AddNewCompany(null);
        overView.HamburgerClick();
        overView.CheckSortingCompany([" 2SCND"," 3","___3","33333","Unnamed Organisation"]);

        browser.refresh();
        overView = new OverviewPage();
        overView.HamburgerClick();
        overView.CheckSortingCompany([" 2SCND"," 3","___3","33333","Unnamed Organisation"]);

        overView.AddNewCompany(null);
        overView.HamburgerClick();
        overView.CheckSortingCompany([" 2SCND"," 3","___3","33333","Unnamed Organisation","Unnamed Organisation"]);

        overView.RenameCompany("Unnamed Organisation","1 Unnamed Organisation",true,true);
        overView.HamburgerClick();
        overView.CheckSortingCompany([" 2SCND"," 3","___3","1 Unnamed Organisation","33333","Unnamed Organisation"]);

        overView.AddNewCompany("  ");
        overView.HamburgerClick();
        overView.CheckSortingCompany(["  "," 2SCND"," 3","___3","1 Unnamed Organisation","33333","Unnamed Organisation"]);
    });

});
