var session = require('express-session');
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        secure: false
    }
}));
app.post('/name',(req,res)=>{
    const name = req.body;
    req.session.name = name;
    res.status(201).send({ message: "Name gespeichert", name });

});
app.get('/name',(req,res)=>{
    res.send({name: req.session.name})
});
app.delete('/name',(req,res)=>{
    req.session.name = '';
    res.send({ message: "Name gelöscht"})
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });