const puppeteer = require('puppeteer')

async function run() {
    const browser = await puppeteer.launch({
        timeout: 50_000,
        headless: false
    })

    const page = await browser.newPage()
    await page.goto("https://www.tradingview.com/pricing/?source=header_go_pro_button&feature=start_free_trial")
    await page.waitForSelector('.tv-header__area.tv-header__area--user')

    const header = await page.$('.tv-header__area.tv-header__area--user')
    const accountBtn = (await header.$$('button')).at(1)
    await accountBtn.click()
    await page.waitForSelector('.menuBox-Kq3ruQo8')

    const menuElement = (await page.$$('.menuBox-Kq3ruQo8')).at(1)
    const signInBtn = await menuElement.$('button')
    await signInBtn.click()
}
run()