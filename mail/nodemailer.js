const nodemailer = require('nodemailer');
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

let mailOptions = {
    from: '1194497392@qq.com',//发件地址
    to: '1194497392@qq.com',//收件地址
    subject: '你订阅的文章更新了',//邮件标题
    html:'<a href="http://localhost:3000/detail/5e70326ae51d4526c932d2c0">刚刚！GitHub 宣布收购 npm</a>'//这是内容
}

transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.error(err);
    }
    console.log('邮件已经发送', info);
})