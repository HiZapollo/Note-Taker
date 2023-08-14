const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.json());

app.use(express.static('public'));

// first two requests are simply to obtain the html files and display them
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// this gets the notes from the db and returns them to be displayed
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if(err){
            console.log(err);
        } else {
            const parsedReviews = JSON.parse(data);
            res.json(parsedReviews);
        }
    })
});

// adds a new note to the db
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if(title && text){
        const newNote = {
            title,
            text,
            id: uuid.v4()// unique id
        };

        fs.readFile('./db/db.json', (err, data) => {
            if(err){
                console.log(err);
            } else {
                const parsedNote = JSON.parse(data);
                parsedNote.push(newNote);
                fs.writeFile(`./db/db.json`, JSON.stringify(parsedNote), (err) => {
                    err
                        ? console.log(err)
                        : console.log(`Note '${newNote.title}' has been written successfully`)
                });
            }
        })

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error posting note');
    }
});

app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
});