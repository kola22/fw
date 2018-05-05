var config = require("../conf.js");
import { Page } from "../Pages/Page";
import { BaseFakeScreen } from "../Pages/BaseFakeScreen";
var fs = require('fs');

export module Common {
    const screenShortRoot: string = "./reports/customscreen/";

    export function SwitchToWindow(windowIndex: number) {
        Common.Log("Switch To Window "+(windowIndex+1).toString()+"");
        browser.getAllWindowHandles().then(function(handles) {
            browser.switchTo().window(handles[windowIndex]);
        });
}


    export function requireGlobal(packageName) {
        var childProcess = require('child_process');
        var path = require('path');
        var fs = require('fs');

        var globalNodeModules = childProcess.execSync('npm root -g').toString().trim();
        var packageDir = path.join(globalNodeModules, packageName);
        if (!fs.existsSync(packageDir))
            packageDir = path.join(globalNodeModules, 'npm/node_modules', packageName); //find package required by old npm

        if (!fs.existsSync(packageDir))
            throw new Error('Cannot find global module \'' + packageName + '\'');

        var packageMeta = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json')).toString());
        var main = path.join(packageDir, packageMeta.main);

        return require(main);
    }

    export module DateTime {

        export function GetCurrentMonthName(): string {
            var month = (new Date()).getMonth();
            switch (month) {
                case 0: return "January";
                case 1: return "February";
                case 2: return "March";
                case 3: return "April";
                case 4: return "May";
                case 5: return "June";
                case 6: return "July";
                case 7: return "August";
                case 8: return "September";
                case 9: return "October";
                case 10: return "November";
                case 11: return "December";
                default: return "Unkonwn"
            }
        }

        export function GetCurrentYear(): string {
            return (new Date()).getFullYear().toString();
        }

        export function GetNextYear(): string {
            return ((new Date()).getFullYear()+1).toString();
        }

        export function GetTimeString(): string {
            var now = (new Date());
            var hours = AddLeadingZerro(now.getHours().toString());
            var minutes = AddLeadingZerro(now.getMinutes().toString());
            var seconds = AddLeadingZerro(now.getSeconds().toString());
            return "[" + hours + ":" + minutes + ":" + seconds + "]";
        }
    }

    export function DateQaPath(dataQaValue: string): string {
        return "//*[@data-qa='{value}']".replace('{value}', dataQaValue);
    }

    export function DateQaPathContains(dataQaValue: string): string {
        return "//*[contains(@data-qa,'{value}')]".replace('{value}', dataQaValue);
    }
    export function DateQaName(dataQaNameValue: string): string {
        return "//*[@data-qa-name='{value}']".replace('{value}', dataQaNameValue);
    }

    export function DateQaPathAndName(dataQaValue: string, dataQaNameValue: string): string {
        return "//*[@data-qa='{dataQaValue}'][@data-qa-name='{dataQaNameValue}']".replace('{dataQaValue}', dataQaValue).replace('{dataQaNameValue}', dataQaNameValue);
    }

    export function DateQaPathAndId(dataQaValue: string, dataQaIdValue: string): string {
        return "//*[@data-qa='{dataQaValue}'][@data-qa-id='{dataQaIdValue}']".replace('{dataQaValue}', dataQaValue).replace('{dataQaIdValue}', dataQaIdValue);
    }

    export function ElementByDateQa(dataQaValue: string, index: number = 0): protractor.ElementFinder {
        return element.all(by.xpath(DateQaPath(dataQaValue))).get(index);
    }

    export function ElementByDateQaName(dataQaNameValue: string, index: number = 0): protractor.ElementFinder {
        return element.all(by.xpath(DateQaName(dataQaNameValue))).get(index);
    }

    export function ElementByDateQaAndName(dataQaValue: string, dataQaNameValue: string, index: number = 0): protractor.ElementFinder {
        return element.all(by.xpath(DateQaPathAndName(dataQaValue, dataQaNameValue))).get(index);
    }

    export function ElementByDateQaAndId(dataQaValue: string, dataQaIdValue: string, index: number = 0): protractor.ElementFinder {
        return element.all(by.xpath(DateQaPathAndId(dataQaValue, dataQaIdValue))).get(index);
    }

