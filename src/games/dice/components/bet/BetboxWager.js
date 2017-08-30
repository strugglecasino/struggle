import React from 'react';

const BetboxWager = ({worldStore, betStore, onWagerChange, doubleWager, maxWager}) => {
        return (
        <section className="betbox_child">
            <span id="label"> TOTAL BET </span>
            <div className="input_group">
                <label>
                    <i className="icon-icon_btc_line"></i>
                </label>
                    <input 
                     type="text"
                     value={betStore.state.wager.error ? '?' : betStore.state.wager.str}
                     onChange={onWagerChange}
                     disabled={!!worldStore.state.isLoading}
                     />
                </div>
                <div className="bet_btns">

                </div>
        </section>            
        );
};

export default BetboxWager;