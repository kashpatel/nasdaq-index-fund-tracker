const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

const selector = '.bns--fund-price .c--title';
const url =
    'https://www.scotiafunds.com/scotiafunds/en/fund-overviews/index-funds/scotia-nasdaq-index-fund.html';

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url);
        await page.waitForSelector(selector, { visible: true });

        const element = await page.$(selector);
        const price = await page.evaluate((el) => el.textContent, element);

        await browser.close();

        const uname = process.env.USERNAME;
        const pass = process.env.PASS;
        const to = process.env.EMAILS;

        const transporter = nodemailer.createTransport({
            secure: true,
            service: 'gmail',
            auth: { user: uname, pass: pass },
        });

        await transporter.sendMail({
            from: uname,
            to: to,
            subject: 'Scotia Nasdaq Index Fund Price',
            text: price,
        });
    } catch (e) {
        console.error('Error: ', e);
    }
})();
