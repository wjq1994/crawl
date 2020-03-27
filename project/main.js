let read = require('./read');
let write = require('./write');
let debug = require('debug')('crawl:main');
let tagsUrl = 'https://juejin.im/subscribe/all';//所有的标签列表
(async function() {
    let tags = await read.tags(tagsUrl);
    await write.tags(tags);
    let allArticles = {};
    for(let tag of tags) {
        //先获取 每个标签下面的文章列表
        let articles = await read.articles(tag.url, tag.name);
        //因为不同标签下面的文章可能有重复，所以要去重
        articles.forEach(item => {
            allArticles[item.id] = item;
        });
    }
    //Object.keys Object.values Object.entries
    await write.articles(Object.values(allArticles));
    debug("process.exit");
    //程序退出 可能会导致 推送邮件未完成
    process.exit();
})()