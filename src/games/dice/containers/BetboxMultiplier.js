import React, { Component } from 'react';
import { betStore, worldStore } from '../../../stores/Store';
import Dispatcher from '../../../dispatcher/Dispatcher';
import * as helpers from '../../../utils/helpers';


class BetboxMultiplier extends Component {
    constructor(){
        super();
        this.onStoreChange = this.onStoreChange.bind(this);
        this.onMultiplierChange = this.onMultiplierChange.bind(this);
        this.validateMultiplier = this.validateMultiplier.bind(this);
        this.minMultiplier = this.minMultiplier.bind(this);
        this.halveMultiplier = this.halveMultiplier.bind(this);
        this.doubleMultiplier = this.doubleMultiplier.bind(this);
        this.maxMultiplier = this.maxMultiplier.bind(this);
    }
    onStoreChange(){
        this.forceUpdate();
    };

    componentDidMount(){
        betStore.on('change', this.onStoreChange);
        worldStore.on('change', this.onStoreChange);
    };

    componentWillUnmount() {
        betStore.off('change', this.onStoreChange);
        worldStore.off('change', this.onStoreChange);
    };

    validateMultiplier(newStr) {

        let num = parseFloat(newStr, 10);

        let isFloatRegexp = /^(\d*\.)?\d+$/;
        // Ensure str is a number
        
        if (isNaN(num) || !isFloatRegexp.test(newStr)) {
            Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'INVALID_MULTIPLIER' });
              // Ensure multiplier is >= 1.00x
        } else if (num < 1.01) {
            Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_LOW' });
              // Ensure multiplier is <= max allowed multiplier (100x for now)
        } else if (num > 9900) {
              Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_HIGH' });
              // Ensure no more than 2 decimal places of precision
        } else if (helpers.getPrecision(num) > 2) {
              Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_PRECISE' });
              // multiplier str is valid
        } else {
              Dispatcher.sendAction('UPDATE_MULTIPLIER', {
                num: num,
                error: null
              });
        }
    };

    onMultiplierChange(e) {
        console.log('Multiplier changed');
        let str = e.target.value;
        Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: str.toString() });
        this.validateMultiplier(str.toString());
    };

    minMultiplier(){
        let min = 1.02;
        Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: min.toString()});
    };

    halveMultiplier(){
        let newMult = betStore.state.multiplier.num / 2;
        Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: newMult.toString()});
    };

    maxMultiplier(){
        let max = '9900';
        Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: max.toString()});
    };

    doubleMultiplier(){
        let d = betStore.state.multiplier.num * 2;
        Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: d});
    }
    render(){
        return (
        <section className="betbox_multiplier">
            <span id="label"> MULTIPLIER </span>
            <div className="input_group">
                <label>
                   <i className="icon-icon_x"></i>
                </label>
                    <input 
                     type="text"
                     value={betStore.state.multiplier.str}
                     onChange={this.onMultiplierChange}
                     />
                 </div>
                   <div className="bet_btns">
                       <button
                        onClick={this.minMultiplier}>
                         MIN
                      </button>
                      <button
                       onClick={this.halveMultiplier}>
                         /2
                      </button>
                      <button
                       onClick={this.doubleMultiplier}>
                        X2  
                     </button>
                     <button
                       onClick={this.maxMultiplier}>
                       MAX
                    </button>
            </div>
        </section>
    );
  }
}

export default BetboxMultiplier;