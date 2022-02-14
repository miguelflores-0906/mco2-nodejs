import React from 'react'
import './Styles.css'

const AddMovie = () => {
  return (
    <div className="add-movie-wrapper">
        <div className="add-movie-form">
            <div className="form-wrapper">
                <div className="form-proper">
                    <input className="input-title" type="text" placeholder="Movie Title"/>
                    <input className="input-year" type="number" placeholder="Year"/>
                    <input className="input-rating" type="number" step="0.1" placeholder="Rating"/>
                    <div className="add-btn">
                        +
                    </div>
                </div>
        
            </div>

        </div>
    </div>
  )
}

export default AddMovie