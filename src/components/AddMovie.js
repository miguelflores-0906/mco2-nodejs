import React, {useState, useEffect} from 'react'
import './Styles.css'
import Axios from "axios"

const AddMovie = () => {

    const [name, setName] = useState("")
    const [year, setYear] = useState("")
    const [rank, setRank] = useState("")

    const addThisMovie = () => {
        Axios.post("http://localhost:5000/addMovie", {
            name: name,
            year: year,
            rank: rank
        }).then(() => {
            // alert("Success!");
            window.location.reload(false);
        })
        .catch(err => {
            console.error(err);
        })
    }


  return (
    <div className="add-movie-wrapper">
        <div className="add-movie-form">
            <div className="form-wrapper">
                <div className="form-proper">
                    <input className="input-title" type="text" placeholder="Movie Title" onChange={(e) => {
                        setName(e.target.value)
                    }}/>
                    <input className="input-year" type="number" placeholder="Year" onChange={(e) => {
                        setYear(e.target.value)
                    }}/>
                    <input className="input-rating" type="number" step="0.1" placeholder="Rating" onChange={(e) => {
                        setRank(e.target.value)
                    }}/>
                    <div className="add-btn" onClick={addThisMovie}>
                        +
                    </div>
                </div>
        
            </div>

        </div>
    </div>
  )
}

export default AddMovie