import React from 'react';
import config from '../../../../utils/config';
import * as helpers from '../../../../utils/helpers';

const BetRow = ({bet, user}) => {
    return (
        <tr>
            <td>
                <a href={config.mp_browser_uri + '/' + bet.id }>
                 { bet.bet_id || bet.id }
                </a>
            </td>
            <td>
                { helpers.formatDateToTime(bet.created_at) }
            </td>
            <td>
              <a href={config.mp_browser_uri + '/users/' + bet.uname } target="_blank">      
                   { bet.uname }
              </a>
            </td>
            <td>
                { helpers.round10(bet.wager/100, -2) + ' ' } bits
            </td>
            <td>
                { bet.cond + bet.target.toFixed(2) }
            </td>
            <td>
                { bet.outcome }
            </td>
            <td>
                <span className={bet.profit > 0 ? 'win' : 'lose' }> 
                    { helpers.round10(bet.profit/100, -2) + ' ' } bits
                </span>
            </td>

        </tr>
    );
}

export default BetRow;