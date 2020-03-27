/**
 * 登录密码加密
 * 算法模式：ECB
 * 密钥长度：128
 * 密钥: PAY_DAY_LOAN_PWD
 * 加密结果编码方式: base64
 */
const CryptoJS = require("crypto-js");
/**
 * 加密
 */
const encrypt = (word, keyWord) => {
    var key = CryptoJS.enc.Utf8.parse(keyWord);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
    });
    return encrypted.toString();
};

/**
 * 解密
 */
const decrypt = (word, keyWord) => {
    var key = CryptoJS.enc.Utf8.parse(keyWord);
    var decrypt = CryptoJS.AES.decrypt(word, key, {
        mode: CryptoJS.mode.ECB,
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};

console.log(encrypt("17600698599", "1de11b884b0139815aa13104342c1c63"))

// const crypto = require('crypto');
// // 密钥
// const Key = 'PAY_DAY_LOAN_PWD';
// // 加密结果编码方式
// const OutputEncoding = 'base64'

// // 加密
// function aesEncrypt(data, key) {
//     // 加密算法：aes-128-ecb aes-256-cbc  aes192
//     // 生成 cipher 实例
//     const cipher = crypto.createCipher('aes-128-ecb', key);
//     // update内容到cipher实例
//     var crypted = cipher.update(data, 'utf8', OutputEncoding);
//     // 输出加密串
//     crypted += cipher.final(OutputEncoding);
//     return crypted;
// }

// // 解密
// function aesDecrypt(encrypted, key) {
//     const decipher = crypto.createDecipher('aes-128-ecb', key);
//     var decrypted = decipher.update(encrypted, OutputEncoding, 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
// }
