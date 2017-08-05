import React from 'react';

/* eslint-disable */

const BetTabsNav = ({ currTab, makeChangeTabHandler }) => {
        return (
            <ul className="bet_tabs_nav">
                <li
                    className={ currTab === 'ALL_BETS' ? 'active' : '' }>
                    <a 
                      href="javascript:void()"
                       > ALL BETS  </a>
                </li>
                <li 
                   className={ currTab === 'MY_BETS' ? 'active' : '' }> 
                    <a href="javascript:void()"> MY BETS </a>
                </li>
                <li className={ currTab === 'MY_BETS' ? 'active' : '' }>
                    <a href="javascript:void()"> HIGH ROLLS </a>
                </li>
            </ul>
        );
}


export default BetTabsNav;