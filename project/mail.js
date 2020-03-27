const nodemailer = require('nodemailer');
const debug = require('debug')('crawl:mail');
const Promise = require('bluebird');
let transporter = nodemailer.createTransport({
    service: 'QQ', //指定邮件
    port: 465, //smtp端口发邮件的端口号
    secureConnection: true, //使用ssl，加密传输服务
    auth: {//权限认证
        user: '1194497392@qq.com',
        // 注意，这个不是你的qq密码，而是一个授权码
        pass: 'sczneblyyhopfebi'//这是我的授权码
    }
});

async function sendMail(to, subject, html) {
    debug(to, subject, html)
    let mailOptions = {
        from: '1194497392@qq.com',//发件地址
        to,
        subject,
        html
    }

    await Promise.promisify(transporter.sendMail).call(transporter, mailOptions, async (err, info) => {
        if (err) {
            debug(err);
        }
        debug('邮件已经发送', info);
    })
}

module.exports = sendMail;