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
    connectionLimit: 10,
    host: 'mc02-node1.mysql.database.azure.com',
    user: 'Wolf',
    password: 'HiJxx8owM9^U9hPU8K',
    database: 'imdb_ijs',
});

const dbnode2 = mysql.createPool({
    connectionLimit: 10,
    host: 'mc02-stadvdb-grp10-node2.mysql.database.azure.com',
    user: 'gianm',
    password: 'Qwerty12345',
    database: 'imdb_ijs',
});

const dbnode3 = mysql.createPool({
    connectionLimit: 10,
    host: 'mco2-stadvdb-node3.mysql.database.azure.com',
    user: 'narwhal_',
    password: 'Qwerty12345',
    database: 'imdb_ijs',
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// async function executeQuery(nodewanted, sqlQuery) {
//     const connection = await getConnectionToNode(nodewanted);
//     connection.query(sqlQuery, (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         return res.send(result);
//     });
//     connection.release();
// }

// async function getConnectionToNode(nodewanted) {
//     switch (nodewanted) {
//         case 'NODE 1':
//             return await dbnode1.getConnection();

//         case 'NODE 2':
//             return await dbnode2.getConnection();

//         case 'NODE 3':
//             return await dbnode3.getConnection();

//         default:
//             throw 'Node: ' + nodewanted + ' not found';
//     }
// }

app.get(
    '/getAll',
    (req, res) => {
        const sqlQuery = 'SELECT * FROM movies LIMIT 50';

        // let finalResult;

        // let data = await executeQuery('NODE 1', sqlQuery);
        // finalResult = data;
        // try {
        //     let data = await executeQuery('NODE 1', sqlQuery);
        //     finalResult = data;
        // } catch (error) {
        //     console.log('ERROR CONNECTING TO NODE1');
        //     console.error(error);

        //     try {
        //         let data = await executeQuery('NODE 2', sqlQuery);
        //         finalResult = data;
        //     } catch (error) {
        //         console.log('ERROR CONNECTING TO NODE2');
        //         console.error(error);
        //     }

        //     try {
        //         let data = await executeQuery('NODE 2', sqlQuery);
        //         finalResult = finalResult.concat(data);
        //     } catch (error) {
        //         console.log('ERROR CONNECTING TO NODE3');
        //         console.error(error);
        //     }
        // }
        // console.log(finalResult);
        // return res.send(finalResult);

        dbnode1.query(sqlQuery, (err, result) => {
            if (err) {
                dbnode2.query(sqlQuery, (err2, movies2) => {
                    if (!err2) {
                        dbnode3.query(sqlQuery, (err3, movies3) => {
                            if (!err3) {
                                let movies = movies2.concat(movies3);
                                return res.send(movies);
                            }
                            return console.log(err3);
                        });
                    }
                    return console.log(err2);
                });
                return console.log(err);
            }
            return res.send(result);
        });

        // dbnode1.getConnection((connecterr, connected) => {
        // if (connecterr) {
        // dbnode2.getConnection((connecterr2, connected2) => {
        //     if (connecterr2) {
        //         return console.log(connecterr2);
        //     }
        //     connected2.query(sqlQuery, (err2, movies2) => {
        //         if (err2) {
        //             return console.log(err2);
        //         }
        //         dbnode3.getConnection((connecterr3, connected3) => {
        //             if (connecterr3) {
        //                 return console.log(connecterr3);
        //             }
        //             connected3.query(sqlQuery, (err3, movies3) => {
        //                 if (err3) {
        //                     return console.log(err3);
        //                 }
        //                 let movies = movies2.concat(movies3);
        //                 return res.send(movies);
        //             });
        //         });
        //     });
        // });

        // connected.query(sqlQuery, (quererr1, result) => {
        //     if (quererr1) {
        //         console.log(quererr1);
        //     }
        //     res.send(result);
        // });
    }
    // });
    // }
);

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
            if (year >= 1980) {
                dbnode3.query(sqlInsert, [name, year, rank], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    return res.send(result);
                });
            } else {
                dbnode2.query(sqlInsert, [name, year, rank], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    return res.send(result);
                });
            }
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
            if (year >= 1980) {
                dbnode3.query(sqlDelete, [UUID, name, year], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    return res.send(result);
                });
            } else {
                dbnode2.query(sqlDelete, [UUID, name, year], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    return res.send(result);
                });
            }
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
            dbnode2.query(sqlSearch, (err, movies2) => {
                if (!err) {
                    dbnode3.query(sqlSearch, (err, movies3) => {
                        if (!err) {
                            let movies = movies2.concat(movies3);
                            return res.send(movies);
                        }
                        return console.log(err);
                    });
                }
                return console.log(err);
            });
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

    console.log(UUID);
    console.log(name);
    console.log(year);
    console.log(rank);

    const sqlUpdate = 'UPDATE movies SET `name`=?, `year`=?, `rank`=? WHERE UUID = ?;';

    dbnode1.query(sqlUpdate, [name, year, rank, UUID], (err1, result) => {
        if (err1) {
            if (year >= 1980) {
                dbnode3.query(sqlUpdate, [name, year, rank, UUID], (err3, result2) => {
                    if (err3) {
                        return console.log(err3);
                    }
                    return res.send(result);
                });
            } else {
                dbnode2.query(sqlUpdate, [name, year, rank, UUID], (err2, result) => {
                    if (err2) {
                        return console.log(err2);
                    }
                    return res.send(result);
                });
            }
        }
        return res.send(result);
    });
});

app.listen(PORT, () => {
    console.log('Connected!');
});
