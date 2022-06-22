const path = require('path');
const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const directory = path.join(__dirname, "/public");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", function (req, res) {
    res.sendFile(path.join(directory, "notes.html"));
});

app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function (req, res) {
    let newNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(newNotes[Number(req.params.id)]);
});

app.get("*", function (req, res) {
    res.sendFile(path.join(directory, "index.html"));
});

app.post("/api/notes", function (req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    let noteId = (savedNotes.length).toString();
    newNote.id = noteId;
    savedNotes.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
});

app.delete("/api/notes/:id", function (req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = req.params.id;
    let newId = 0;
    savedNotes = savedNotes.filter(currentNote => {
        return currentNote.id != noteId;
    });
    for (currentNote of savedNotes) {
        currentNote.id = newId.toString();
        newId++;
    }
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
});







app.listen(PORT , () => {
    console.log(`App Listening on PORT ${PORT}!`);
});


