import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BetboxRollButtons from '../components/bet/BetboxRollButtons';
import BetboxWager from '../components/bet/BetboxWager';
import BetboxMultiplier from '../components/bet/BetboxMultiplier';
import BetboxProfit from '../components/bet/BetboxProfit';
import BetboxRisk from '../components/bet/BetboxRisk';
import BetboxRollOutcome from '../components/bet/BetboxRollOutcome';
import * as betActions from '../actions/bet/';
import * as worldActions from '../actions/world/';
import * as helpers from '../utils/helpers';
// import Betbot from '../components/bet/betbot/Betbot';
import Hotkeys from '../components/bet/Hotkeys';
import * as MoneyPot from '../api/mpApi';
import robot from '../icons/icon_robot.svg';

const mapStateToProps = state => ({
    bet: state.bet,
    world: state.world,
    chat: state.chat
});

const mapDispatchToProps = (dispatch) => {
    return {actions:  bindActionCreators(worldActions, betActions, MoneyPot), dispatch }
};


class Betbox extends Component {
    makeBetHandler() {

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

                <Hotkeys
                  hotkeysEnabled={world.hotkeysEnabled}
                  toggleHotKeys={this.props.toggleHotKeys} 
                />


                <BetboxWager 
                   wager={bet.wager} 
                   minWager={this.props.minWager}  
                   halveWager={this.props.halveWager}
                   doubleWager={this.props.doubleWager}
                   maxWager={this.props.maxWager}
                />
                <BetboxMultiplier
                   multiplier={bet.multiplier}
                   minMultiplier={this.props.minMultiplier}
                   halveMultiplier={this.props.halveMultiplier}
                   doubleMultiplier={this.props.doubleMultiplier}
                   maxMultiplier={this.props.maxMultiplier}
                />
                <BetboxRisk
                  bet={bet}
                  onChange={this.onStoreChange}
                 />
                 <BetboxProfit
                  bet={bet}
                  onChange={this.onStoreChange}
                 />
                <BetboxRollButtons
                  world={world}
                  makeBetHandler={this.makeBetHandler}
                />
            </section>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Betbox);