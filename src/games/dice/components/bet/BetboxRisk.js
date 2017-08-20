import React from 'react';
// import Dispatcher from '../dispatcher/Dispatcher';
import * as helpers from '../../../../utils/helpers';

const BetboxRisk = ({betStore, onChange}) =>  {

        const winProb = helpers.multiplierToWinProb(betStore.state.multiplier.num);
        const isErr = betStore.state.wager.error || betStore.state.multiplier.error;

        let risk;
        if(isErr){
            risk = '--';
        } else {
            risk = (winProb * 100).toFixed(2).toString();
        };

        return (
        <section className="betbox_risk">
            <span id="label"> RISK </span>
            <div className="input_group">
                <label>
                   <i className="icon-icon_pourcent"></i>
                </label>
                <input
                 type="text"
                 value={risk}
                 onChange={onChange}
                 />
            </div>
            <div className="bet_btns"></div>
        </section>
   );
};

export default BetboxRisk;