    function writeScreenShot(data, filename) {
        var stream = fs.createWriteStream(filename);

        stream.write(new Buffer(data, 'base64'));
        stream.end();
    }

    export function SaveScreenShort(fileName: string) {
        let fullFileName = screenShortRoot + fileName;
        browser.takeScreenshot().then(function (png) {
            writeScreenShot(png, fullFileName);
        });
    }

    export function Log(message: string) {
        browser.driver.sleep(0).then(function () { console.log(Common.DateTime.GetTimeString() + ": " + message) });
    }

    export function LogWithValue(message: string,value: string) {
        browser.driver.sleep(0).then(function () { console.log(Common.DateTime.GetTimeString() + ": " + message + "\x1b[31;4m" + value + "\x1b[0m") });
    }

    export function LogNameTestPlan(message: string) {
        let x = ' ++++++++++++++++++++++++++++++++++  ';
        Common.Log("\x1b[37;43m " + x + message + x + " \x1b[0m");
    }

    export function LogBug(message: string) {
        let x = ' //////////// ';
        Common.Log("\x1b[37;41m " + x + message + x + "\x1b[0m");
    }

    function AddLeadingZerro(value: string): string {
        if (value.length >= 2) return value;
        return "0" + value;
    }

    export function NumberToWord(value: number) {
        var s = value.toString();
        var th = ['', 'thousand', 'million', 'billion', 'trillion'];
        // uncomment this line for English Number System
        // var th = ['','thousand','million','milliard','billion'];
        var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        s = s.replace(/[\, ]/g, '');
        if (s != parseFloat(s).toString())
            return 'not a number';
        var x = s.indexOf('.');
        if (x == -1)
            x = s.length;
        if (x > 15)
            return 'too big';
        var n: any[] = s.split('');
        var str = '';
        var sk = 0;

        if (n.length == 1 && n[0] == 0) {
            str = dg[0];
        } else {
            for (var i = 0; i < x; i++) {
                if ((x - i) % 3 == 2) {
                    if (n[i] == '1') {
                        str += tn[Number(n[i + 1])] + ' ';
                        i++; sk = 1;
                    } else if (n[i] != 0) {
                        str += tw[n[i] - 2];
                        if (i + 1 < x) {
                            if (n[i + 1] != 0)
                                str += '-';
                        }
                        sk = 1;
                    }
                } else if (n[i] != 0) {
                    str += dg[n[i]] + ' ';
                    if ((x - i) % 3 == 0) str += 'hundred ';
                    sk = 1;
                }
                else if (str.length >= 2 && str[str.length - 1] == " " && str[str.length - 2] == "-") {
                    str = str.trim();
                }

                if ((x - i) % 3 == 1) {
                    if (sk) str += th[(x - i - 1) / 3] + ' ';
                    sk = 0;
                }
            }
        }
        if (x != s.length) {
            var y = s.length;
            str += 'point ';
            var i: number;
            for (i = x + 1; i < y; i++)
                str += dg[n[i]] + ' ';
        }

        return this.Capitalise(str.replace(/\s+/g, ' '));
    }

