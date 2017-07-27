import React from 'react';
import x from '../../../icons/icon_x.svg';

const Betbot = (props) => {
        let modalClass = 'modal';
        if(this.state.showModal) {
            modalClass += ' .active';
        }
        return (
            <section className={modalClass}>
                <div className="modal-overlay"></div>
                <div className="modal-container">
                    <button><img width="16px" src={x} alt="x"/></button>
                    <div className="modal-title"> Betbot settings </div>
                    <div className="content">
                {/* <BetbotWager /> */} 
                {/* <BetbotMultiplier /> */} 
                {/* <BetboxMaxRolls /> */}
                {/* <BetbotMaxBalance /> */} 
                {/* <BetbotMinBalance /> */} 
                {/* <BetbotMultiplierIncrease /> */} 
                {/* <BetboxWagerIncrease /> */}
                <button> START </button>
                </div>
                </div>
            </section>
        );
}

export default Betbot;