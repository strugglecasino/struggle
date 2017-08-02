import React from 'react';
import store from '../../stores/';

const Hotkeys = ({ toggleHotkeys, hotkeysEnabled }) => {
    return (
        <section className="hotkeys">
            <button
            className={ hotkeysEnabled ? 'active' : ''}  
            onClick={toggleHotkeys}> HOTKEYS </button>
        </section>
    );
}

export default Hotkeys;