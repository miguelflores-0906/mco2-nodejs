const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = mysql.createPool({
    host: 'mco2-stadvdb-node3.mysql.database.azure.com',
    user: 'narwhal_',
    password: 'Qwerty12345',
    database: 'imdb_ijs',
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/getAll', (req, res) => {
    const sqlQuery = 'SELECT * FROM movies LIMIT 10';
    db.query(sqlQuery, (err, result) => {
        if (err) {
            return console.log(err);
        }
        return res.send(result);
    });
});

app.post('/addMovie', (req, res) => {
    const name = req.body.name;
    const year = req.body.year;
    const rank = req.body.rank;

    const sqlInsert = `INSERT INTO movies VALUES (UUID(), ?, ?, ?)`;
    db.query(sqlInsert, [name, year, rank], (err, result) => {
        if (err) {
            return console.log(err);
        }
        res.send('ADDED MOVIE');
        return console.log(result);
    });
});

app.post('/deleteThis', (req, res) => {
    const UUID = req.body.UUID;
    const name = req.body.name;
    const year = req.body.year;

    const sqlDelete = `DELETE FROM movies WHERE UUID=? AND name=? AND year=?`;
    db.query(sqlDelete, [UUID, name, year],(err, result) => {
        if (err) {
            return console.log(err);
        }
        res.send(result);
        return console.log(result);
    });
});

app.get('/search', (req, res) => {
    const sqlQuery = `SELECT * FROM movies WHERE name like "Spider-man%"`;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            return console.log(err);
        }
        res.send(result);
        return console.log(result);
    });
});


app.listen(5000, () => {
    console.log('Connected!');
});
