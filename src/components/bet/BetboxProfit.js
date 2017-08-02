import React, { Component } from 'react';
import  btc from '../../icons/icon_btc.svg';

class BetboxProfit extends Component {
    render() {
        let { bet } = this.props;
        let profit = bet.wager.num * (bet.multiplier.num);
        return (
            <section className="betbox_profit">
                <span id="label"> ON WIN </span>
                <div className="input_group">
                    <div className="icon">
                    <img  src={btc} alt="btc"/>
                    </div>
                    <input
                     type="text"
                     value={profit}
                     onChange={this.props.onChange}
                     readOnly="readOnly"
                     />
                </div>
                <div className="bet_btns"></div>
            </section>
        );
    }
}

export default BetboxProfit;