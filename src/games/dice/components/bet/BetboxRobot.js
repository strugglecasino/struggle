import React from 'react';

const BetboxRobot = ({ betbotClass, onRollsLImitChange }) => {

    return (
        <div className={betbotClass}>
            <div className="input_group">
                <i className="icon-icon_dial_line"></i>
                <label> ROLLS </label>
                <input
                 type="text"
                 value="5"
                 onChange={onRollsLImitChange}
                />
            </div>
        </div>
    );
}

export default BetboxRobot;