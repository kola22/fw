/// <reference path="Scripts/typings/jasmine/jasmine.d.ts" />
import { Common } from  "./Common/Common";
exports.config = {
    plugins: [{
        package: 'jasmine2-protractor-utils',
        disableHTMLReport: true,
        disableScreenshot: false,
        screenshotPath: './reports/screenshots',
        screenshotOnExpectFailure: true,
        screenshotOnSpecFailure: true,
        clearFoldersBeforeTest: true,
        htmlReportDir: './reports/htmlReports'
    }],
    //chromeDriver: "./node_modules/protractor/selenium/chromedriver",
    // seleniumAddress: "http://localhost:4444/wd/hub",
    specs: [

        // "spec/Workflows/21_Workflows_IntegrationNewCompany.js",
        // "spec/Workflows/2_Workflows_XeroWorkflows.js",
        // "spec/Workflows/4_Workflows_NewApproverInStep.js",
        // "spec/Workflows/5_Workflows_SeveralWorkflowAndFilter.js",
        // "spec/Workflows/6_Workflows_Deadline Duration.js",
        // "spec/Workflows/7_Workflows_ApprovalMatrix.js",
        // "spec/Workflows/8_Workflows_EachStateEachCellInXeroWF.js",
        // "spec/Workflows/9_Workflows_POEachCell.js",
        // "spec/Workflows/10_Workflows_EditMatrix.js",
        // "spec/Workflows/11_Workflows_CountNameWorkflows.js",
        // "spec/Workflows/13_Workflows_AlternativeRules.js",
        // "spec/Workflows/14_Workflows_Cache.js",
        // "spec/Workflows/15_Workflows_RulesActivated.js",
        // "spec/Workflows/16_Workflows_SavingDataInMatrix.js",
        // "spec/Workflows/17_Workflows_RequestersMatrix.js",
        // "spec/Workflows/18_Workflows_Default Approver.js",
        // "spec/Workflows/19_Workflows_NewUser.js",
        // "spec/Workflows/20_1_Workflows_WFsettings_QB.js",
        // "spec/Workflows/20_Workflows_WFsettings.js",
        // "spec/Workflows/22_Workflows_WithoutSteps.js",
        //
        // "spec/Company/1_Company_AddNewCompany.js",
        // "spec/Company/2_Company_LearMore.js",
        // "spec/Company/3_Company_XeroIntegration.js",
        // "spec/Company/4_Company_QBIntegration.js",
        "spec/Company/5_Company_Sorting.js",
        "spec/Workflows/22_Workflows_WithoutSteps.js",
        // "spec/Company/6_Company_Delete.js",
        // "spec/Company/8_Company_LockDate.js",

    ],


    spiesEnabled: true,
    isMobile: false,
    allScriptsTimeout: 840000,
    getPageTimeout: 45000,
    shardTestFiles: true,
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: ['--no-sandbox --incognito --start-maximized --ignore-certificate-errors']
        }
    },
    restartBrowserBetweenTests: false,
    //directConnect: true,
    framework: "jasmine2",
    jasmineNodeOpts: {
        showColors: true,
        // default time to wait in ms before a test fails.
        defaultTimeoutInterval: 1500000
    },
    onPrepare: function () {
        Common.Log("onPrepare");

        if (process.env.TEAMCITY_VERSION) {
            var jasmineReporters = require("jasmine-reporters");
            jasmine.getEnv().addReporter(new jasmineReporters.TeamCityReporter());
        }

        var originalAddExpectationResult = (<any>jasmine).Spec.prototype.addExpectationResult;
        (<any>jasmine).Spec.prototype.addExpectationResult = function () {
            var self = this;
            if (!arguments[0]) {
                Common.LogBug('Expect failure!');
                browser.sleep(10000);
            }
            return originalAddExpectationResult.apply(this, arguments);
        };

    }
};
