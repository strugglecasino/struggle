import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import BetboxRollButtons from './BetboxRollButtons';
import BetboxWager from './BetboxWager';
import BetboxMultiplier from './BetboxMultiplier';
import Betbot from './betbot/Betbot';
import Hotkeys from './Hotkeys';
import store from '../../stores/configureStore';
import robot from '../../icons/icon_robot.svg';
import { updateWager, updateMultiplier } from '../../actions/betActions';
import { toggleHotkeys } from '../../actions/worldActions';
import { getPrecision } from '../../utils/helpers';

const mapStateToProps = (state) => ({
    betStore: state.betStore
});

const betStore = Object.assign({}, store.getState().betStore);
const worldStore = Object.assign({}, store.getState().worldStore);

class Betbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
    this.showBetbot = this.showBetbot.bind(this);
    this.onMultiplierChange = this.onMultiplierChange.bind(this); 
    this.onWagerChange = this.onWagerChange.bind(this);
    this.halveWager = this.halveWager.bind(this);
    this.minWager = this.minWager.bind(this);
    this.maxWager = this.maxWager.bind(this);
    this.doubleWager = this.doubleWager.bind(this);
    this.toggleHotkeys = this.toggleHotkeys.bind(this);
    }

    componentDidMount(){
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate();
        })
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
    onWagerChange(e){
        let str = e.target.value;
        store.dispatch(updateWager({str: str}));
    }
    doubleWager(newWager) {
        newWager = betStore.wager.str * 2;
        store.dispatch(updateWager({str: newWager}));
    }
    minWager(min){
        min = 10;
        store.dispatch(updateWager({str: min}));
    }
    maxWager(max){
        let maxBet = 40000;
        store.dispatch(updateWager({ str: maxBet}));
    }
    halveWager(str) {
        str = betStore.wager.str / 2;
        store.dispatch(updateWager({str: str.toString()}));
    }
    showBetbot(){
        this.setState({showModal: true});
        let windowUrl =  <Betbot/>;
        let windowName = 'Betbot settings';
        let windowOpts = [
            'width=1000',
            'height=650',
            'left=20%',
            'top=20%'
        ].join(',');
        let windowRef = window.open(windowUrl, windowName, windowOpts);
        windowRef.focus();
        return false;
    }
    validateMultiplier(newStr){
        let num = parseFloat(newStr, 10);
        let isFloatRegexp = /^(\d*\.)?\d+S/;

        if(isNaN(num) || !isFloatRegexp.test(newStr)) {
            store.dispatch(updateMultiplier({error: 'INVALID_MULTIPLIER' }));
        } else if(num < 1.01) {
            store.dispatch(updateMultiplier({error: 'MULTIPLIER_TOO_LOW'}));
        } else if (num > 9900) {
            store.dispatch(updateMultiplier({error: 'MULTIPLIER_TOO_HIGH'}));
        } else if (getPrecision(num) > 2) {
            store.dispatch(updateMultiplier({error: 'MULTIPLIER_TOO_PRECISE'}));
        } else {
            store.dispatch(updateMultiplier({
                num: num,
                error: null
            }));
        }
    }

    onMultiplierChange(e) {
        let str = e.target.value;
        console.log('You changed multiplier for' + betStore.multiplier.str);
        store.dispatch(updateMultiplier({str: str}));
        this.validateMultiplier(str);
    }
    toggleHotkeys(){
        store.dispatch(toggleHotkeys());
    }
    updateWager(newWager){
        betStore.wager.str = _.merge({}, betStore.wager.str, newWager);

        let n = parseFloat(betStore.wager.str, 10);

        if(isFinite(n)) {
            Math.max(n, 1);
            betStore.wager.str = n.toString();
        }

        if (isNaN(n) || /[^\d]/.test(n.toString())) {
            store.dispatch(updateMultiplier({error: 'INVALID_WAGER'}));
        } else if(n * 100 > worldStore.state.user.balance) {
            store.dispatch(updateWager({error: 'NOT_ENOUGH_BALANCE'}));
            betStore.wager.num = n;
        } else {
                betStore.wager.error = null,
                betStore.wager.str = n.toString(),
                betStore.wager.num = n
            };
    };
    render() {
        return (
            <section className="betbox .container">

                <Hotkeys onClick={this.toggleHotkeys} hotkeysEnabled={worldStore.hotkeysEnabled}/>

                <BetboxWager wager={betStore.wager.str} onWagerChange={this.onWagerChange} halveWager={this.halveWager} minWager={this.minWager} doubleWager={this.doubleWager} maxWager={this.maxWager}/>

                <BetboxMultiplier multiplier={betStore.multiplier.str} onMultiplierChange={this.onMultiplierChange} />

                <button onClick={this.showBetbot} className="betbox_toggle_bot"> AUTO BETS <img src={robot} alt="robot"/></button>
                
                <BetboxRollButtons />

            </section>
        );
    }
}

export default connect(mapStateToProps)(Betbox);