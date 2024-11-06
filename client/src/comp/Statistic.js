import React, { useState, useRef, useEffect } from 'react';

import { scanUrl, contractAdd } from '../util/scan';


function Statistic({ selectedNetwork, icon, min, max, avg }) {



    return (
        <div className="level mb-0">
            <div className="level-item has-text-centered">
                <a href={`${scanUrl[selectedNetwork]}address/${contractAdd[selectedNetwork]}`} className="is-align-items-center is-justify-content-center" target="_blank" rel="noreferrer">
                    <span className="icon is-align-self-center m-1"  >
                        <img src={icon} />
                    </span>
                </a>
                <p className="title is-5 has-text-left is-align-items-center">{selectedNetwork}</p>
            </div>
            <div class="level-item has-text-centered">
                <div>
                    <p class="heading">Avg</p>
                    <p class="title is-5">{`${Math.round(avg)}ms`}</p>
                </div>
            </div>
            <div class="level-item has-text-centered">
                <div>
                    <p class="heading">Min</p>
                    <p class="title is-5">{`${min}ms`}</p>
                </div>
            </div>
            <div class="level-item has-text-centered">
                <div>
                    <p class="heading">Max</p>
                    <p class="title is-5">{`${max}ms`}</p>
                </div>
            </div>

        </div>
    );
}

export default Statistic;
