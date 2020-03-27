/**
 * puppeteer是Chrome团队开发的一个node库
 * 可以通过api来控制浏览器的行为，比如点击，跳转，刷新，在控制台执行js脚本等等
 * 通过这个工具可以用来写爬虫，自动签到，网页截图，生成pdf，自动化测试等
 */

(async () => {
    const browser = await puppeteer.launch();//打开浏览器
    const page = await browser.newPage();//打开一个空白页
    await page.goto('https://www.baidu.com');//在地址栏输入网址并等待加载
    await page.screenshot({ path: 'baidu.png' });//截个图
    await browser.close();//关掉浏览器
})();