import React from 'react';

const BetboxProfit = ({betStore, onChange}) => {
    let profit;
    let error = betStore.state.wager.error || betStore.state.multiplier.error;
    if(error) {
        profit = '--'
    } else {
        profit = betStore.state.wager.num * (betStore.state.multiplier.num);
    }
        return (
            <section className="betbox_profit">
                <span id="label"> ON WIN </span>
                <div className="input_group">
                    <label>
                        <i className="icon-icon_btc"></i>
                    </label>
                    <input
                      type="text"
                      value={profit}
                      onChange={onChange}
                     />
                </div>
                <div className="bet_btns"></div>
            </section>
        );
}

export default BetboxProfit;