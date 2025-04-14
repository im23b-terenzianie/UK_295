const http = require('http');
let results =[];
let count = 0;
let i= 0;
function fetch(i){
    http.get(process.argv[i + 2],(response)=>{
        response.setEncoding('utf8')
        let fullData="";
        response.on('data',(chunk) => {
            fullData += chunk
        });
        response.on('end', ()=>{
            results[i] = fullData
            count++
            if (count===3){
                results.forEach(element => {
                    console.log(element)
                });
            }
        })
    })
};
fetch(0);
fetch(1);
fetch(2);