    export function Capitalise(string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    //strong condition
    export function HasClass(element: protractor.ElementFinder, className: string): webdriver.promise.Promise<boolean> {
        return element.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(className) !== -1;
        });
    }

    //contains condition
    export function ContainClass(element: protractor.ElementFinder, className: string): webdriver.promise.Promise<boolean> {
        return element.getAttribute('class').then(function (classes) {
            return classes.indexOf(className) !== -1;
        });
    }

    export function NotContainClass(element: protractor.ElementFinder, className: string): webdriver.promise.Promise<boolean> {
        return element.getAttribute('class').then(function (classes) {
            return classes.indexOf(className) == -1;
        });
    }

    export function IsEmtyText(element: protractor.ElementFinder, className: string): webdriver.promise.Promise<boolean> {
        return element.getText().then(function (result) {
            return result.length > 0;
        });
    }

    export function PresentAndDisplayed(element: protractor.ElementFinder): webdriver.promise.Promise<boolean> {
        return element.isPresent().then(function (result) {
            return result ? element.isDisplayed() : element.isPresent();
        });
    }

    export function CheckNewTabWithUrlExistsAndCloseIt(url: string) {
        browser.getAllWindowHandles().then(function (handles) {
            let newWindowHandle = handles[handles.length - 1];
            browser.switchTo().window(newWindowHandle).then(function () {
                expect(browser.getCurrentUrl()).toEqual(url, "Url not to equal expected");
                browser.driver.close();
            });

            browser.wait(browser.switchTo().window(handles[0]));
        });
    }

    export function TSLog(messageText: string) {
        browser.sleep(0).then(function () {
            console.info("##teamcity[message text= '" + messageText + "' status= 'WARNING']");
        });
    }

    export function ScrollIntoView(target: protractor.ElementFinder) {
        browser.wait(target.isDisplayed().then(function (result) {
            if (!result) {
                browser.executeScript("arguments[0].scrollIntoView();", target.getWebElement());
                Common.Log('Scroll to element');
            }
            return true;
        }));
    }

    export function ScrollBottom() {
                browser.executeScript("window.scrollTo(0, document.body.scrollHeight)");
                Common.Log('Scroll bottom');
    }

    export function CheckAndCloseAllert() {
        browser.driver.switchTo().alert().then(
            function (alert) {
                Common.LogBug("Warning alert opened!");
                alert.dismiss();
            },
            function (err) { }
        );
    }

    export module Spies {

        export function Set() {

            Common.CheckAndCloseAllert();
            browser.switchTo().defaultContent();

            if (config.config.spiesEnabled) {
                Common.Log("Set spies");
                
                var scopeSleep = browser.sleep;
                spyOn(browser, 'sleep').and.callFake(function (timeout: number) {
                    var newTimeout = timeout * Page.Config.spieSleepFactor;
                    scopeSleep(newTimeout);
                });

                spyOn(browser.driver, 'wait').and.callThrough();
            }
        }

        export function Log() {
            if (config.config.spiesEnabled) {
                Common.Log("Log spies");
                let sleepArgs: any[] = (<any>browser.sleep).calls.allArgs();
                let sleepSumm = SummSpieArgs(sleepArgs, 0, Page.Config.spieSleepFactor);
                LogSpieSumm("browser.sleep", sleepSumm, sleepArgs.length);

                let waitArgs: any[] = (<any>browser.driver.wait).calls.allArgs();
                let waitSumm = SummSpieArgs(waitArgs, 1);
                LogSpieSumm("browser.wait", waitSumm, waitArgs.length);
            }
        }

        function SummSpieArgs(args: any[], argIndex: number = 0, factor: number = 1): number {
            if (typeof (args) === "undefined") return 0;

            var summ = 0;
            for (let i = 0; i < args.length; i++) {

                if (typeof (args[i]) === "undefined")
                    continue;
                let value = parseInt((<any[]>args[i])[argIndex]);

                if (!isNaN(value))
                    summ += value;
            }
            return summ * factor;
        }

        function LogSpieSumm(spieName: string, summ: number, callsCount: number) {
            let summSekond = summ / 1000;
            Common.Log(spieName + ": calls count = " + callsCount + ", totatl time = " + summSekond + "s");
        }


    }
    //26.3.2018
    export function CheckTitleBrowser(titleText:string) {
        Common.LogWithValue("Check Title Browser ",titleText);
        browser.sleep(1500);
        expect(browser.getTitle()).toEqual(titleText, 'CheckTitleBrowser not equal');
    }

    export function ClickInDrawerReg(drawerRegElement = 'drawerReg') {
        // нажать на затемненное поле экрана
        Common.Log("ClickInDrawerReg");
        browser.sleep(1000);
        var drawerReg = element(by.id(drawerRegElement));
        browser.actions().mouseMove(drawerReg, { x: 500, y: 350 }).perform();
        browser.actions().click().perform();
    }

    //27.3.18
    export function RefreshBrowser(switchToAletr = false) {
        Common.Log("Browser refresh");
        browser.refresh();
        switchToAletr ? browser.switchTo().alert().accept() : browser.sleep(50);
        let baseFake = new BaseFakeScreen();
    }

    export function GlobalProgressLineLoader() {
        Common.Log("Wait: NotPresent: GlobalProgressLineLoader");
        Page.Wait.ElementNotPresent(element(by.xpath("//*[@id='global-progress'][@style='visibility: visible;']")),'top loader',90000);

    }

}
