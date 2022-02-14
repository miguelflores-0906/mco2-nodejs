import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

const Item = (props) => {
  return (
    <li key = {props.key}>
        <div className="item">
            <table>
                <tr>
                    <td>{props.name}</td>
                    <td>{props.year}</td>
                    <td>{props.rank}</td>
                    <td>
                        <a title="Edit" href="https://twitter.com/SolarNarwhal" className="svg-link">
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </a>
                        <a title="Delete" href="https://twitter.com/SolarNarwhal" className="svg-link">
                            <FontAwesomeIcon icon={faTrash} />
                        </a>
                    </td>
                </tr>
            </table>
        </div>
    </li>
  )
}

export default Item