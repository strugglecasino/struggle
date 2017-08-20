import React, { Component } from 'react';
import { betStore, worldStore } from '../../../stores/Store';

class BetboxRollOutcome extends Component {
    constructor(props){
        super(props);
        this.onStoreChange = this.onStoreChange.bind(this);
    }
    onStoreChange(){
        this.forceUpdate();
    }
    componentDidMount(){
        worldStore.on('change', this.onStoreChange);
        betStore.on('change', this.onStoreChange);
    }
    componentWillUnmount(){
        worldStore.off('change', this.onStoreChange);
        betStore.off('change', this.onStoreChange);
    }

    render(){
        return (
            <section className="betbox_roll_outcome">
                    {
                        worldStore.state.bets.toArray().map((bet) => {
                            return (
                                <div className="current_roll" key={bet}>
                                    { bet.outcome ? bet.outcome : '00.00' }
                                </div>
                            )
                        })
                    }
                <ul className="previous_rolls">
                    {
                        worldStore.state.bets.toArray().map((bet) => {
                            return (
                                <li className="rolls" key={bet.outcome}>
                                   <span> <a href="/"> { bet.outcome } </a> </span>
                                </li>
                            );
                        })
                    }
                </ul>
            </section>
        );
    }
};

export default BetboxRollOutcome;