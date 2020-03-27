let request = require('request');

request('https://juejin.im/tag/%E5%89%8D%E7%AB%AF', (err, response, body) => {
    let regexp = /class="title" data-v-\w+>(.+?)<\/a>/g;
    let titles = [];
    body.replace(regexp, (matched, title) => {
        titles.push(title);
    });
    console.log(titles);
});


