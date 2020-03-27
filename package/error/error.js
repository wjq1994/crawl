
process.on('uncaughtException',function (err) {
    console.error('uncaughtException: %s',err.stack);
});

function go() {
    try {
        setTimeout(() => {
            console.log(a)
        }, 1000)
    } catch (error) {
        console.log(error);
    } 
}

go()

setTimeout(() => {
    console.log("after go");
}, 3000)