# 监听未知错误

大部分情况下，异步的IO操作发生的错误无法被try catch捕获，如果没有捕获会导致程序退出，在Node.js中，如果一个抛出的异常没有被try catch捕获，会尝试将错误交给uncaughtException事件处理函数来进行处理，仅当没有注册该事件处理函数时才会导致进程直接退出。

```javascript
process.on('uncaughtException',function (err) {
    console.error('uncaughtException: %s',erro.stack);
});
```