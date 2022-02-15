import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios'

const Item = (props) => {

    const deleteThis = () => {
        Axios.post("http://localhost:5000/deleteThis", {
            UUID: props.UUID,
            name: props.name,
            year: props.year
        }).then(() => {
            window.location.reload(false);
            alert("Successfully deleted!");
        })
        .catch(err => {
            console.error(err);
        })
    }


  return (
    <li key = {props.key}>
        <div className="item">
            <table>
                <tr>
                    <td>{props.name}</td>
                    <td>{props.year}</td>
                    <td>{props.rank}</td>
                    <td>
                        <FontAwesomeIcon icon={faPenToSquare} className="fa-icon"/>
                             
                        <FontAwesomeIcon icon={faTrash} className="fa-icon" onClick={deleteThis}/>
                    </td>
                </tr>
            </table>
        </div>
    </li>
  )
}

export default Item