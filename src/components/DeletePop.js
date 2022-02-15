import React from 'react';
import './DeletePop.css';
import app from '../utils/axiosConfig'
function DeletePopup(props) {
    const deleteThis = () => {
        app.post('http://localhost:5000/deleteThis', {
            UUID: props.UUID,
            name: props.name,
            year: props.year,
        })
            .then(() => {
                window.location.reload(false);
                alert('Successfully deleted!');
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return props.trigger ? (
        <div className="popup">
            <div className="popup-inner">
                {props.children}
                <div className="choice-buttons">
                    <button className="close-btn" onClick={() => props.setTrigger(false)}>
                        CANCEL
                    </button>
                    <button
                        className="delete-btn"
                        onClick={() => {
                            deleteThis();
                            props.setTrigger(false);
                        }}
                    >
                        DELETE
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}

export default DeletePopup;
