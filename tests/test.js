"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
(function sameQuizTest() {
    return __awaiter(this, void 0, void 0, function* () {
        const driver = yield new selenium_webdriver_1.Builder().forBrowser('firefox').build();
        try {
            yield driver.get('http://localhost:3000/logging/signin');
            yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.name('id')), 10000);
            yield driver.findElement(selenium_webdriver_1.By.name('id')).sendKeys('user1');
            yield driver.findElement(selenium_webdriver_1.By.name('password')).sendKeys('user1', selenium_webdriver_1.Key.ENTER);
            yield driver.get('http://localhost:3000/quizes/geometria'); // Zakładamy, że ten quiz był rozwiązany przez user1
            const request = `const ansForm = document.createElement('form');
        ansForm.method = 'POST';
        const ansInput = document.createElement('input');
        ansInput.name = 'answered';
        ansInput.value = JSON.stringify('[]');
        ansForm.appendChild(ansInput);
        const statsInput = document.createElement('input');
        statsInput.name = 'stats';
        statsInput.value = JSON.stringify('[]');
        ansForm.appendChild(statsInput);
        document.body.appendChild(ansForm);
        ansForm.submit();`;
            // Próbujemy wysłać taki request jak przy zapisywaniu wyniku
            yield driver.executeScript(request);
            // Ma być strona błędu
            yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.id('status')), 10000);
        }
        catch (e) {
            console.log(e);
        }
        finally {
            driver.quit();
        }
    });
})();
(function changingPasswordTest() {
    return __awaiter(this, void 0, void 0, function* () {
        const driver1 = yield new selenium_webdriver_1.Builder().forBrowser('firefox').build();
        const driver2 = yield new selenium_webdriver_1.Builder().forBrowser('firefox').build();
        try {
            yield driver1.get('http://localhost:3000/logging/signin');
            yield driver1.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.name('id')), 10000);
            yield driver1.findElement(selenium_webdriver_1.By.name('id')).sendKeys('user4');
            yield driver1.findElement(selenium_webdriver_1.By.name('password')).sendKeys('user4', selenium_webdriver_1.Key.ENTER);
            yield driver2.get('http://localhost:3000/logging/signin');
            yield driver2.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.name('id')), 10000);
            yield driver2.findElement(selenium_webdriver_1.By.name('id')).sendKeys('user4');
            yield driver2.findElement(selenium_webdriver_1.By.name('password')).sendKeys('user4', selenium_webdriver_1.Key.ENTER);
            yield driver1.get('http://localhost:3000/logging/change');
            yield driver1.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.name('id')), 10000);
            yield driver1.findElement(selenium_webdriver_1.By.name('id')).sendKeys('user4');
            yield driver1.findElement(selenium_webdriver_1.By.name('oldpass')).sendKeys('user4');
            yield driver1.findElement(selenium_webdriver_1.By.name('newpass')).sendKeys('newpassword', selenium_webdriver_1.Key.ENTER);
            yield driver1.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.id('stat_info')), 10000);
            yield driver2.get('http://localhost:3000/');
            // Tutaj powinno nastąpić przekierowanie do logowania
            yield driver2.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.name('id')), 10000);
        }
        catch (e) {
            console.log(e);
        }
        finally {
            try {
                yield driver1.get('http://localhost:3000/logging/change');
                yield driver1.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.name('id')), 10000);
                yield driver1.findElement(selenium_webdriver_1.By.name('id')).sendKeys('user4');
                yield driver1.findElement(selenium_webdriver_1.By.name('oldpass')).sendKeys('newpassword');
                yield driver1.findElement(selenium_webdriver_1.By.name('newpass')).sendKeys('user4', selenium_webdriver_1.Key.ENTER);
            }
            finally {
                driver1.quit();
                driver2.quit();
            }
        }
    });
})();
