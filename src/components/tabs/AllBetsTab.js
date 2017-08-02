import React, { Component } from 'react';
import { connect } from 'react-redux';
import  BetRow  from './BetRow';

const mapStateToProps = state => ({
    world: state.world
});

class AllBetsTab extends Component {
    render () {
        let { world } = this.props;
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
                    world.bets.toArray().map((bet) => {
                        return <BetRow key={bet.bet_id || bet.id} bet={world.allBets} />
                    })
                }
            </tbody>
        </table>
    );
  }
}

export default connect(mapStateToProps)(AllBetsTab);