const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const dbnode1 = mysql.createPool({
    host: 'mc02-node1.mysql.database.azure.com',
    user: 'Wolf',
    password: 'HiJxx8owM9^U9hPU8K',
    database: 'imdb_ijs',
});

const dbnode2 = mysql.createPool({
    host: 'mc02-stadvdb-grp10-node2.mysql.database.azure.com',
    user: 'Wolf',
    password: 'Qwerty12345',
    database: 'imdb_ijs',
});

const dbnode3 = mysql.createPool({
    host: 'mc02-stadvdb-node3.mysql.database.azure.com',
    user: 'narwhal_',
    password: 'Qwerty12345',
    database: 'imdb_ijs',
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/getAll', (req, res) => {
    const sqlQuery = 'SELECT * FROM movies LIMIT 10';
    dbnode1.query(sqlQuery, (err, result) => {
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
    dbnode1.query(sqlInsert, [name, year, rank], (err, result) => {
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
    dbnode1.query(sqlDelete, [UUID, name, year], (err, result) => {
        if (err) {
            return console.log(err);
        }
        res.send(result);
        return console.log(result);
    });
});

app.get('/search', (req, res) => {
    const sqlQuery = `SELECT * FROM movies WHERE name like "Spider-man%"`;
    dbnode1.query(sqlQuery, (err, result) => {
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
