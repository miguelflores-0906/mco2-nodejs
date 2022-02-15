import React, { useState, useEffect } from 'react';
import './Styles.css';
import Item from './Item.js';
import Axios from 'axios';

const MovieList = () => {
    // const [movieList, setMovieList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("")

    const updateMovies = (movieArray) => setMovies(movieArray.data.map((movie, index) => {
      return (
        <Item
          UUID = {movie.UUID}
          name = {movie.name}
          year = {movie.year}
          rank = {movie.rank}
          key = {index}
        />
      )
    }));

    const searchClick = () => {
        console.log("Searching for " + searchTerm)
        Axios.post('http://localhost:5000/search', {searchTerm: searchTerm})
            .then((response) => {
                console.log(response.data)
                updateMovies(response)
            })
            .catch(err => {
                console.error(err)
            })
        console.log('Done searching!')
    }

    const resetClicks = () => {
        Axios.get('http://localhost:5000/getAll')
            .then((response) => {
                console.log(response.data)
                updateMovies(response)
            })
            .catch(err => {
                console.error(err)
            })
    }


    useEffect(() => {
        console.log('start getting')
        Axios.get('http://localhost:process.env.PORT/getAll')
            .then((response) => {
                console.log(response.data);
                updateMovies(response)
            })
            .catch((err) => {
              console.error(err);
            });
        console.log('done');
        }, []);

    const [movies, setMovies] = useState("No movies yet here folks!");

    return (

        <div>

            {/* search bar */}
            <div className="search-wrapper">
                <input 
                    type="text"
                    placeholder="Search a movie..."
                    className="search"
                    onChange = {(e) => setSearchTerm(e.target.value)}/>
                <button className="search-btn" onClick={searchClick}>
                    SEARCH
                </button>
                <button className="search-btn" onClick={resetClicks}>
                    RESET
                </button>
            </div>

            {/* item list */}
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

                <div className="movie-list">
                    <ul>{movies}</ul>
                </div>

            </div>

        </div>
    );
};

export default MovieList;
