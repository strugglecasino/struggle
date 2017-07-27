import React from 'react';

const AllBetsTab = (props) => {
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
                        1                       
                    </td>
                    <td>
                        76
                    </td>
                    <td>
                        -120 bits
                    </td>
                </tr>
                <tr>
                    <td>
                        4857488
                    </td>
                    <td>
                        14:38 
                    </td>
                    <td>
                        <a href="#"> FOKUFF </a>
                    </td>
                    <td>
                        120 bits
                    </td>
                    <td>
                        1                       
                    </td>
                    <td>
                        33
                    </td>
                    <td>
                        -120 bits
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default AllBetsTab;