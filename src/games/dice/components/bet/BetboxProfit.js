import React from 'react';

const BetboxProfit = ({profit, onChange}) => {
        return (
            <section className="betbox_child">
                <span id="label"> ON WIN </span>
                <div className="input_group">
                    <label>
                        <i className="icon-icon_btc_line"></i>
                    </label>
                    <input
                        value={ profit }
                        onChange={onChange}
                    />
                </div>
                <div className="bet_btns"></div>
            </section>
        );
}

export default BetboxProfit;