/**
 * puppeteer是Chrome团队开发的一个node库
 * 可以通过api来控制浏览器的行为，比如点击，跳转，刷新，在控制台执行js脚本等等
 * 通过这个工具可以用来写爬虫，自动签到，网页截图，生成pdf，自动化测试等
 */

const puppeteer=require('puppeteer');
const fs=require('fs');
(async function () {
        const browser=await puppeteer.launch({headless:false});
        const page=await browser.newPage();
        await page.goto('https://juejin.im/tag/%E5%89%8D%E7%AB%AF', {
            waitUntil: 'networkidle2'
        });
        await page.waitFor(500);
        let comments = await page.$$eval('a.title', els => {
            return els.map(item => item.innerText);
        });
        fs.writeFileSync('comments.txt',comments.join('\r\n'),'utf8');
        await browser.close();
})();