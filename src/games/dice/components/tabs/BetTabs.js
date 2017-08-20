import React from 'react';
import MyBetsTab from './MyBetsTab';
import AllBetsTab from './AllBetsTab';


const BetTabs = ({ tabName }) => {
        switch(tabName) {
            case 'MY_BETS':
             return <MyBetsTab />;
            case 'ALL_BETS':
             return <AllBetsTab />;
            default:
             return <AllBetsTab />;
        }
}

export default BetTabs;