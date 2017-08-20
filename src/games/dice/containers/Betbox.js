import React, { Component } from 'react';
import { betStore, worldStore } from '../../../stores/Store';
import Dispatcher from '../../../dispatcher/Dispatcher';
import BetboxRollButtons from './BetboxRollButtons';
import BetboxRollOutcome from './BetboxRollOutcome';
import BetboxWager from './BetboxWager';
import BetboxMultiplier from './BetboxMultiplier';
import BetboxProfit from '../components/bet/BetboxProfit';
import BetboxRisk from '../components/bet/BetboxRisk';
import Hotkeys from '../components/bet/Hotkeys';



class Betbox extends Component {
    constructor(props){
        super(props);
        this.onStoreChange = this.onStoreChange.bind(this);
        this.toggleHotkeys = this.toggleHotkeys.bind(this);
        this.getErrorMsg = this.getErrorMsg.bind(this);
    };
    onStoreChange(){
        this.forceUpdate();
    };
    componentDidMount(){
        betStore.on('change', this.onStoreChange);
        worldStore.on('change', this.onStoreChange);
    };
    componentWillUnmount(){
        betStore.off('change', this.onStoreChange);
        worldStore.off('change', this.onStoreChange);
    };
    toggleHotkeys(){
        Dispatcher.sendAction('TOGGLE_HOTKEYS');
    };

    getErrorMsg(error){
        error = betStore.state.wager.error || betStore.state.multiplier.error;
        const translateErrors = {
            'CANNOT_AFFORD_WAGER': 'BALANCE TOO LOW.',
            'INVALID_WAGER': 'BET IS INVALID.',
            'INVALID_MULTIPLIER': 'MULTIPLIER IS INVALID',
            'MULTIPLIER_TOO_PRECISE': 'MULTIPLIER IS TOO PRECISE.',
            'MULTIPLIER_TOO_HIGH': 'MULTIPLIER IS TOO HIGH, MAXIMUM IS 9900 X.',
            'MULTIPLIER_TOO_LOW': 'MULTIPLIER IS TOO LOW, MINIMUM IS 1.02 X'            
        };
        if(error){
            return translateErrors[error];
        } else {
           return error = null;
        }
        
    };

    render() {
        let betboxClass = 'betbox';
        if(!worldStore.state.chatEnabled) {
            betboxClass = 'full';
        }
        let error = betStore.state.wager.error || betStore.state.multiplier.error;
        return (
            <section className={betboxClass}>
                
                <div className={ !error ? '' : 'error_messages'}> <span> {  this.getErrorMsg(error)   } </span> </div>

                <BetboxRollOutcome />

                <Hotkeys 
                 toggleHotkeys={this.toggleHotkeys}
                 hotkeysEnabled={worldStore.state.hotkeysEnabled} 
                />

                <BetboxWager />

                <BetboxMultiplier />


                <BetboxProfit
                  betStore={betStore}
                  onChange={this.onStoreChange}
                 />

                 <BetboxRisk 
                  betStore={betStore}
                  onChange={this.onStoreChange}
                 />

                <BetboxRollButtons />

            </section>
        );
    }
}

export default Betbox;