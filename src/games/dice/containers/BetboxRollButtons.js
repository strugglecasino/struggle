import React, { Component } from 'react';
import { betStore, worldStore, chatStore } from '../../../stores/Store';
import Dispatcher from '../../../dispatcher/Dispatcher';
import * as helpers from '../../../utils/helpers';
import SHA256 from 'crypto-js/sha256';

class BetboxRollButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            waitingForServer: false
        };
        this.onStoreChange = this.onStoreChange.bind(this);
        this.makeBetHandler = this.makeBetHandler.bind(this);
    }
 onStoreChange(){
     this.forceUpdate();
 }
 componentDidMount(){
     betStore.on('change', this.onStoreChange);
     worldStore.on('change', this.onStoreChange);
 };
 
 componentWillUnmount(){
     betStore.off('change', this.onStoreChange);
     worldStore.off('change', this.onStoreChange);
 }

 makeBetHandler(cond){
     
    const self = this;
    
    console.assert(cond === '<' || cond === '>');

     return function(e)  {
         console.log('Placing bet..');

         self.setState({waitingForServer: true});
         
         const hash = betStore.state.nextHash;
         console.assert(typeof hash === 'string');


         const wagerSatoshis = betStore.state.wager.num * 100;
         const multiplier = betStore.state.multiplier.num;
         const payoutSatoshis = wagerSatoshis * multiplier;

         const number = helpers.calcNumber(
             cond, helpers.multiplierToWinProb(multiplier)
         )

         const params = {
             wager: wagerSatoshis,
             client_seed: 0,
             hash: hash,
             cond: cond,
             target: number,
             payout: payoutSatoshis
         };

         this.props.MoneyPot.placeSimpleDiceBet(params, {
             success: function(bet){
                 console.log('Successfuly placed bet', bet);

                 bet.meta = {
                     cond: cond,
                     number: number,
                     hash: hash,
                     isFair: SHA256(bet.secret + '|' + bet.salt).toString() === hash
                 };

                 bet.wager = wagerSatoshis;
                 bet.uname = worldStore.state.user.uname;

                 Dispatcher.sendAction('NEW_BET', bet);
                 Dispatcher.sendAction('SET_NEXT_HASH', bet.next_hash);
                 Dispatcher.sendAction('UPDATE_USER', {
                     balance: worldStore.state.user.balance + bet.profit
                 });
             },
             error: function(xhr){
                 console.log('Error');
                 if(xhr.responseJSON.error && xhr.responsJSON.error) {
                     alert(xhr.responseJSON.error);
                 } else {
                     alert('Internal error');
                 }
             },
             complete: function(){
                 chatStore.state.waitingForServer = false;
                 Dispatcher.sendAction('UPDATE_WAGER', {
                     str: betStore.state.wager.str
                 });
             }
         })
     }
 }
 render(){
    return (
        <section className='betbox_roll_buttons'>
            <button 
               id="roll_lo"
               onClick={this.makeBetHandler('<')}>
                LO 
                { worldStore.state.hotkeysEnabled ? <kbd> 'L' </kbd> : '' }
            </button>
            <button 
            id="roll_hi"
            onClick={this.makeBetHandler('>')}>
                HI
                { worldStore.state.hotkeysEnabled ? <kbd> 'H' </kbd> : '' }
            </button>
        </section>
    );
   }
}

export default BetboxRollButtons;