import React, { Component }  from 'react';
import { betStore, worldStore } from '../../../stores/Store';
import Dispatcher from '../../../dispatcher/Dispatcher';


class BetboxWager extends Component {
    constructor(props){
        super(props);
        this.onStoreChange = this.onStoreChange.bind(this);
        this.onBalanceChange = this.onBalanceChange.bind(this);
        this.onWagerChange = this.onWagerChange.bind(this);
        this.minWager = this.minWager.bind(this);
        this.maxWager = this.maxWager.bind(this);
        this.halveWager = this.halveWager.bind(this);       
    }
    onStoreChange(){
        this.forceUpdate();
    };
    onBalanceChange(){
        Dispatcher.sendAction('UPDATE_WAGER', {});
    };
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
        let n = betStore.state.wager.num / 2;
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

    render () {

        return (
        <section className="betbox_wager">
            <span id="label"> TOTAL BET </span>
            <div className="input_group">
                <label>
                    <i className="icon-icon_btc"></i>
                </label>
                    <input 
                     type="text"
                     value={betStore.state.wager.error ? '--' : betStore.state.wager.str}
                     onChange={this.onWagerChange}
                     disabled={!worldStore.state.isLoading}
                     />
                </div>
                <div className="bet_btns">
                    <button onClick={this.minWager}> 
                        MIN 
                    </button>
                    <button onClick={this.halveWager}> 
                        /2
                    </button>
                    <button onClick={this.doubleWager}> 
                        X2
                    </button>
                    <button onClick={this.maxWager}> 
                        MAX 
                  </button>
                </div>
        </section>            
        );
    }
};

export default BetboxWager;