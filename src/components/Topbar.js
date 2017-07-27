import React from 'react';

const Topbar = ({ userList }) => {
    return (
        <section className="topbar">
            {/*
                Object.keys(userList).length + ' '
            */}
            <span> users online 0</span>
        </section>
    );
}

export default Topbar;