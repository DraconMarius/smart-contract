import React, { useState, useRef, useEffect } from 'react';

import { scanUrl, contractAdd } from '../util/scan';


function Statistic({ selectedNetwork, icon, min, max, avg }) {



    return (
        <div className="level mb-0 card transparent">
            <div className="level-item">
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
            <div class="level-item has-text-centered">
                <div>
                    <p class="heading">SCAN.IO</p>
                    <a href={`${scanUrl[selectedNetwork]}address/${contractAdd[selectedNetwork]}`} target="_blank" rel="noreferrer">
                        <span className="icon is-small is-align-self-center"  >
                            <img src={icon} />
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Statistic;
