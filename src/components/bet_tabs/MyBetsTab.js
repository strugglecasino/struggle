import React from 'react';

const MyBetsTab = (props) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th> ID </th>
                    <th> TIME </th>
                    <th> USER </th>
                    <th> BET </th>
                    <th> PROFIT </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        4857483
                    </td>
                    <td>
                        14:34 
                    </td>
                    <td>
                        <a href="#"> FOKUFF </a>
                    </td>
                    <td>
                        120 bits
                    </td>
                    <td>
                        -120 bits
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default MyBetsTab;