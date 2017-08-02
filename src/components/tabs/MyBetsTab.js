import React from 'react';
import BetRow from './BetRow';

const MyBetsTab = ({bet, world, }) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th> ID </th>
                    <th> TIME </th>
                    <th> USER </th>
                    <th> BET </th>
                    <th> TARGET </th>
                    <th> ROLL </th>
                    <th> PROFIT </th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    );
}

export default MyBetsTab;