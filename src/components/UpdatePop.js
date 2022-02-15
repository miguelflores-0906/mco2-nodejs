import React from 'react';
import './UpdatePop.css';

function UpdatePopup(props) {
    return props.trigger ? (
        <div className="popup">
            <div className="popup-inner">
                {props.children}
                <div className="choice-buttons">
                    <button className="close-btn" onClick={() => props.setTrigger(false)}>
                        CANCEL
                    </button>
                    <button className="submit-btn">Update Entry</button>
                </div>
            </div>
        </div>
    ) : null;
}

export default UpdatePopup;
