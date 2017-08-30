import React from 'react';

const BetboxMultiplier = ({betStore, worldStore, onMultiplierChange, minMultiplier, halveMultiplier, doubleMultiplier, maxMultiplier}) => {
     return (
        <section className="betbox_child">
            <span id="label"> MULTIPLIER </span>
            <div className="input_group">
                <label>
                   <i className="icon-icon_x_line"></i>
                </label>
                    <input 
                     type="text"
                     value={betStore.state.multiplier.error ? '?' : betStore.state.multiplier.str}
                     onChange={onMultiplierChange}
                     disabled={!!worldStore.state.isLoading}
                     />
                 </div>
                   <div className="bet_btns">
                  </div>
        </section>
    );
}

export default BetboxMultiplier;