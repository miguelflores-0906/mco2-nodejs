import React from 'react'
import './Styles.css'
import Item from './Item.js'

const MovieList = () => {
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

      <Item />
      <Item />
      <Item />
      <Item />
      <Item />

    </div>
  )
}

export default MovieList