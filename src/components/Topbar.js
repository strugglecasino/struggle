import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    userList: state.chat.userList
});

class Topbar extends Component {
    render() {
    let { userList } = this.props;
        return (
            <section className="topbar">
                <div className="btc_price">
                    BTC / USD 
                    <span>
                        $2800
                    </span>
                </div>
                <div className="users_info">
                 USERS ONLINE
                <span>
                {
                    Object.keys(userList).length + ' '
                }
                </span>
            </div>
            </section>
        )
    }
}

export default connect(mapStateToProps)(Topbar);