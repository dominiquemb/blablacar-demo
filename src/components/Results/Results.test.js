import { done } from 'fetch-mock';
import puppeteer from 'puppeteer';

it('renders 1 element', async() => {
    let browser = await puppeteer.launch({});
    let page = await browser.newPage();

    page.emulate({
        viewport: {
          width: 500,
          height: 2400,
        },
        userAgent: ''
      });

    await page.goto('http://localhost:3000', {waitUntil: 'networkidle0'});
    await page.content();
    const html = await page.waitForSelector('#result-0');

    expect(html).toBeTruthy();

    browser.close();
}, 16000);

it('renders 2 elements after clicking on Load More Results', async () => {
    let browser = await puppeteer.launch({});
    let page = await browser.newPage();

    page.emulate({
        viewport: {
          width: 500,
          height: 2400,
        },
        userAgent: ''
      });

    await page.goto('http://localhost:3000', {waitUntil: 'networkidle0'});
    await page.content();
    const button = await page.waitForSelector('#load-more-results');

    expect(button).toBeTruthy();

    await page.click("#load-more-results");

    const secondResult = await page.waitForSelector('#result-1');

    expect(secondResult).toBeTruthy();

    browser.close();
}, 16000);

it('hides the Load More Results button after loading the last page', async () => {
    let browser = await puppeteer.launch({});
    let page = await browser.newPage();

    page.emulate({
        viewport: {
          width: 500,
          height: 2400,
        },
        userAgent: ''
      });

    await page.goto('http://localhost:3000', {waitUntil: 'networkidle0'});
    await page.content();
    const button = await page.waitForSelector('#load-more-results');

    expect(button).toBeTruthy();

    let buttonNoLongerExists = false;

    // let totalPages;

    // await page.on('response', async response => {
    //      const data = await response.json();
    //     totalPages = data.search_info.count;
    // });

    while(1) {
        try {
            await page.click("#load-more-results"); 
        } catch(e) {
            buttonNoLongerExists = true;
            break;
        }

    }

    expect(buttonNoLongerExists).toBeTruthy();

    browser.close();

}, 16000);