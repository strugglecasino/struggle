import React, { Component } from 'react';
import Topbar from './Topbar';
import Navbar from './Navbar';
import Chatbox from './chat/Chatbox';
import Betbox from './bet/Betbox';
import BetTabs from './bet_tabs/BetTabs';
import BetTabsNav from './bet_tabs/BetTabsNav';
import store from '../stores/configureStore';

class App extends Component {
    render() {
        let balance;
        if(store.getState().worldStore.user.balance) {
          balance = store.getState().worldStore.user.balance;
        } else {
            balance = '0'
        };
        return (
            <main>
                <Topbar />
                <Navbar balance={balance}/>
                <div className="main">
                 <Betbox />
                 <Chatbox/>
                 <BetTabsNav />
                 <BetTabs />
                </div>
            </main>
        );
    }
}

export default App;