/* eslint-disable */
import React, { Component } from 'react';

class BetboxRollOutcome extends Component {
    render() {
        let {world,  profit } = this.props;
        let rollClass = "current_roll";
        if(!profit) {
            rollClass += ' win';
        } else {
            rollClass += ' lose';
        }
        return (
            <section className="betbox_roll_outcome">
                <span className={rollClass} > 
                    { !world.bets ? world.bets.toArray().map((bet) => { <span key={bet}> { bet.outcome } </span>})
                    
                    : <span className="default_roll"> 00.00 </span>
                    } 
                </span>
                
                        <ul className="previous_rolls">
           
                        </ul>
                
            </section>
        );
    }
}

export default BetboxRollOutcome;