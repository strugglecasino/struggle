import React, { Component } from 'react';
import store from '../stores/configureStore';


/* eslint-disable */

class DropDown extends Component {
    constructor(props){
        super(props);
        this.state = {
            isOpen: false
        }
        this.dropDownToggle = this.dropDownToggle.bind(this);
        this.logout = this.logout.bind(this);
    }
    componentDidMount(){
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate();
        })
    }
    componentWillUnmount(){
        this.unsubscribe();
    }
    dropDownToggle(){
        if(this.state.isOpen) {
            this.setState({isOpen: false});
        } else {
            this.setState({isOpen: true});
        }
    }
    logout() {
        store.dispatch(logout({type: 'USER_LOGOUT'}));
    }
    render(){
        let dropDownMenuClass = 'menu';
        if(this.state.isOpen) {
            dropDownMenuClass += ' open';
        }
        return (
            <section className='dropdown'>
                <button className="dropdown_toggle" onClick={this.dropDownToggle}>
                    username
                </button>
                <ul className={dropDownMenuClass}>
                    <li>
                        <button onClick={this.logout}> LOGOUT </button>
                    </li>
                </ul>
            </section>
        );
    }
}

export default DropDown;