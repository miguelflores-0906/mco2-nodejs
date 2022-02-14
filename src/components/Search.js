import React from 'react'
import './Styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
// need to know how to use svg in react xd

const Search = () => {
  return (
    <div className="search-wrapper">
        <input type="text" placeholder="Search a movie..." className="search">
        </input>
        {/* TODO: add css */}
        <FontAwesomeIcon icon={faMagnifyingGlass} />
    </div>
  )
}

export default Search