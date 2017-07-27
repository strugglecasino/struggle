import React from 'react';
import pourcent from '../../icons/icon_pourcent.svg';

const BetboxRisk = ({wager, multiplier}) => {
    return (
        <section className="betbox_risk .columns .col-6">
            <div className="input_group">
                <img src={pourcent} alt="%"/>
                <span>
                    50
                </span>
            </div>
        </section>
    );
}

export default BetboxRisk;