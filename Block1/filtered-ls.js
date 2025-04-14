const fs = require('fs');
let endswith = process.argv[3];
const files = [];
const filetype= "." + endswith
fs.readdir(process.argv[2], (err, list) =>{

    list.forEach(element => {
        if (element.endsWith(filetype)){
            files.push(element)
        }; 
    
    });
    files.forEach(element => {
        console.log(element)
    });
})
