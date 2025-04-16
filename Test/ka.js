const express = require('express');
const app = express();
const port = 3000;
const cors = require("cors")
app.use(express.json());
app.use(cors());
let books = [
  ];

  app.get('/books',(req,res)=>{
    res.send(books)
  });
  app.get('/books/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const book = books.find(b=> b.id === id)
    if (!book) {
      return res.status(404).json({ message: "Buch nicht gefunden" })
    }
    res.status(200).json(book)
  });
  app.post('/books',(req,res)=>{
    const {title, author, year} = req.body;
    if (!title || !author){
      return res.status(400).json({ error: "Title and author are required" });
    }
    if(year && typeof year !== 'string' && year.length == 4){
      return res.status(400).json({ error: "Invalide data type for year" });
    }else{     const id = books.length + 1;
      let newbook ={
        id,
        title,
        author,
          year,
      }
      books.push(newbook)
      return res.json({...newbook})}
  });
  app.delete('/books/:id',(req,res)=>{
    const id = req.params.id;
    const i = books.findIndex(b=> b.id === id);
    books.splice([i],1) 
    res.send("succesfully deleted")
  })
  app.put('/books/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const i = books.findIndex(b=> b.id === id);
    if(i === -1){
      res.status(400).json({message:"Kein buch mit der ID gefunden"})
    } else{
      const {title, author, year} = req.body;
      if (!title || !author){
        return res.status(400).json({ message: "Fehlende Felder: title und author sind erforderlich." });
      } else{
        let updatedBook ={
          id,
          title,
          author,
          year,
        }
        books[i] = updatedBook
        res.json(updatedBook)
      }
    }
  })
  app.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening on port ${port}`);
  });