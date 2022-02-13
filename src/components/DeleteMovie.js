import React from 'react'
import './Styles.css'

const DeleteMovie = () => {
  return (
    <div classNameName="overlay" id="overlay">
        <div className="delete-mov" id="delete-movie">
            <p className="delete-text">Are you sure you want to delete: </p>
            <p className="delete-text">Insert Movie title here</p>
            <button className="delete-can" onclick="show_hide()"> Cancel </button>
            <button className="delete-del" onclick="show_hide()"> Delete </button>
        </div>
    </div>
  )
}

export default DeleteMovie