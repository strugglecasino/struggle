import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions/world/';

/* eslint-disable */


const mapStateToProps = state => ({
    world: state.world
});


const mapDispatchToProps = (dispatch) => ({
    changeTab: (tabName) => dispatch(Actions.changeTab(tabName))
});

class BetTabsNav extends Component {
    render() {
        let { world, changeTab } = this.props;
        return (
            <ul className="bet_tabs_nav">
                <li
                    className={ world.currTab === 'ALL_BETS' ? 'active' : '' }>
                    <a href="javascript:void()" onClick={changeTab} > ALL BETS  </a>
                </li>
                <li 
                   className={ world.currTab === 'MY_BETS' ? 'active' : '' }> 
                    <a href="javascript:void()"> MY BETS </a>
                </li>
                <li className={ world.currTab === 'MY_BETS' ? 'active' : '' }>
                    <a href="javascript:void()"> HIGH ROLLS </a>
                </li>
            </ul>
        );
    }
}


export default connect(mapStateToProps)(BetTabsNav);