const {query} = require('../db');
const debug = require('debug')('crawl:write:articles');
const fs = require('fs');
const sendMail = require('../mail');
//保存文章的详情和文章和标签的关系
let articles = async function(articleList) {
    debug(`写入文章列表`);
    for(let article of articleList) { //循环文章数组的每一个元素
        let oldArticles = await query(`select * from articles where id = ? limit 1`, [article.id])
        try {
            if(Array.isArray(oldArticles) && oldArticles.length > 0) {
                let oldArticle = oldArticles[0];
                await query(`update articles set title=?, content=?, href=? where id=?`, [article.title, article.content, article.href, article.id])
            } else {
                await query(`insert into articles(id, title, href,content) values(?,?,?,?)`, [article.id, article.title, article.href, article.content])
            }
        } catch (error) {
            debug(error)
        }
    
        //处理文章和标签的关系 一般简单处理 全部删除 再全部插入
        await query(`delete from article_tag where article_id = ?`, [article.id]);
        let where = "'" + article.tagNames.join("','") + "'";//['前端', ']
        //按照标签的名称去查询标签
        const tagSQL = `select id from tags where name in (${where})`;
        let tagIds = await query(tagSQL);//[{id:1,id:2}]
        for(row of tagIds) {
            await query(`insert into article_tag(article_id, tag_id) values(?,?)`,[article.id, row.id])
        }
        let tagIdsString = tagIds.map(item => item.id).join(',');// 1,2
        //从此我们要向所有订阅了此标签的用户发送邮件
        const emailSQL = `select distinct users.email from user_tag inner join users on user_tag.user_id = users.id
         where tag_id in (${tagIdsString});`;
        const emails = await query(emailSQL); 
        for(let i=0;i<emails.length;i++) {
            debug(`开始发送邮件`, emails[i].email, article.title);
            await sendMail(emails[i].email, `你订阅的文章更新了`, `<a href="http://localhost:3000/detail/${article.id}">${article.title}</a>`)
        }
    }
}

module.exports = {
    articles
}