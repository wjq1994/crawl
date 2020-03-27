async function aaa() {
    await new Promise((resolve, reject) => {
        setTimeout(async () => {
            console.log(22222);
            resolve(111111)
        }, 3000);
    })
    
}

async function run() {
    console.log(11111)
    await aaa();
    console.log(33333)
}

run();