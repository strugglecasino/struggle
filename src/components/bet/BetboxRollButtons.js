import React from 'react';

const BetboxRollButtons = ({makeBetHandler, world}) => {

    return (
        <section className='betbox_roll_buttons'>
            <button 
               id="roll_lo"
               onClick={makeBetHandler('<')}>
                LO 
                { world.hotkeysEnabled ? <kbd> 'L' </kbd> : '' }
            </button>
            <button 
            id="roll_hi"
            onClick={makeBetHandler('>')}>
                HI
                { world.hotkeysEnabled ? <kbd> 'H' </kbd> : '' }
            </button>
        </section>
    );
}

export default BetboxRollButtons;