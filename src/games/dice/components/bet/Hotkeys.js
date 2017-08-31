import React from 'react';
import className from 'classnames';

const Hotkeys = ({ toggleHotkeys, hotkeysEnabled }) => {
    let hotkeysClass = className({
        'active' : hotkeysEnabled
    });
    return (
        <section className="hotkeys">
            <button
            className={ hotkeysClass }  
            onClick={toggleHotkeys}> HOTKEYS </button>
        </section>
    );
}

export default Hotkeys;