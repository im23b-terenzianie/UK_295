const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const books = [
    { isbn: "9783161484100", title: "Der Herr der Ringe", author: "J.R.R. Tolkien" },
    { isbn: "9783825530176", title: "Die unendliche Geschichte", author: "Michael Ende" },
    { isbn: "9783608950123", title: "Effi Briest", author: "Theodor Fontane" }
  ]
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
app.get('/books',(req,res)=>{
    res.send(books)

});
app.get('/books/:isbn', (req,res)=>{
    const isbn = req.params.isbn;
    const book = books.find(b=> b.isbn === isbn)

    if (!book) {
        return res.status(404).json({ message: "Buch nicht gefunden" });
      }
});
app.post('/books',(req,res)=>{
    const newbook = req.body;
    newbook.isbn = newbook.isbn.trim();
    newbook.title = newbook.title.trim();
    newbook.author = newbook.author.trim();
    books.push(newbook);
    res.send(newbook)
})
app.put('/books/:isbn',(req,res)=>{
    const isbn = req.params.isbn;
    const index = books.findIndex(b => b.isbn === isbn);
    const updatedBook = req.body;
    updatedBook.isbn = updatedBook.isbn.trim();
    updatedBook.title = updatedBook.title.trim();
    updatedBook.author = updatedBook.author.trim();
    books[index] = updatedBook;
    res.send(books[index])
})
app.delete('/books/:isbn',(req,res)=>{
    const isbn = req.params.isbn
    const index = books.findIndex(b => b.isbn === isbn);
    books.splice(index,1)
    res.send(books)
});
app.patch('/books/:isbn',(req,res)=>{
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    const updates = req.body;
    Object.keys(updates).forEach(key=>{
        if (key !== 'isbn'){
            book[key] = typeof updates[key] === "string" ? updates[key].trim() : updates[key];
        }
    })
    res.send(books);
})
app.get('/lends',(req, res)=>{
    res.send(lends)
});
app.get('/lends/:id',(req,res)=>{
    const id = Number(req.params.id);
    const lend = lends.find(b=> b.id === id)
    res.send(lend)
});
app.post('/lends',(req,res)=>{
  const {customer_id, isbn} = req.body;
  const newId = lends.length > 0 ? Math.max(...lends.map(lend => lend.id)) + 1 : 1;
  const newlend ={
    id: newId,
    customer_id: customer_id.trim(),
    isbn: isbn.trim(),
    borrowed_at: new Date().toISOString(),
  }
  lends.push(newLend);
  res.send(newlend)
})
app.delete('/lend/:id',(req,res)=>{
  const id = Number(req.params.id);
  const index = lends.findIndex(lend => lend.id === id);
  lends.splice(index,1)
});
app.listen(port, (req,res) => {
    console.log(`Example app listening on port ${port}`);
  });