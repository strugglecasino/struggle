import React, { Component } from 'react';
import { worldStore } from '../../../../stores/Store';
import  BetRow  from './BetRow';



class MyBetsTab extends Component {
    constructor(props){
        super(props);
        this.onStoreChange = this.onStoreChange.bind(this);
    }
    onStoreChange(){
        this.forceUpdate();
    }
    componentDidMount(){
        worldStore.on('change', this.onStoreChange);
    }
    componentWillUnmount(){
        worldStore.off('change', this.onStoreChange);
    }
    render () {
        return (
        <table className="table">
            <thead>
                <tr>
                    <th> ID </th>
                    <th> TIME </th>
                    <th> USER </th>
                    <th> BET </th>
                    <th> TARGET </th>
                    <th> ROLL </th>
                    <th> PROFIT </th>
                </tr>
            </thead>
            <tbody>
                {
                    worldStore.state.bets.toArray().map((bet) => {
                        return <BetRow key={bet.bet_id || bet.id} bet={bet}/>
                    }).reverse()
                }
            </tbody>
        </table>
    );
  }
}

export default MyBetsTab;