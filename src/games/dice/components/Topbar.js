import React from 'react';

const Topbar = ({userList}) => {
        return (
            <section className="topbar">
                <div className="btc_price">
                    BTC / USD 
                    <span>
                        --
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
        );
}

export default Topbar;