import React from 'react';
import * as helpers from '../../../../utils/helpers';

const BetboxTarget = ({betStore, worldStore, onChange}) => {
    const under = '<';
    const over = '>';
    const Low = helpers.calcNumber(
        under, helpers.multiplierToWinProb(betStore.state.multiplier)
    ); 
    const High =  helpers.calcNumber(
        over, helpers.calcNumber(betStore.state.multiplier)
    );

    return (
        <section className="betbox_targets">
            <span id="label"> TARGETS </span>
            <div className="input_group">
                <label>
                   { under.toString() }
                </label>
                <input
                 type="text"
                 value={Low.toFixed(2)}
                 onChange={onChange}
                 />
            </div>
            <div className="input_group">
                <label>
                   { over }
                </label>
                <input
                 type="text"
                 value={High.toFixed(2)}
                 onChange={onChange}
                 />
            </div>
            <div className="bet_btns"></div>
        </section>
    );
}

export default BetboxTarget;