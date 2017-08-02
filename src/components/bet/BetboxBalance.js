import React from 'react';
import btc from '../../icons/icon_btc.svg';
import refresh from '../../icons/icon_refresh.svg';

const BetboxBalance = ({balance, unconfirmed_balance}) => {
    return (
        <section className="balance">
            <img src={btc} alt="btc" />
            <span> { balance / 10 + ' ' } <span> bits </span></span>
             <button>
                <img src={refresh} alt='refresh'/>
            </button>
                { unconfirmed_balance  ? <span className="pending"> { unconfirmed_balance / 10 + ' ' } <span> pending </span> </span> : ' ' }
        </section>
    );
}

export default BetboxBalance;