import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import scanUrl from '../util/scan';

import ethereumIcon from '../assets/etherscan-logo.png'
import arbitrumIcon from '../assets/arbitrum-logo.png'
import optimismIcon from '../assets/optimism-logo.png'
import polygonIcon from '../assets/polygon-logo.png'

function StatusBar({ res, selectedNetwork, min, max, avg }) {
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [clickedIndex, setClickedIndex] = useState(null);
    const [icon, setIcon] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {

        if ((selectedNetwork) === "Polygon") {
            setIcon(polygonIcon)
        } else if ((selectedNetwork) === "Arbitrum") {
            setIcon(arbitrumIcon)
        } else if ((selectedNetwork) === "Optimism") {
            setIcon(optimismIcon)
        } else {
            setIcon(ethereumIcon)
        }

    }, [selectedNetwork]);

    // Framer Motion scroll hook
    const { scrollXProgress } = useScroll({ container: containerRef });

    if (!selectedNetwork || !res || !res[selectedNetwork]) return null;

    const entries = res[selectedNetwork];

    //dynamig height                                 
    const getHeight = (latency) => {
        const minHeight = 45;
        const maxHeight = 300;

        if (min === max) return minHeight;

        const normalizedHeight =
            ((latency - min) / (max - min)) * (maxHeight - minHeight) + minHeight;
        // console.log(`${normalizedHeight} normalized height`)
        return normalizedHeight;
    };

    const getColor = (latency) => {
        if (latency < avg) return 'has-background-success';
        if (latency >= avg && latency < max) return 'has-background-warning';
        return 'has-background-danger';
    };


    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${month.padStart(2, '0')}/${day.padStart(2, '0')}/${year}`;
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };



    return (
        <AnimatePresence key={selectedNetwork}>

            <motion.div
                layout className="status-container" ref={containerRef} style={{ position: 'relative' }} key={selectedNetwork}>
                {entries.map((entry, index) => {
                    const currentEntryDate = new Date(entry.timestamp).toISOString().slice(0, 10);
                    const previousEntryDate = index > 0 ? new Date(entries[index - 1].timestamp).toISOString().slice(0, 10) : null;
                    const entryLatency = parseInt(entry.latency)
                    const parsedDate = `${new Date(entry.timestamp).toUTCString()}`;
                    const barHeight = getHeight(entryLatency);
                    const barColor = getColor(entryLatency);

                    // console.log(`${barHeight} ${barColor} for ${entry.latency}`)
                    return (
                        <motion.div className="is-flex is-justify-content-flex-start is-align-items-flex-end" key={index}>
                            {currentEntryDate !== previousEntryDate && (
                                <div className="date-marker">
                                    {formatDate(currentEntryDate)}
                                </div>
                            )}

                            <motion.div
                                layout
                                className={`status-item is-flex ${focusedIndex === index ? 'is-focused' : 'is-faded'} ${barColor}`}
                                onHoverStart={() => clickedIndex === null && setFocusedIndex(index)}
                                onHoverEnd={() => clickedIndex === null && setFocusedIndex(null)}
                                onClick={() => setClickedIndex(clickedIndex === index ? null : index)}
                                transition={{ type: 'spring', stiffness: 100, damping: 60 }}
                                style={{
                                    position: 'relative',
                                    transformOrigin: 'center',
                                    height: `${barHeight}px`
                                }}
                            >
                                <div className="time-marker">
                                    {formatTime(entry.timestamp)}
                                </div>
                            </motion.div>

                            {focusedIndex === index && (
                                <motion.div
                                    layout
                                    className="status-info "
                                    initial={{ opacity: 0, x: 300, y: -250 }}
                                    animate={{ opacity: 1, x: 50, y: -50 }}
                                    exit={{ opacity: 0, y: -200 }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        position: 'absolute',
                                        transformOrigin: 'center',
                                        left: `calc(50% + ${scrollXProgress}%)`,
                                        // // transform: 'translateX(-50%)',
                                        zIndex: 3,
                                    }}
                                >
                                    <div className="container">
                                        <button className="delete is-pulled-right" aria-label="close" onClick={() => { setClickedIndex(null); setFocusedIndex(null); }}></button>
                                    </div>
                                    <table className="table is-bordered is-striped is-narrow">
                                        <tbody>
                                            <tr>
                                                <td><strong>Time:</strong></td>
                                                <td>{parsedDate}</td>
                                            </tr>
                                            {/* <tr>
                                                <td><strong>Status:</strong></td>
                                                <td>
                                                    <div className={`tag ${(entry.tx?.status === "complete") ? 'is-success' : 'is-warning'}`}>
                                                        {entry.tx?.status || 'N/A'}
                                                    </div>
                                                </td>
                                            </tr> */}
                                            <tr>
                                                <td> <a href={`${scanUrl[selectedNetwork]}tx/${entry.tx?.tx_hash}`} className="is-pulled-right pl-3 pr-2" target="_blank" rel="noreferrer">
                                                    <span className="icon is-small is-align-self-center"  ><img src={icon} /></span>
                                                </a><strong>Tx Hash:</strong></td>
                                                <td>  <span className="is-align-item-center">
                                                    <span>{entry?.tx_hash || 'N/A'} </span>

                                                </span></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Latency:</strong></td>
                                                <td>{entry?.latency || 'N/A'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>
            <div className="container">
                <p className="title is-6 has-text-left is-align-items-flex-end">{selectedNetwork}</p>
            </div>
        </AnimatePresence >
    );
}

export default StatusBar;
