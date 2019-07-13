import React from 'react';

import Chart from './Chart.js';


const App = () => {
    return (
        <div className="ui container">
            <div className="ui segment">
                <h1 id="title">United States GDP</h1>
                <div className="ui segment">
                    <Chart />
                </div>
            </div>
        </div>
    );
}

export default App;