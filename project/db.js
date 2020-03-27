const mysql=require('mysql');
var Promise = require('bluebird');
const connection = mysql.createConnection({
    host:            'localhost',   // 数据库地址
    port:            3306,          // 数据库端口
    database:        'crawl',   // 数据库名称
    user:            'root',        // 数据库用户
    password:        '123456'             // 数据库用户对应的密码
});
connection.connect();
module.exports={
    query:Promise.promisify(connection.query).bind(connection),
    end:connection.end
}