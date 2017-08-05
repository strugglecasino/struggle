import React  from 'react';

const BetboxWager = ({wager, onChange, minWager, maxWager, halveWager, doubleWager}) => {

        return (
        <section className="betbox_wager">
            <span id="label"> TOTAL BET </span>
            <div className="input_group">
                <label>
                    <i className="icon-icon_btc"></i>
                </label>
                    <input 
                     type="text"
                     value={wager.str}
                     onChange={onChange}
                     />
                </div>
                <div className="bet_btns">
                    <button onClick={minWager}> MIN </button>
                    <button onClick={halveWager}> /2 </button>
                    <button onClick={doubleWager}> X2 </button>
                    <button onClick={maxWager}> MAX </button>
                </div>
        </section>            
        );
};


export default BetboxWager;