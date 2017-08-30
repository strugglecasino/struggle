import React, { Component } from 'react';
import classNames from 'classnames';
import { betStore, worldStore } from '../../../stores/Store';
import * as helpers from '../../../utils/helpers';
import Dispatcher from '../../../dispatcher/Dispatcher';
import BetboxRollButtons from './BetboxRollButtons';
import BetboxOutcome from './BetboxOutcome';
import BetboxWager from '../components/bet/BetboxWager';
import BetboxMultiplier from '../components/bet/BetboxMultiplier';
import BetboxProfit from '../components/bet/BetboxProfit';
import BetboxRisk from '../components/bet/BetboxRisk';
import Hotkeys from '../components/bet/Hotkeys';



class Betbox extends Component {
    constructor(props){
        super(props);
        this.onStoreChange = this.onStoreChange.bind(this);
        this.onBalanceChange = this.onBalanceChange.bind(this);
        this.onWagerChange = this.onWagerChange.bind(this);
        this.onMultiplierChange = this.onMultiplierChange.bind(this);
        this.validateMultiplier = this.validateMultiplier.bind(this);
        this.toggleHotkeys = this.toggleHotkeys.bind(this);
        this.getErrorMsg = this.getErrorMsg.bind(this);
    };

    onStoreChange(){
        this.forceUpdate();
    };

    onBalanceChange(){
        Dispatcher.sendAction('UPDATE_WAGER', {});
    }

    componentDidMount(){
        betStore.on('change', this.onStoreChange);
        worldStore.on('user_update', this.onBalanceChange);
        worldStore.on('change', this.onStoreChange);
    };
    componentWillUnmount(){
        betStore.off('change', this.onStoreChange);
        worldStore.off('user_update', this.onBalanceChange);
        worldStore.off('change', this.onStoreChange);
    };

    onWagerChange(e){
        let str = e.target.value;
        Dispatcher.sendAction('UPDATE_WAGER', { str: str});
    };
    minWager(){
        let newWager = 10;
        Dispatcher.sendAction('UPDATE_WAGER', {str: newWager});
    };
    halveWager(){
        let n = Math.round(betStore.state.wager.num / 2);
        Dispatcher.sendAction('UPDATE_WAGER', { str: n.toString()});
    };
    doubleWager(){
        let str = betStore.state.wager.num * 2;
        Dispatcher.sendAction('UPDATE_WAGER', { str: str.toString()});
    };
    maxWager(){
        let balanceBit;
        if(worldStore.state.user !== undefined){
            balanceBit = Math.floor(worldStore.state.user.balance);
        } else {
            balanceBit = 44000;
        };
        Dispatcher.sendAction('UPDATE_WAGER', { str: balanceBit.toString()});
    };
    validateMultiplier(newStr) {

        const num = parseFloat(newStr, 10);
        
        const isFloatRegexp = /^(\d*\.)?\d+$/;
        
        if (isNaN(num) || !isFloatRegexp.test(newStr)) {
            
            Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'INVALID_MULTIPLIER' });
        
        } else if (num < 1.01) {
            
            Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_LOW' });
        
        } else if (num > 9900) {
            
            Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_HIGH' });
        
        } else if (helpers.getPrecision(num) > 2) {
            
            Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_PRECISE' });
        
        } else {
            
            Dispatcher.sendAction('UPDATE_MULTIPLIER', {
                
                num: num,
                error: null
            
            });
        };
    };
    
    onMultiplierChange(e) {
        const str = e.target.value;
        Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: str });
        this.validateMultiplier(str);
    };
    
    minMultiplier(){
        let minMult = 1.02;
        Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: minMult.toString()});
    };
        
    halveMultiplier(){
        let newMult = Math.round(betStore.state.multiplier.num / 2);
        Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: newMult.toString()});
    };

    doubleMultiplier(){
        let n = (betStore.state.multiplier.num * 2);
        Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: n.toString()});
    };

    maxMultiplier(){
        let max = '9900';
        Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: max.toString()});
    };
    
    toggleHotkeys(){
        Dispatcher.sendAction('TOGGLE_HOTKEYS');
    };
    
    getErrorMsg(){
        const error = betStore.state.wager.error || betStore.state.multiplier.error;
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
        };
    };

    render() {

        let betboxClass = classNames({
            'betbox': true,
            'full': !worldStore.state.chatEnabled
        });
        const error = betStore.state.wager.error || betStore.state.multiplier.error;
        const winProb = helpers.multiplierToWinProb(betStore.state.multiplier.num);
        let profit;
        let risk;
        if(error) {
            profit = '?'
            risk = '?';
        } else {
            profit = betStore.state.wager.num * (betStore.state.multiplier.num);
            risk = (winProb * 100).toFixed(2).toString();
        };
    
        return (
            <section className={betboxClass}>
                
                
               {/* <div className={ !error ? '' : 'error_messages'}> <span> {  this.getErrorMsg()  } </span> </div> */}
                


                    
                <BetboxOutcome bets={worldStore.state.bets} onChange={this.onStoreChange} />

                <Hotkeys 
                 toggleHotkeys={this.toggleHotkeys}
                 hotkeysEnabled={worldStore.state.hotkeysEnabled} 
                />

                <BetboxWager 
                  betStore={betStore}
                  worldStore={worldStore}
                  onWagerChange={this.onWagerChange}
                  minWager={this.minWager}
                  halveWager={this.halveWager}
                  doubleWager={this.doubleWager}
                  maxWager={this.maxWager}
                />

                <BetboxMultiplier 
                  betStore={betStore}
                  worldStore={worldStore}
                  onMultiplierChange={this.onMultiplierChange}
                  minMultiplier={this.minMultiplier}
                  halveMultiplier={this.halveMultiplier}
                  doubleMultiplier={this.doubleMultiplier}
                  maxMultiplier={this.maxMultiplier}

                />

                <BetboxProfit
                    profit={profit}
                    onChange={this.onStoreChange}
                 />

                 <BetboxRisk 
                   risk={risk}
                   onChange={this.onStoreChange}
                 />

                <BetboxRollButtons />

                
            </section>
        );
    }
}

export default Betbox;