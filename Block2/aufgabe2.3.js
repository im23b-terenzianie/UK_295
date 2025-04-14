const { resolve } = require("path");

function simuliereVerzoegerung(ms){
    return new Promise (resolve =>{
        setTimeout(resolve,ms)
    })
};
async function addiereNachVerzoegerung(a,b, ms) {
    await simuliereVerzoegerung(ms);
    result = a + b;
    console.log(result)
}
addiereNachVerzoegerung(1,3,10000)