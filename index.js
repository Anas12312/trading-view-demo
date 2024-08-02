const puppeteer = require('puppeteer')
const dotenv = require('dotenv');
const { timeout } = require('puppeteer');
dotenv.config();

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

async function run(stockName) {
    const browser = await puppeteer.launch({
        timeout: 50_000,
        headless: false,
        userDataDir: process.env.CHROME_PATH,
        args: [
            "--profile-directory=Profile 3"
        ],
        defaultViewport: {
            height: 1400,
            width: 3000
        }
    })

    const page = await browser.newPage()
    page.setViewport({
        height: 900,
        width: 1400
    })

    // await page.goto("https://www.tradingview.com/pricing/?source=header_go_pro_button&feature=start_free_trial")
    // await page.waitForSelector('.tv-header__area.tv-header__area--user')

    // const header = await page.$('.tv-header__area.tv-header__area--user')

    // const accountBtn = (await header.$$('button')).at(1)
    // await accountBtn.click({
    //     delay: 100
    // })

    // await page.waitForSelector('.menuBox-Kq3ruQo8 button')

    // const menuElement = (await page.$$('.menuBox-Kq3ruQo8 button'))
    // const signInBtn = menuElement.at(1);
    // await signInBtn.click()
    // await page.waitForSelector('.container-R4aQJbLh')

    // const emailButton = (await page.$$('.container-R4aQJbLh button')).at(5);
    // await emailButton.click()
    // await page.waitForSelector('.form-LQwxK8Bm')

    // const emailInput = await page.$('.form-LQwxK8Bm #id_username');
    // await emailInput.type(process.env.EMAIL, {
    //     delay: 10
    // })

    // const passwordInput = await page.$('.form-LQwxK8Bm #id_password');
    // await passwordInput.type(process.env.PASSWORD, {
    //     delay: 10
    // })

    // const logInBtn = (await page.$$('.form-LQwxK8Bm button')).at(1);
    // await logInBtn.click({
    //     count: 1,
    //     delay: 10
    // })

    // await page.waitForNavigation({ timeout: 60_000 })


    await page.goto("https://www.tradingview.com/chart/")

    await page.waitForSelector('#header-toolbar-symbol-search')

    const searchBtn = await page.$('#header-toolbar-symbol-search')
    
    // await delay(1000)

    await searchBtn.click({
        delay: 10
    })
    await page.waitForSelector('.inputContainer-qm7Rg5MB input')

    const searchInput = await page.$('.inputContainer-qm7Rg5MB input')
    await searchInput.type(stockName, { delay: 10 });

    await page.waitForSelector('.scrollContainer-dlewR1s1 .listContainer-dlewR1s1 .itemRow-oRSs8UQo')

    await page.click('.itemRow-oRSs8UQo div:nth-child(1)')

    let addAlertBtn
    try {
        addAlertBtn = await page.waitForSelector('.leftSlot-u7Ufi_N7 .button-xNqEcuN2', { timeout: 1000 })
    }
    catch (e) {
        const toolBar = await page.waitForSelector('.toolbar-S4V6IoxY')
        const alertBtn = await toolBar.$('button:nth-child(2)')
        await alertBtn.click({
            delay: 10
        })
        addAlertBtn = await page.waitForSelector('.leftSlot-u7Ufi_N7 .button-xNqEcuN2')
    }

    await addAlertBtn.click({
        delay: 10
    })

    const alerNameInput = await page.waitForSelector('input#alert-name')
    await alerNameInput.type('Testing', {
        delay: 10
    })

    const createBtn = await page.$('button.submitBtn-RHTYtJvz')
    await createBtn.click({
        delay: 10
    })
}
// run('AAPL')

