import React from 'react';
import * as helpers from '../../utils/helpers';


const BetboxRisk = ({ wager, multiplier, onChange }) => {

    let winProb = helpers.multiplierToWinProb(multiplier.num);
    let isErr = multiplier.error || wager.error;

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