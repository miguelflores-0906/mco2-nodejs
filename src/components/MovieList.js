import React, { useState, useEffect } from 'react';
import './Styles.css';
import Item from './Item.js';
import Axios from 'axios'
import app from '../utils/AxiosConfig'

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
        Axios.post('https://imdb-movie-searcher.herokuapp.com/api/search', {searchTerm: searchTerm})
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
        Axios.get('https://imdb-movie-searcher.herokuapp.com/api/getAll')
            .then((response) => {
                console.log(response.data)
                updateMovies(response)
            })
            .catch(err => {
                console.error(err)
            })
    }


    useEffect(() => {
        // console.log('start getting')
        Axios.get('https://imdb-movie-searcher.herokuapp.com/api/getAll')
            .then((response) => {
                console.log("i am getting")
                console.log(response.data);
                updateMovies(response)
            })
            .catch((err) => {
              console.error(err);
            });
        // console.log('done');
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
