import React from 'react';
import btc from '../../icons/icon_btc.svg';

const BetboxWager = ({wager, onWagerChange, halveWager, minWager, maxWager, doubleWager}) => {
    return (
        <section className="betbox_wager .columns .gapless">
            <span id="label"> TOTAL BET </span>
            <div className="input_group">
                <img src={btc} alt="btc"/>
                <div className="icon">
                    <input 
                     type="text"
                     value={wager}
                     onChange={onWagerChange}
                     />
                </div>
                <div className="bet_btns">
                    <button onClick={minWager}> min </button>
                    <button onClick={halveWager}> /2 </button>
                    <button onClick={doubleWager}> X2 </button>
                    <button onClick={maxWager}> max </button>
                </div>
            </div>
        </section>
    );
}

export default BetboxWager;