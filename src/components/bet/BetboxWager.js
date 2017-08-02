import React  from 'react';
import btc from '../../icons/icon_btc.svg';

const BetboxWager = ({wager, onWagerChange, minWager, maxWager, halveWager, doubleWager}) => {

        return (
        <section className="betbox_wager .columns .gapless">
            <span id="label"> TOTAL BET </span>
            <div className="input_group">
                <div className="icon">
                  <img src={btc} alt="btc"/>
                </div>
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
        </section>            
        );
};


export default BetboxWager;