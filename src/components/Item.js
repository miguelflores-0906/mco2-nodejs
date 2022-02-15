import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import Axios from 'axios';

import DeletePopup from './DeletePop';
import UpdatePopup from './UpdatePop';
import { useState } from 'react';

const Item = (props) => {

    const newPropName = props.name

    const deleteThis = () => {
        Axios.post('http://localhost:5000/deleteThis', {
            UUID: props.UUID,
            name: {newPropName},
            year: props.year,
        })
            .then(() => {
                window.location.reload(false);
                // alert("Successfully deleted!");
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const [updateButtonPopup, setUpdateButtonPopup] = useState(false);
    const [deleteButtonPopup, setdeleteButtonPopup] = useState(false);

    return (
        <li key={props.key}>
            <div className="item">
                <table>
                    <tr>
                        <td>{newPropName}</td>
                        <td>{props.year}</td>
                        <td>{props.rank}</td>
                        <td>
                            <FontAwesomeIcon
                                icon={faPenToSquare}
                                className="fa-icon"
                                onClick={() => setUpdateButtonPopup(true)}
                            />

                            <FontAwesomeIcon
                                icon={faTrash}
                                className="fa-icon"
                                onClick={() => setdeleteButtonPopup(true)}
                            />
                        </td>
                    </tr>
                </table>
            </div>

            <UpdatePopup trigger={updateButtonPopup} setTrigger={setUpdateButtonPopup}>
                <h1>
                    For the entry of: <br /> "{props.name}, {props.year}"
                </h1>
                <input
                    className="input-new-title"
                    type="text"
                    placeholder="Update Movie Title"
                    contentEditable="true"
                    defaultValue={props.name}
                ></input>
                <input
                    className="input-new-year"
                    type="text"
                    placeholder="Update Movie Year"
                    contentEditable="true"
                    defaultValue={props.year}
                ></input>
                <input className="input-new-rating" type="text" placeholder="Update Movie Rating"></input>
            </UpdatePopup>

            <DeletePopup
                trigger = {deleteButtonPopup}
                setTrigger = {setdeleteButtonPopup}
                deletethis = {deleteThis}
                UUID = {props.UUID}
                name = {props.name}
                year = {props.year}>
                <h1>
                    Are you sure you want to delete: <br /> "{props.name}, {props.year}"
                </h1>
            </DeletePopup>
        </li>
    );
};

export default Item;