const runIndcator = async () => {
    const browser = await puppeteer.launch({
        timeout: 50_000,
        headless: false,
        userDataDir: process.env.CHROME_PATH,
        args: [
            "--profile-directory=Profile 1"
        ]
    })

    const page = await browser.newPage()
    await page.setViewport({
        height: 900,
        width: 1500
    })
    await page.goto("https://www.tradingview.com/chart/")

    // Add Indcator

    const indcatorsBtn = await page.waitForSelector('#header-toolbar-indicators button');
    
    await delay(1000)
    
    await indcatorsBtn.click({
        delay: 100
    });

    await page.waitForSelector('.container-hrZZtP0J .listContainer-I087YV6b');

    const selectIndcator = async (indcatorName) => {
        try {
            const indcator = await page.$('.container-hrZZtP0J .listContainer-I087YV6b .container-WeNdU0sq[data-title="Advance Decline Line"]'); // Select Indcator with [data-title]
            
            await delay(1000)
            
            await indcator.click(`.container-hrZZtP0J .listContainer-I087YV6b .container-WeNdU0sq[data-title="${indcatorName}"]`, {
                delay: 1000,
                offset: {
                    x: 3,
                    y: 3
                },
                count: 2
            })
        }
        catch (e) {
            await selectIndcator(indcatorName);
        }
    }

    await selectIndcator('Advance Decline Line');

    try {
        const goProPopup = await page.waitForSelector('div[data-dialog-name="gopro"]', {
            timeout: 300
        })
        
        await delay(1000)
        
        await page.click('button[aria-label="Close"]')
    }
    catch (e) { }

    const exitBtn = await page.waitForSelector('button[data-name="close"]');
    
    await delay(1000)
    
    await exitBtn.click({
        delay: 100
    });

    // Save Changes
    
    await delay(1000)

    await page.click('button#header-toolbar-save-load', {
        delay: 1000
    })

    // Select Indcator from Chart

    await page.waitForSelector('.chart-markup-table.pane');
    const charts = await page.$$('.chart-markup-table.pane')

    const indcatorChart = charts.at(1);

    const indcatorLegend = await indcatorChart.$('.legend-l31H9iuA .sourcesWrapper-l31H9iuA .sources-l31H9iuA div:last-child .noWrapWrapper-l31H9iuA')
    
    await delay(1000)
    
    await indcatorLegend.click();

    // Setting Button

    // const indcatorSettingButton = await indcatorLegend.$('.buttonsWrapper-l31H9iuA .buttons-l31H9iuA button[data-name="legend-settings-action"]')
    // await indcatorSettingButton.click();

    // More Action Button

    const indcatorSettingButton = await indcatorLegend.$('.buttonsWrapper-l31H9iuA .buttons-l31H9iuA button[data-name="legend-more-action"]')
    await indcatorSettingButton.click();

    await page.keyboard.down('Alt')
    await page.keyboard.down('A')

    await page.keyboard.up('Alt')
    await page.keyboard.up('A')

    // // Notification Tab

    const notificationTabBtn = await page.waitForSelector('div[data-name="alerts-create-edit-dialog"] .tabsWrapper-v6smTDmN div[data-name="underline-tabs-buttons"] div#id_alerts-create-edit-dialog-tabs_tablist button#alert-dialog-tabs__notifications');
    
    await delay(1000)
    
    await notificationTabBtn.click({
        delay: 10
    })

    // const enableWebhook = await page.waitForSelector('div[data-name="alerts-create-edit-dialog"] .tabsWrapper-v6smTDmN div[data-name="underline-tabs-buttons"] div#id_alerts-create-edit-dialog-tabs_tablist button#alert-dialog-tabs__notifications');
    // await notificationTabBtn.click({
    //     delay: 10
    // })

    // await page.click('#alert-dialog-tabs__notifications',
    //     { delay: 1000 }
    // )

    // await page.click('input[data-name="webhook"]',
    //     { delay: 100 }
    // );
    
    // await page.type('input#webhook-url',
    //     'http://18.220.204.73/webhook',
    //     { delay: 50 }
    // );

    const createAlertBtn = await page.waitForSelector('div[data-name="alerts-create-edit-dialog"] form .footerWrapper-xhmb_vtW div div button[data-name="submit"]');
    
    await delay(1000)
    
    await createAlertBtn.click({
        delay: 100
    });

    // Save Changes
    await page.click('button#header-toolbar-save-load', {
        delay: 1000
    })
    await page.waitForNetworkIdle()
    await delay(1000)
    const dropDownBtn = (await page.$$(".button-merBkM5y"))
    // console.log(dropDownBtn)
    await dropDownBtn[18].click({
        delay: 20
    })
    await page.waitForSelector(".accessible-NQERJsv9.item-jFqVJoPk.withIcon-jFqVJoPk.withIcon-yyMUOAN9")
    await delay(100)
    const exportCSVButton = (await page.$$(".accessible-NQERJsv9.item-jFqVJoPk.withIcon-jFqVJoPk.withIcon-yyMUOAN9")).at(2)
    // console.log(exportCSVButton)
    await exportCSVButton.click({
        delay: 20
    })
    await page.waitForSelector("#time-format-select")
    const dropDownButton = (await page.$("#time-format-select"))
    // console.log(dropDownButton)
    await dropDownButton.click({
        delay: 20
    })
    await page.click("#time-format-iso",{
        delay: 20
    })
    await page.click("[data-name='submit-button']", {
        delay: 20
    })
}

runIndcator()