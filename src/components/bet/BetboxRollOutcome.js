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
                <span className={rollClass} > { world.bets.toArray().map((bet) => { <span> { bet.outcome } </span>})} </span>
                    {
                        world.bets.toArray().map((bet) => {
                            <ul key={bet} bet={world.allBets}>
                                <li>
                                    { bet.outcome }
                                </li>
                            </ul>
                        })
                    }
            </section>
        );
    }
}

export default BetboxRollOutcome;