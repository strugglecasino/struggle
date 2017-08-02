import React, { Component } from 'react';
import { connect } from 'react-redux';
import BetboxRollButtons from '../components/bet/BetboxRollButtons';
import BetboxWager from '../components/bet/BetboxWager';
import BetboxMultiplier from '../components/bet/BetboxMultiplier';
import BetboxProfit from '../components/bet/BetboxProfit';
import BetboxRisk from '../components/bet/BetboxRisk';
import BetboxRollOutcome from '../components/bet/BetboxRollOutcome';
import * as Actions from '../actions/bet/';
import * as helpers from '../utils/helpers';
// import Betbot from '../components/bet/betbot/Betbot';
// import Hotkeys from '../components/bet/Hotkeys';
import * as MoneyPot from '../api/mpApi';
import robot from '../icons/icon_robot.svg';

const mapStateToProps = state => ({
    bet: state.bet,
    world: state.world,
    chat: state.chat
});

const mapDispatchToProps = (dispatch) => ({
    onWagerChange: (e) => dispatch(Actions.onWagerChange(e)),
    updateWager: (newWager) => dispatch(Actions.updateWager(newWager)),
    minWager: (min) => dispatch(Actions.minWager(min)),
    halveWager: (newWager) => dispatch(Actions.halveWager(newWager)),
    doubleWager: (n) => dispatch(Actions.doubleMultiplier(n)),
    maxWager: (max) => dispatch(Actions.maxWager(max)),
    setNextHash: (nextHash) => dispatch(Actions.setNextHash(nextHash))
});

class Betbox extends Component {
        makeBetHandler(cond) {;
            console.assert(cond === '>' || cond === '<');

            return function(e) {

                this.props.chat.waitingForServer = true;

                console.log('Placing bet');

                let hash = this.props.bet.nextHash;
                console.assert(typeof hash === 'string');

                let wagerSatoshis = this.props.bet.wager.num * 100;
                let multiplier = this.props.bet.multiplier.num;
                let payoutSatoshis = wagerSatoshis * multiplier;

                let number = helpers.calcNumber(
                    cond, helpers.multiplierToWinProb(multiplier)
                );

                let params = {
                    wager: wagerSatoshis,
                    client_seed: 0,
                    hash: hash,
                    cond: cond,
                    target: number,
                    payout: payoutSatoshis
                };

                MoneyPot.placeSimpleDiceBet(params, {
                    
                    success: function(bet) {
                        bet.meta = {
                            cond: cond,
                            number: number,
                            hash: hash,
                            isFair: undefined
                        };

                        bet.wager = wagerSatoshis;
                        bet.uname = this.props.world.user.uname;

                        this.props.dispatch(this.props.setNextHash({nextHash: bet.next_hash}));
                        this.props.dispatch(this.props.updateUser({balance: this.props.world.user.balance + bet.profit}));
                    },
                    error: function(xhr){
                        console.log('Error');
                        if (xhr.responseJSON && xhr.responseJSON) {
                            alert(xhr.responseJSON.error);
                        } else {
                            alert('Internal Error');
                        }
                    },
                    complete: function(){
                        this.props.chat.waitingForServer = false;
                        this.props.dispatch(this.props.updateWager({str: this.props.bet.wager.str}));
                    },
                });
            };
        }
    render() {
        let { bet, world } = this.props;
        let error = bet.wager.error || bet.multiplier.error;
        let translateErrors = {
                'CANNOT_AFFORD_WAGER': 'Balance to low. please deposit.',
                'INVALID_WAGER': 'Bet is invalid, must be 10 to 42000 bits.',
                'INVALID_MULTIPLIER': 'Multiplier is invalid, must be numbers.',
                'MULTIPLIER_TOO_PRECISE': 'Multiplier is too precise, x1.01 to x9900.',
                'MULTIPLIER_TOO_HIGH': 'Multiplier is too high, must be lower than x9900.',
                'MULTIPLIER_TOO_LOW': 'Multiplier is too low, must be at least x1.01.'
        };
        let profit = bet.wager.num * (bet.multiplier.num);
        return (
            <section className="betbox">
                { error ? <span> { translateErrors[error] } </span> : '' }

                <BetboxRollOutcome 
                  world={world}
                  profit={profit}
                />
    
                <BetboxWager 
                   wager={bet.wager.str} 
                   onWagerChange={this.props.onWagerChange}
                   minWager={this.props.minWager}  
                   halveWager={this.props.halveWager}
                   doubleWager={this.props.doubleWager}
                   maxWager={this.props.maxWager}
                />
                <BetboxMultiplier
                   multiplier={bet.multiplier.str}
                   onMultiplierChange={this.props.onMultiplierChange}
                   minMultiplier={this.props.minMultiplier}
                   halveMultiplier={this.props.halveMultiplier}
                   doubleMultiplier={this.props.doubleMultiplier}
                   maxMultiplier={this.props.maxMultiplier}
                />
                <BetboxRisk
                 bet={bet}
                 onChange={this.props.onChange}
                 />
                 <BetboxProfit
                  bet={bet}
                  onChange={this.props.onChange}
                 />
                <BetboxRollButtons
                  makeBetHandler={this.makeBetHandler}
                  world={world}
                  disabled={ world.isLoading }
                />
            </section>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Betbox);