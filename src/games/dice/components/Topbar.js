import React from 'react';

const Topbar = ({userList}) => {
        return (
            <section className="topbar">
                <div className="topbar_side">
                    BTC / USD 
                    <span>
                        $0
                    </span>
                </div>
                <div className="topbar_side">
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