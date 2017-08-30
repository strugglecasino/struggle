import React from 'react';


const BetboxRisk = ({risk, onChange}) =>  {
        return (
        <section className="betbox_child">
            <span id="label"> RISK </span>
            <div className="input_group">
                <label>
                   <i className="icon-icon_pourcent_line"></i>
                </label>
                <input
                  value={risk}
                  onChange={onChange}
                />
            </div>
            <div className="bet_btns"></div>
        </section>
   );
};

export default BetboxRisk;