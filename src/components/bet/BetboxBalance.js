import React from 'react';

const BetboxBalance = ({balance, unconfirmed_balance, onClick}) => {
    return (
        <section className="balance">
            <i className="icon-icon_btc"></i>
            <span> { balance / 10  }</span>
             <button id="refresh" className="refresh" onClick={onClick}>
                <i className="icon-icon_refresh"></i>
            </button>
                { unconfirmed_balance  ? <span className="pending"> { unconfirmed_balance / 10 + ' ' } <span> pending </span> </span> : ' ' }
        </section>
    );
}

export default BetboxBalance;