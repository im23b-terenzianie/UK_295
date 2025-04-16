const express = require('express');
const app = express();
const port = 3001;
app.use(express.json());

const user = 'zli';
const pass = 'zli1234';

app.get('/public',(req,res)=>{
    res.send('Dies ist der öffentliche Bereich.');
    res.status(200)
})

app.get('/private/:username/:password',(req,res)=>{
    const username = req.params.username 
    const password = req.params.password
    if (username === user && password === pass){
        res.send('dies ist der private Bereich')
        res.status(200) 
    } else {
        res.status(401)
    }
    
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });