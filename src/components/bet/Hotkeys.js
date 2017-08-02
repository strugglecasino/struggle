import React from 'react';

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