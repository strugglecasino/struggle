import React from 'react';
import btc from '../../icons/icon_btc.svg';

const BetboxBalance = ({balance}) => {
    return (
        <section className="balance">
            
            <span> <span> <img src={btc} alt="btc" /></span> { balance.toFixed(2) + ' ' } bits </span>
        </section>
    );
}

export default BetboxBalance;