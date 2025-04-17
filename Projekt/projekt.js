const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const uuid = require("uuid");

app.use(cookieParser());
app.use(express.json());

const JWT_SECRET = 'secretpsst';
let users = [{ username: "1", password: "1" }];
let tasks = [];

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username == username && u.password == password);
    if (!user) return res.status(401).json({ message: "Invalide credentials" });

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 360000 });
    res.status(200).json({ message: 'Login succesfully' });
});

function auth(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Kein Token' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Ungültiges Token' });
    }
}

app.get('/tasks', auth, (req, res) => {
    res.status(200).send(tasks);
});

app.post("/tasks", auth, (req, res, next) => {
    try {
        const { title, descreption, done, duedate } = req.body;
        if (!title || !descreption || !duedate) {
            return res.status(400).json({ message: "Unzureichende daten" });
        }
        const id = uuid.v4();
        const newtask = { id, title, descreption, done, duedate };
        tasks.push(newtask);
        res.status(201).send(newtask);
    } catch (err) {
        next(err);
    }
});

app.get("/tasks/:id", auth, (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) return res.status(404).json({ message: "Task nicht gefunden" });
    res.status(200).send(task);
});

app.patch("/tasks/:id", auth, (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) return res.status(404).json({ message: "Task nicht gefunden" });

    const { title, descreption, done, duedate } = req.body;
    if (title) task.title = title;
    if (descreption) task.descreption = descreption;
    if (typeof done === 'boolean') task.done = done;
    if (duedate) task.duedate = duedate;

    res.status(200).send(task);
});

app.delete("/tasks/:id", auth, (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return res.status(404).json({ message: "Task nicht gefunden" });
    tasks.splice(index, 1);
    res.status(200).json({ message: "Task gelöscht" });
});

app.get('/verify', auth, (req, res) => {
    const user = req.user;
    res.status(200).json({ message: 'Cookie', user });
});

app.delete('/logout', auth, (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout sucessfully' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Interner Serverfehler' });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
