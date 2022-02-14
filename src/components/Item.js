import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrash} from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'

const Item = () => {
  return (
    <div className="item">
        <table>
            <tr>
                <td>Spider-Man: No Way Home</td>
                <td>2021</td>
                <td>10.0</td>
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
  )
}

export default Item