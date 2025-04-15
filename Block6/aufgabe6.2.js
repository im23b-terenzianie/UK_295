const express = require('express');
const app = express();
const port = 3000;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

const books = [
  { isbn: "9783161484100", title: "Der Herr der Ringe", author: "J.R.R. Tolkien" },
  { isbn: "9783825530176", title: "Die unendliche Geschichte", author: "Michael Ende" },
  { isbn: "9783608950123", title: "Effi Briest", author: "Theodor Fontane" }
];

const lends = [
  {
    id: 1,
    customer_id: "K1001",
    isbn: "9783161484100",
    borrowed_at: "2025-04-15T12:00:00Z",
    returned_at: null
  },
  {
    id: 2,
    customer_id: "K1002",
    isbn: "9783825530176",
    borrowed_at: "2025-04-10T14:30:00Z",
    returned_at: "2025-04-12T16:45:00Z"
  },
  {
    id: 3,
    customer_id: "K1003",
    isbn: "9783608950123",
    borrowed_at: "2025-04-14T09:15:00Z",
    returned_at: null
  }
];

// GET /books - Gibt alle Bücher zurück
app.get('/books', (req, res) => {
  res.status(200).send(books);
});

// GET /books/:isbn - Gibt ein bestimmtes Buch zurück
app.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find(b => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Buch nicht gefunden" });
  }
  res.status(200).send(book);
});

// POST /books - Fügt ein neues Buch hinzu. Validierung: Titel muss vorhanden sein.
app.post('/books', (req, res) => {
  const newbook = req.body;
  if (!newbook.title || newbook.title.trim() === "") {
    return res.status(400).json({ message: "Buch ohne Titel kann nicht erstellt werden" });
  }
  newbook.isbn = newbook.isbn.trim();
  newbook.title = newbook.title.trim();
  newbook.author = newbook.author.trim();
  books.push(newbook);
  res.status(201).send(newbook);
});

// PUT /books/:isbn - Überschreibt ein bestehendes Buch
app.put('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const index = books.findIndex(b => b.isbn === isbn);
  if (index === -1) {
    return res.status(404).json({ message: "Buch nicht gefunden" });
  }
  const updatedBook = req.body;
  updatedBook.isbn = updatedBook.isbn.trim();
  updatedBook.title = updatedBook.title.trim();
  updatedBook.author = updatedBook.author.trim();
  books[index] = updatedBook;
  res.status(200).send(books[index]);
});

// DELETE /books/:isbn - Löscht ein Buch
app.delete('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const index = books.findIndex(b => b.isbn === isbn);
  if (index === -1) {
    return res.status(404).json({ message: "Buch nicht gefunden" });
  }
  books.splice(index, 1);
  res.status(200).send(books);
});

// PATCH /books/:isbn - Teilweises Aktualisieren eines Buches
app.patch('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books.find(b => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Buch nicht gefunden" });
  }
  const updates = req.body;
  Object.keys(updates).forEach(key => {
    if (key !== 'isbn') {
      book[key] = typeof updates[key] === "string" ? updates[key].trim() : updates[key];
    }
  });
  res.status(200).send(book);
});

// GET /lends - Gibt alle Ausleihen zurück
app.get('/lends', (req, res) => {
  res.status(200).send(lends);
});

// GET /lends/:id - Gibt eine bestimmte Ausleihe zurück
app.get('/lends/:id', (req, res) => {
  const id = Number(req.params.id);
  const lend = lends.find(l => l.id === id);
  if (!lend) {
    return res.status(404).json({ message: "Ausleihe nicht gefunden" });
  }
  res.status(200).send(lend);
});

// POST /lends - Erstellt einen neuen Lend-Eintrag (Ausleihe).
// Validierungen: Das Buch muss existieren und darf nicht bereits ausgeliehen sein.
app.post('/lends', (req, res) => {
  const { customer_id, isbn } = req.body;
  if (!customer_id || !isbn) {
    return res.status(400).json({ message: "Die Felder 'customer_id' und 'isbn' sind erforderlich." });
  }
  // Prüfen, ob das Buch existiert
  const book = books.find(b => b.isbn === isbn.trim());
  if (!book) {
    return res.status(400).json({ message: "Lend kann nicht erfasst werden, wenn das Buch nicht existiert" });
  }
  // Prüfen, ob das Buch bereits verliehen ist (returned_at == null)
  const alreadyLent = lends.find(l => l.isbn === isbn.trim() && l.returned_at === null);
  if (alreadyLent) {
    return res.status(400).json({ message: "Dasselbe Buch kann nicht mehrfach gleichzeitig ausgeliehen werden" });
  }
  const newId = lends.length > 0 ? Math.max(...lends.map(lend => lend.id)) + 1 : 1;
  const newLend = {
    id: newId,
    customer_id: customer_id.trim(),
    isbn: isbn.trim(),
    borrowed_at: new Date().toISOString(),
    returned_at: null
  };
  lends.push(newLend);
  res.status(201).send(newLend);
});

// DELETE /lends/:id - Bringt ein Buch zurück (löscht einen Lend-Eintrag)
app.delete('/lends/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = lends.findIndex(lend => lend.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Ausleihe nicht gefunden" });
  }
  lends.splice(index, 1);
  res.status(200).send({ message: "Ausleihe wurde gelöscht" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
