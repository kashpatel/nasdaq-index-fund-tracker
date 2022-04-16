const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

const tableSelector = '.fund-details-table';

const url =
    'https://www.scotiafunds.com/en/home/all-funds/mutual-fund.en.rtcsnf.bns397.index-funds.scotia-nasdaq-index-fund.html';

(async () => {
    try {
        const browser = await puppeteer.launch({
            defaultViewport: { width: 1920, height: 1080 },
        });
        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector(tableSelector, { visible: true });

        const tableElement = await page.$(tableSelector);
        await tableElement.screenshot({ path: 'table.jpeg' });

        await page.close();
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
            attachments: [
                {
                    path: 'table.jpeg',
                },
            ],
        });
    } catch (e) {
        console.error('Error: ', e);
    }
})();
