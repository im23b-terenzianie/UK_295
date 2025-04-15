const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const books = [
    { isbn: "9783161484100", title: "Der Herr der Ringe", author: "J.R.R. Tolkien" },
    { isbn: "9783825530176", title: "Die unendliche Geschichte", author: "Michael Ende" },
    { isbn: "9783608950123", title: "Effi Briest", author: "Theodor Fontane" }
  ]
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


app.listen(port, (req,res) => {
    console.log(`Example app listening on port ${port}`);
  });