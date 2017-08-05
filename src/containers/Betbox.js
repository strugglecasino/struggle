import React, { Component } from 'react';
import { connect } from 'react-redux';
import BetboxRollButtons from '../components/bet/BetboxRollButtons';
import BetboxWager from '../components/bet/BetboxWager';
import BetboxMultiplier from '../components/bet/BetboxMultiplier';
import BetboxProfit from '../components/bet/BetboxProfit';
import BetboxRisk from '../components/bet/BetboxRisk'
import * as betActions from '../actions/bet/';
import * as worldActions from '../actions/world/';
import * as helpers from '../utils/helpers';
import Hotkeys from '../components/bet/Hotkeys';
// import * as MoneyPot from '../api/mpApi';

const mapStateToProps = state => ({
    bet: state.bet,
    world: state.world,
    chat: state.chat
});

const mapDispatchToProps = (dispatch) => {
    return {
        updateWager: (newWager) => dispatch(betActions.updateWager(newWager)),
        updateMultiplier: (newMult) => dispatch(betActions.updateMultiplier(newMult)),
        minWager: (newWager) => dispatch(betActions.minWager()),
        toggleHotkeys: (hotkeysEnabled) => dispatch(worldActions.toggleHotkeys(hotkeysEnabled))
    }
};


class Betbox extends Component {

    onStoreChange(){
        this.forceUpdate();
    }
    onWagerChange(e) {
        let str = e.target.value;
        this.props.dispatch(betActions.updateWager(str));
    };
    onMultiplierChange(e){
        let str = e.target.value;
        this.props.dispatch(betActions.updateMultiplier(str));
    }
    makeBetHandler(){

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
        return (
            <section className="betbox">
                
                { error ? <span className="error_messages"> { translateErrors[error] } </span> : '' }

                <Hotkeys
                  hotkeysEnabled={world.hotkeysEnabled}
                  toggleHotkeys={this.props.toggleHotkeys} 
                />

                <BetboxWager 
                   wager={bet.wager} 
                   onChange={this.onWagerChange}
                   minWager={this.props.onMinWager}  
                   halveWager={this.props.halveWager}
                   doubleWager={this.props.doubleWager}
                   maxWager={this.props.maxWager}
                />

                <BetboxMultiplier
                   multiplier={bet.multiplier}
                   onChange={this.onMultiplierChange}
                   minMultiplier={this.props.minMultiplier}
                   halveMultiplier={this.props.halveMultiplier}
                   doubleMultiplier={this.props.doubleMultiplier}
                   maxMultiplier={this.props.maxMultiplier}
                />

                <BetboxRisk 
                  wager={bet.wager}
                  multiplier={bet.multiplier}
                  onChange={this.onStoreChange} 
                />

                <BetboxProfit 
                  wager={bet.wager}
                  multiplier={bet.multiplier}
                  onChange={this.onStoreChange} 
                />

                <BetboxRollButtons
                   world={world} 
                   bet={bet}
                  makeBetHandler={this.makeBetHandler}
                 />

            </section>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Betbox);