import React, { useState, useEffect } from 'react';
import './Styles.css';
import Item from './Item.js';
import Axios from 'axios';

const MovieList = () => {
    const [movieList, setMovieList] = useState([]);

    const updateMovies = (movieArray) => setMovieList(movieArray.data.map(()));


    useEffect(() => {
        Axios.get('http://localhost:5000/getAll')
            .then((response) => {
                console.log(response.data);
            });
    }, []);

    const [movies, setMovies] = useState("No movies yet here folks!");

    return (
        <div className="item-list">
            <div className="item-header">
                <table>
                    <tr>
                        <td className="movie-title">Movie Title</td>
                        <td className="movie-year">Year</td>
                        <td className="movie-rating">Rating</td>
                        <td className="movie-icons"></td>
                    </tr>
                </table>
            </div>

            {/* <Item />
      <Item />
      <Item />
      <Item />
      <Item /> */}

            <div className="movie-list">
                <ul>{movies}</ul>
            </div>
        </div>
    );
};

export default MovieList;
