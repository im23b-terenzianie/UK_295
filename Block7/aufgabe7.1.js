const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

const user = 'zli';
const pass = 'zli1234';

const auth = (req, res, next)=>{
    const auth = req.headers.authorization
    if (!auth){
        res.set('WWW-Authenticate','Basic')
        return res.status(401).send('Zugang benötigt')
    }
    const [username, password] = Buffer.from(auth.split(' ')[1],'base64').toString().split(':');
    if (username === user && password == pass ){
        next();
    } else {
        res.set('WWW-Authenticate', 'Basic');
    res.status(401).send('Ungültige Zugangsdaten');
    }
}
app.get('/public',(req,res)=>{
    res.send('Dies ist der öffentliche Bereich.');
    res.status(200)
})

app.get('/private',auth,(req,res)=>{
    res.send('dies ist der private Bereich')
    res.status(200)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
  
