const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

const priceSelector = '.bns--fund-price .c--title';
const dateSelector = '.bns--fund-price .c--text';

const url =
    'https://www.scotiafunds.com/scotiafunds/en/fund-overviews/index-funds/scotia-nasdaq-index-fund.html';

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url);
        await page.waitForSelector(priceSelector, { visible: true });

        const dateElement = await page.$(dateSelector);
        const date = await page.evaluate((el) => el.textContent, dateElement);

        const priceElement = await page.$(priceSelector);
        const price = await page.evaluate((el) => el.textContent, priceElement);

        await browser.close();

        const body = `${date} is ${price}`;

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
            text: body,
        });
    } catch (e) {
        console.error('Error: ', e);
    }
})();
