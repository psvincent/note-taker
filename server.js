const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const notes = require('./Develop/db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(notes.slice(1));
});

function createNewNote(body, noteArray) {
    const newNote = body;
    if (!Array.isArray(noteArray))
    noteArray = [];

    if (noteArray.length === 0)
    noteArray.push(0);

    body.id = noteArray[0];
    noteArray[0]++;
    noteArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './Develop/db/db.json'),
        JSON.stringify(noteArray, null, 2)
    )
    return newNote;
};

app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, notes);
    res.json(newNote);
});

function deleteNote(id, noteArray) {
    for (let i = 0; i < noteArray.length; i++) {
        let deletedNote = noteArray[i];

        if (deletedNote.id == id) {
            noteArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './Develop/db/db.json'),
                JSON.stringify(noteArray, null, 2)
            );
            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, notes);
    res.json(true);
});

app.listen(PORT , () => {
    console.log(`App Listening on PORT ${PORT}!`);
});


