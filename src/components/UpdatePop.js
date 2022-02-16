import React from 'react';
import './UpdatePop.css';

import Axios from 'axios';

function UpdatePopup(props) {
    const updateThis = () => {
        Axios.post('https://imdb-movie-searcher.herokuapp.com/updateMovie', {
            UUID: props.UUID,
            name: props.name,
            year: props.year,
            rank: props.rank,
        })
            .then(() => {
                window.location.reload(false);
                alert('Successfully Updated!');
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
                        className="submit-btn"
                        onClick={() => {
                            updateThis();
                            props.setTrigger(false);
                        }}
                    >
                        Update Entry
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}

export default UpdatePopup;
