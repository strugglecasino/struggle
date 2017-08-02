import React from 'react';
import x from '../../icons/icon_x.svg';


const BetboxMultiplier = ({multiplier, minMultiplier, halveMultiplier, doubleMultiplier, maxMultiplier, onChange }) => {
        return (
        <section className="betbox_multiplier">
            <span id="label"> MULTIPLIER </span>
            <div className="input_group">
                <div className="icon">
                    <img src={x} alt="x"/>
                </div>
                    <input 
                     type="text"
                     value={multiplier.str}
                     onChange={e => (onChange(e.target.value))}
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