import React from 'react';
import x from '../../icons/icon_x.svg';

const BetboxMultiplier = ({ multiplier , onMultiplierChange }) => {
    return (
        <section className="multiplier">
            <span id="label"> MULTIPLIER </span>
            <div className="input_group">
                <div className="icon">
                    <img src={x} alt="x"/>
                    <input 
                     type="text"
                     value={multiplier}
                     onChange={onMultiplierChange}
                     />
                </div>
            </div>
        </section>
    );
}

export default BetboxMultiplier;