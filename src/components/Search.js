import React from 'react'
import './Styles.css'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
// need to know how to use svg in react xd

const Search = () => {
  return (
    <div className="search-wrapper">
        <input type="text" placeholder="Search a movie..." className="search"/>
        <button className="search-btn">
          SEARCH
        </button>
    </div>
  )
}

export default Search