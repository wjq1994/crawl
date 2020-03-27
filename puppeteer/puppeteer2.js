/**
 * puppeteer是Chrome团队开发的一个node库
 * 可以通过api来控制浏览器的行为，比如点击，跳转，刷新，在控制台执行js脚本等等
 * 通过这个工具可以用来写爬虫，自动签到，网页截图，生成pdf，自动化测试等
 */

const puppeteer=require('puppeteer');
(async function () {
    const browser=await puppeteer.launch({headless:false});//启动浏览器
    let page = await browser.newPage();//创建一个 Page 实例
    await page.setJavaScriptEnabled(true);//启用javascript
    await page.goto("https://www.jd.com/");
    const searchInput = await page.$("#key");//获取元素
    await searchInput.focus(); //定位到搜索框
    await page.keyboard.type("手机");//输入手机
    const searchBtn = await page.$(".button");
    await searchBtn.click();
    await page.waitForSelector('.gl-item'); //等待元素加载之后，否则获取不了异步加载的元素
    const links = await page.$$eval('.gl-item > .gl-i-wrap > .p-img > a', links => {
        return links.map(a => {
            return {
                href: a.href.trim(),
                title: a.title
            }
        });
    });
    page.close();
    const aTags = links.splice(0, 1);
    for (var i = 0; i < aTags.length; i++) {
        page=await browser.newPage();
        page.setJavaScriptEnabled(true);
        await page.setViewport({//修改浏览器视窗大小
            width: 1920,
            height: 1080
        });
        var a = aTags[i];
        await page.goto(a.href, {timeout: 0});
        let filename = "items-" + i + ".png";
        await page.screenshot({
            path: filename,
            fullPage: true
        });
        page.close();
    }
    browser.close();
})();