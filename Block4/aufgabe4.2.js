const express = require('express');
const app = express();
const port = 3004;
const { DateTime } = require('luxon');
const namen = [
    "Lena", "Max", "Mia", "Ben", "Lea",
    "Paul", "Anna", "Jonas", "Emma", "Noah",
    "Laura", "Leon", "Sophie", "Elias", "Marie",
    "Luca", "Julia", "Finn", "Nina", "Tim"
  ];
app.use(express.urlencoded({ extended: true }));


app.get('/now', (req,res)=>{
    const timezone = req.query.tz||'UTC';
    const now = DateTime.now().setZone(timezone)
    res.json({
        zeitzone: timezone,
        uhrzeit: now.toFormat('yyyy-LL-dd HH:mm:ss')
      });
})
app.get('/name', async(req,res) => {

  res.send(namen[Math.floor(Math.random() * namen.length)])

})
app.get('/names', (req,res)=>{
  const path = require('path');
  res.sendFile(path.join(__dirname, 'form.html'));
});

app.post('/names', (req, res) => {
    const neuerName = req.body.name;
    namen.push(neuerName.trim());
    res.send(`Name "${neuerName}" wurde hinzugefügt ✅`);
    console.log(namen)
});
app.delete('/names', (req, res) => {
  const nameToDelete = req.query.name;

  if (!nameToDelete) {
    return res.status(400).send('❌ Kein Name angegeben');
  }

  const index = namen.findIndex(n => n.toLowerCase() === nameToDelete.toLowerCase());

  if (index === -1) {
    return res.status(404).send('❌ Name nicht gefunden');
  }

  namen.splice(index, 1);
  res.status(204).send(); 
});

app.get('/secret2', (req, res) => {
  const auth = req.get('Authorization');

  if (auth === 'Basic aGFja2VyOjEyMzQ=') {
    return res.status(200).send('🔓 Zugriff gewährt');
  }

  res.status(401).send('🚫 Zugriff verweigert');
});
const fetch = require('node-fetch'); // Wenn du Node < 18 hast

app.get('/chuck', async (req, res) => {
  try {
    const name = req.query.name || 'Chuck Norris';
    const response = await fetch('https://api.chucknorris.io/jokes/random');
    const data = await response.json();

    const joke = data.value.replace(/Chuck Norris/g, name);

    res.json({ joke });
  } catch (err) {
    console.error(err);
    res.status(500).send('Fehler beim Abrufen des Witzes');
  }
});
app.get('/me', (req, res) => {
  res.json({
    vorname: "Enzo",
    nachname: "Testini",
  });
});

app.use(express.json()); // wichtig für JSON im Body

app.patch('/me', (req, res) => {
  const updates = req.body;

  // Nur die mitgeschickten Felder aktualisieren
  me = { ...me, ...updates };

  res.json({ message: 'Daten aktualisiert ✅', me });
});


app.listen(port, (req,res) => {
    console.log(`Example app listening on port ${port}`);
  });