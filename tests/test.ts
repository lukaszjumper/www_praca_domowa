import {Builder, By, Key, until} from 'selenium-webdriver';

(async function sameQuizTest() {
    const driver = await new Builder().forBrowser('firefox').build();
    try {
        await driver.get('http://localhost:3000/logging/signin');
        await driver.wait(until.elementLocated(By.name('id')), 10000);
        await driver.findElement(By.name('id')).sendKeys('user1');
        await driver.findElement(By.name('password')).sendKeys('user1', Key.ENTER);
        await driver.get('http://localhost:3000/quizes/geometria'); // Zakładamy, że ten quiz był rozwiązany przez user1
        const request =
        `const ansForm = document.createElement('form');
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
        await driver.executeScript(request);
        // Ma być strona błędu
        await driver.wait(until.elementLocated(By.id('status')), 10000);
    }
    catch(e) {
        console.log(e);
    }
    finally{
        driver.quit();
    }
})();

(async function changingPasswordTest() {
    const driver1 = await new Builder().forBrowser('firefox').build();
    const driver2 = await new Builder().forBrowser('firefox').build();
    try {
        await driver1.get('http://localhost:3000/logging/signin');
        await driver1.wait(until.elementLocated(By.name('id')), 10000);
        await driver1.findElement(By.name('id')).sendKeys('user4');
        await driver1.findElement(By.name('password')).sendKeys('user4', Key.ENTER);

        await driver2.get('http://localhost:3000/logging/signin');
        await driver2.wait(until.elementLocated(By.name('id')), 10000);
        await driver2.findElement(By.name('id')).sendKeys('user4');
        await driver2.findElement(By.name('password')).sendKeys('user4', Key.ENTER);

        await driver1.get('http://localhost:3000/logging/change');
        await driver1.wait(until.elementLocated(By.name('id')), 10000);
        await driver1.findElement(By.name('id')).sendKeys('user4');
        await driver1.findElement(By.name('oldpass')).sendKeys('user4');
        await driver1.findElement(By.name('newpass')).sendKeys('newpassword', Key.ENTER);
        await driver1.wait(until.elementLocated(By.id('stat_info')), 10000);

        await driver2.get('http://localhost:3000/');
        // Tutaj powinno nastąpić przekierowanie do logowania
        await driver2.wait(until.elementLocated(By.name('id')), 10000);
    }
    catch(e) {
        console.log(e);
    }
    finally{
        try {
            await driver1.get('http://localhost:3000/logging/change');
            await driver1.wait(until.elementLocated(By.name('id')), 10000);
            await driver1.findElement(By.name('id')).sendKeys('user4');
            await driver1.findElement(By.name('oldpass')).sendKeys('newpassword');
            await driver1.findElement(By.name('newpass')).sendKeys('user4', Key.ENTER);
        }
        finally {
            driver1.quit();
            driver2.quit();
        }
    }
})();

