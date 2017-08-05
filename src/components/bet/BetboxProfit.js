import React from 'react';

const BetboxProfit = ({onChange, wager, multiplier }) => {
    let profit;
    let error = wager.error || multiplier.error;
    if(error) {
        profit = '--'
    } else {
        profit = wager.num * (multiplier.num);
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
                      readOnly
                     />
                </div>
                <div className="bet_btns"></div>
            </section>
        );
}

export default BetboxProfit;