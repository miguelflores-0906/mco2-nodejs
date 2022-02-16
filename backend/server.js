const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const inProduction = process.env.NODE_ENV === 'production';

app.use(
    cors({
        origin: inProduction ? '' : 'http://localhost:3000',
        credentials: true,
    })
);

const PORT = process.env.PORT || 5000;

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
    const sqlQuery = 'SELECT * FROM movies LIMIT 50';

    const getData = async () => {
        const result = await dbnode1.query(sqlQuery);
        return res.send(result);
    };

    try {
        getData(); // async function
    } catch (error) {
        console.error(error);
    }
    // dbnode1.query(sqlQuery, (err, result) => {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     return res.send(result);
    // });
});

app.post('/addMovie', (req, res) => {
    let name = req.body.name;
    let year = req.body.year;
    let rank = req.body.rank;
    if (rank === '') {
        rank = null;
    }

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

    console.log(UUID);
    console.log(name);
    console.log(year);

    const sqlDelete = `DELETE FROM movies WHERE UUID=? AND name=? AND year=?`;
    dbnode1.query(sqlDelete, [UUID, name, year], (err, result) => {
        if (err) {
            return console.log(err);
        }
        res.send(result);
        return console.log(result);
    });
});

app.post('/search', (req, res) => {
    let searchTerm = req.body.searchTerm;
    searchTerm = '%' + searchTerm + '%';
    const sqlSearch = 'SELECT * FROM movies WHERE `name` like ?';
    dbnode1.query(sqlSearch, [searchTerm], (err, result) => {
        if (err) {
            return console.log(err);
        }
        res.send(result);
        return;
    });
});

app.post('/updateMovie', (req, res) => {
    let UUID = req.body.UUID;
    let name = req.body.name;
    let year = req.body.year;

    let rank = req.body.rank;
    if (rank === '') {
        rank = null;
    }

    const sqlUpdate = 'UPDATE movies SET `name`=?, `year`=?, `rank`=? WHERE UUID = ?;';

    dbnode1.query(sqlUpdate, [name, year, rank, UUID], (err, result) => {
        if (err) {
            return console.log(err);
        }
        res.send(result);
        return console.log(result);
    });
});

app.listen(PORT, () => {
    console.log('Connected!');
});
