import React from 'react';


const BetboxMultiplier = ({multiplier, minMultiplier, halveMultiplier, doubleMultiplier, maxMultiplier, onChange }) => {
        return (
        <section className="betbox_multiplier">
            <span id="label"> MULTIPLIER </span>
            <div className="input_group">
                <label>
                   <i className="icon-icon_x"></i>
                </label>
                    <input 
                     type="text"
                     value={multiplier.str}
                     onChange={onChange}
                     />
                 </div>
                   <div className="bet_btns">
                       <button
                        onClick={minMultiplier}>
                         MIN
                      </button>
                      <button
                       onClick={halveMultiplier}>
                         /2
                      </button>
                      <button
                       onClick={doubleMultiplier}>
                        X2  
                     </button>
                     <button
                       onClick={maxMultiplier}>
                       MAX
                    </button>
            </div>
        </section>
    );
}

export default BetboxMultiplier;