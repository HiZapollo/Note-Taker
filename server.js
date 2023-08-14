const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

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

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if(title && text){
        const newNote = {
            title,
            text,
        };

        //const noteString = JSON.stringify(newNote);

        fs.readFile('/db/db.json', (err, data) => {
            if(err){
                console.log(err);
            } else {
                const parsedNote = JSON.parse(data);
                parsedNote.push(newNote);
                fs.writeFile(`/db/db.json`, JSON.stringify(parsedNote), (err) => {
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