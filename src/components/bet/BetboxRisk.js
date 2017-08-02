import React, { Component } from 'react';
import pourcent from '../../icons/icon_pourcent.svg';
import * as helpers from '../../utils/helpers';


class BetboxRisk extends Component {

    render () {
    let { bet } = this.props;

    let winProb = helpers.multiplierToWinProb(bet.multiplier.num);
    let isErr = bet.multiplier.error || bet.wager.error;

    let risk;
    if(isErr){
        risk = 'ERROR'; 
    } else {
        risk = (winProb * 100).toFixed(2).toString();
    };
        return (
        <section className="betbox_risk">
            <span id="label"> RISK </span>
            <div className="input_group">
                <div className="icon">
                <img src={pourcent} alt="%"/>
                </div>
                <input
                 type="text"
                 value={risk}
                 onChange={this.props.onChange}
                 />
            </div>
            <div className="bet_btns"></div>
        </section>
    );
  }
}

export default BetboxRisk;