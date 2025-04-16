const express = require('express');
const app = express();
const port = 3000;
var session = require('express-session');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let users = []
let authenticated = false;

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));
let currentuser = "";
// Beispiel-Datenarray für Bücher
const books = [
    { isbn: "9783161484100", title: "Der Herr der Ringe", author: "J.R.R. Tolkien" },
    { isbn: "9783825530176", title: "Die unendliche Geschichte", author: "Michael Ende" },
    { isbn: "9783608950123", title: "Effi Briest", author: "Theodor Fontane" }
];

// Endpunkte für Bücher

// GET /books – gibt alle Bücher als JSON zurück
app.get('/books', (req, res) => {
    res.json(books);
});

// GET /books/:isbn – gibt ein einzelnes Buch zurück
app.get('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    if (!book) {
        return res.status(404).json({ message: "Buch nicht gefunden" });
    }
    res.json(book);
});

// POST /books – erstellt ein neues Buch (erwartet { isbn, title, author } im Body)
app.post('/books', (req, res) => {
    const { isbn, title, author } = req.body;
    if (!isbn || !title || !author) {
        return res.status(400).json({ message: "Fehlende Felder: isbn, title und author sind erforderlich." });
    }
    const newBook = {
        isbn: isbn.trim(),
        title: title.trim(),
        author: author.trim()
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

// PUT /books/:isbn – überschreibt ein bestehendes Buch
app.put('/books/:isbn', (req, res) => {
    // Wenn IDs als Zahl gespeichert wären, hier in Number umwandeln. In diesem Fall arbeiten wir mit Strings.
    const isbn = req.params.isbn;
    const index = books.findIndex(b => b.isbn === isbn);
    if (index === -1) {
        return res.status(404).json({ message: "Kein Buch mit der ISBN gefunden" });
    }
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).json({ message: "Fehlende Felder: title und author sind erforderlich." });
    }
    const updatedBook = {
        isbn,
        title: title.trim(),
        author: author.trim()
    };
    books[index] = updatedBook;
    res.json(updatedBook);
});

// DELETE /books/:isbn – löscht ein Buch
app.delete('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const index = books.findIndex(b => b.isbn === isbn);
    if (index === -1) {
        return res.status(404).json({ message: "Buch nicht gefunden" });
    }
    books.splice(index, 1);
    res.json({ message: "Buch gelöscht" });
});

// PATCH /books/:isbn – aktualisiert ein Buch teilweise
app.patch('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    if (!book) {
        return res.status(404).json({ message: "Buch nicht gefunden" });
    }
    const updates = req.body;
    Object.keys(updates).forEach(key => {
        if (key !== 'isbn' && updates[key]) {
            book[key] = typeof updates[key] === "string" ? updates[key].trim() : updates[key];
        }
    });
    res.json(book);
});



let lends = [
    {
        id: 1,
        isbn: "9783552059087",
        customer_id: 1,
        borrowed_at: new Date().toISOString(),
        returned_at: null
    }
];

// GET /lends – gibt alle Ausleihen zurück
app.get('/lends', (req, res) => {
    console.log("accessing lends", req.session, req.session.auth);
    console.log("lends", lends)
    if (req.session.authenticated) {
        res.json(lends);
    } else {
        res.status(400).send("Not available")
    }
});

// GET /lends/:id – gibt eine bestimmte Ausleihe zurück
app.get('/lends/:id', (req, res) => {
    if (req.session.authenticated) {
        const id = Number(req.params.id);
        const lend = lends.find(l => l.id === id);
        if (!lend) return res.status(404).json({ message: "Ausleihe nicht gefunden" });
        res.json(lend);
    } else {
        res.status(400)
    }
});

// POST /lends – erstellt einen neuen Lend-Eintrag
app.post('/lends', (req, res) => {
    if (req.session.authenticated) {
        const newLend = req.body;
        newLend.id = lends.length + 1;
        newLend.borrowed_at = new Date().toISOString();
        newLend.returned_at = null;

        // Beispielhaft einfache Validierung
        if (!newLend.isbn || !newLend.customer_id) {
            return res.status(400).json({ message: "isbn und customer_id sind erforderlich." });
        }

        lends.push(newLend);
        res.status(201).json(newLend);
    } else {
        res.status(400)
    }
});


app.patch('/lends/:id', (req, res) => {
    if (req.session.authenticated) {
        const lendIndex = lends.findIndex(lend => lend.id == req.params.id);
        if (lendIndex < 0) return res.status(404).json({ message: "Ausleihe nicht gefunden" });
        const updateParams = (({ isbn, customer_id, returned_at }) => ({ isbn, customer_id, returned_at }))(req.body);
        const updatedLend = { ...lends[lendIndex], ...updateParams };
        lends.splice(lendIndex, 1, updatedLend);
        res.json(updatedLend);
    } else {
        res.status(400)
    }
});

// Login-Formular (zum Beispiel)
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentuser = user;
        authenticated = true;
        req.session.authenticated = authenticated
        res.redirect("/lends")
    }
})
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});
app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const id = users.length + 1;
    let newuser = {
        id,
        username,
        password,
    }
    users.push(newuser)
    console.log(users)
    res.redirect("/login")
})
app.get('/verify', (req, res) => {
    if (req.session.authenticated) {
        res.status(200).send(currentuser.username)
    } else {
        res.status(400)
    }
})
app.delete('/logout', (req, res) => {
    authenticated = false;
    req.session.authenticated = authenticated
    res.status(204)
})
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
