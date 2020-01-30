var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(express.static("db"));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    var notes = fs.readFileSync(path.join(__dirname, "./db/db.json"));
    return res.send(JSON.parse(notes));
});

app.post("/api/notes", function (req, res) {
    var saveNote = req.body;
    fs.readFile(path.join(__dirname, "/db/db.json"), function(err, data) {
        var parseData = JSON.parse(data);
        parseData.push(saveNote);
        for (i = 0; i < parseData.length; i++) {
            parseData[i].id = i;
        }
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(parseData), "UTF8", (error) =>{
            if (error) throw error;
        });
    });
    return res.send(req.body.data)
});

app.delete("/api/notes/:id", function (req, res) {
    
    var chosenNote =req.params.id;

    fs.readFile(path.join(__dirname, "/db/db.json"), function(err, data) {
        var parseData = JSON.parse(data);
        
        for (i = 0; i < parseData.length; i++){
            if (chosenNote === parseData[i]) {
                parseData.splice(i, 1);
                return parseData;
            }
        };
        for (i = 0; i < parseData.length; i++){
            parseData[i].id = i;
        };
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(parseData), "UTF8", (error) =>{
            if (error) throw error;
        });
        console.log(parseData);
    });
});



app.listen(PORT, function () {
    console.log("App listening on http://localhost:" + PORT);
});
