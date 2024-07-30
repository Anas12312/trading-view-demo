const puppeteer = require('puppeteer')
const dotenv = require('dotenv')
dotenv.config();

async function run(stockName) {
    const browser = await puppeteer.launch({
        timeout: 50_000,
        headless: false
    })

    const page = await browser.newPage()
    await page.goto("https://www.tradingview.com/pricing/?source=header_go_pro_button&feature=start_free_trial")
    await page.waitForSelector('.tv-header__area.tv-header__area--user')

    const header = await page.$('.tv-header__area.tv-header__area--user')

    const accountBtn = (await header.$$('button')).at(1)
    await accountBtn.click({
        delay: 100
    })

    await page.waitForSelector('.menuBox-Kq3ruQo8 button')

    const menuElement = (await page.$$('.menuBox-Kq3ruQo8 button'))
    const signInBtn = menuElement.at(1);
    await signInBtn.click()
    await page.waitForSelector('.container-R4aQJbLh')

    const emailButton = (await page.$$('.container-R4aQJbLh button')).at(5);
    await emailButton.click()
    await page.waitForSelector('.form-LQwxK8Bm')

    const emailInput = await page.$('.form-LQwxK8Bm #id_username');
    await emailInput.type(process.env.EMAIL, {
        delay: 10
    })

    const passwordInput = await page.$('.form-LQwxK8Bm #id_password');
    await passwordInput.type(process.env.PASSWORD, {
        delay: 10
    })

    const logInBtn = (await page.$$('.form-LQwxK8Bm button')).at(1);
    await logInBtn.click({
        count: 1,
        delay: 10
    })

    await page.waitForNavigation({ timeout: 60_000 })
    await page.goto("https://www.tradingview.com/chart/")

    await page.waitForSelector('#header-toolbar-symbol-search')

    const searchBtn = await page.$('#header-toolbar-symbol-search')
    await searchBtn.click({
        delay: 10
    })

    await page.waitForSelector('.inputContainer-qm7Rg5MB input')

    const searchInput = await page.$('.inputContainer-qm7Rg5MB input')
    await searchInput.type(stockName, { delay: 10 });

    await page.waitForSelector('.scrollContainer-dlewR1s1 .listContainer-dlewR1s1 .itemRow-oRSs8UQo')

    await page.click('.itemRow-oRSs8UQo div:nth-child(1)')


    let addAlertBtn = await page.waitForSelector('.leftSlot-u7Ufi_N7 .button-xNqEcuN2', { timeout: 1000 })

    if (!addAlertBtn) {
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
run('AAPL')