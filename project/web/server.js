let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
let {checkLogin} = require('./middleware/auth');
const elasticsearch = require('../elasticsearch');
let app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({}));
app.use(session({
    resave: true, //每次都要重新保存session
    saveUninitialized: true, //保存未初始化的session
    secret: 'zfpx' //指定秘钥
}));
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
})
let path = require('path');
let {query} = require('../db');
let debug = require('debug')('crawl:web:server');
let port = 3000;
app.set('view engine','html');
app.set('views',path.resolve(__dirname, 'views'));
app.engine('html',require('ejs').__express);
app.get('/', async function(req, res) {
    let tagId = req.query.tagId;
    let tags = await query(`select * from tags`);  //查询所有的标签对象
    tagId = tagId || tags[0].id;                        //查询标签的ID
    let articles = await query(`select articles.* from article_tag inner join articles on article_tag.article_id = articles.id where article_tag.tag_id = ?`, [tagId])
    res.render('index', {
        tags,
        articles
    })
    let CronJob = require('cron').CronJob;
    let job = new CronJob('*/30 * * * * *', function() {
        debug('开始之行更新计划'); //node ../main.js
        let task = spawn(process.execPath, [path.resolve(__dirname, '../main')]);
        task.stdout.pipe(process.stdout);//把子进程里的正常输出重定向到父进程里
        task.stderr.pipe(process.stderr);//把子进程里的错误输出重定向到父进程里
        child.on('close', function() {
            console.log('更新任务完毕');
        })
    })
})
app.get('/detail/:id',async function (req,res) {
    let id=req.params.id;
    let articles = await query(`SELECT * FROM articles WHERE id=? `,[id]);
    res.render('detail',{article:articles[0]});
});
app.get('/login', async function (req, res) {
    res.render('login', { title: '登录' });
});
app.post('/login', async function (req, res) {
    let { email } = req.body;
    let oldUsers = await query(`SELECT * FROM users WHERE email=?`, [email]);
    let user;
    if (Array.isArray(oldUsers) && oldUsers.length > 0) {
        user = oldUsers[0];
    } else {
        let result = await query(`INSERT INTO users(email) VALUES(?)`, [email]);
        user = {
            id: result.insertId,
            email
        }
    }
    req.session.user = user;
    res.redirect('/');//如果登录成功，则把当前的用户信息放在会话中，并且重定向到首页
});
app.get('/search', async function (req, res) {
    res.render('search', { title: '登录',articles: []});
});
app.post('/search', async function (req, res) {
    let {keyword} = req.body;
    let result = await elasticsearch.search({
        index: 'crawl',
        body: {
            query: {
                match: {
                    title: keyword
                }
            }
        }
    });
    let hits = result.body.hits.hits;
    let articles = hits.map(item => item._source);
    res.render('search', { title: '搜索', articles});
});
app.get('/subscribe',checkLogin, async function (req, res) {
    let tags = await query(`SELECT * FROM tags`);
    let user = req.session.user;//{id,name}
    let selectedTags = await query(`SELECT tag_id from user_tag WHERE user_id = ?`, [user.id]);
    let selectTagIds = selectedTags.map(item => item['tag_id']);
    tags.forEach(item => {
        item.checked = selectTagIds.indexOf(item.id) != -1 ? 'true' : 'false';
    });
    res.render('subscribe', { title: '请订阅你感兴趣的标签', tags });
});
app.post('/subscribe', checkLogin, async function (req, res) {
    let { tags } = req.body;//[ '1', '2', '9' ] }
    let user = req.session.user;//{id,name}
    await query(`DELETE FROM user_tag WHERE user_id=?`, [user.id]);
    if (tags === null || tags === undefined) {
        debug("没有选择数据");
        res.redirect('back');
        return;
    }
    if (Array.isArray(tags)) {
        for (let i = 0; i < tags.length; i++) {
            await query(`INSERT INTO user_tag(user_id,tag_id) VALUES(?,?)`, [user.id, parseInt(tags[i])])
        }
    } else {
        await query(`INSERT INTO user_tag(user_id,tag_id) VALUES(?,?)`, [user.id, parseInt(tags)])
    }
    
    res.redirect('back');
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))