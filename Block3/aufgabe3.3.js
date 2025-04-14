const express = require('express');
const app = express();
const port = 3002;

app.get('/now', async (req,res) => {
    const utc = new Date().toUTCString();
    res.send(utc)
})
app.get('/zli', async(req,res) => {
    res.redirect('https://www.zli.ch');
})
app.get('/name', async(req,res) => {
    const namen = [
        "Lena", "Max", "Mia", "Ben", "Lea",
        "Paul", "Anna", "Jonas", "Emma", "Noah",
        "Laura", "Leon", "Sophie", "Elias", "Marie",
        "Luca", "Julia", "Finn", "Nina", "Tim"
      ];
      res.send(namen[Math.floor(Math.random() * 20)])
})
app.get('/html', async(req,res)=>{
    const path = require('path')
    res.sendFile(path.join(__dirname, 'index.html'));
})
app.get('/image', async(req,res)=>{
    const path = require('path');
    res.sendFile(path.join(__dirname,'ka.jpg'));
})
app.get('/teapot', async(req,res)=>{
    res.status(418).send("🫖 I'm a teapot!");
})
app.get('/user-agent', async(req,res)=>{
    const userAgent = req.get('User-Agent');
  res.send(`Dein User-Agent ist: ${userAgent}`);
})
app.get('/secret', (req, res) => {
    res.status(403).send('Zutritt verboten 🚫');
  });
app.get('/xml', (req, res) => {
    const path = require('path');
  res.type('application/xml'); // Setzt Content-Type auf XML
  res.sendFile(path.join(__dirname, 'info.xml'));
});
app.get('/me', (req, res) => {
    res.json({
      vorname: "Enzo",
      nachname: "Testini",
    });
  });
app.listen(port, (req,res) => {
    console.log(`Example app listening on port ${port}`);
  });
