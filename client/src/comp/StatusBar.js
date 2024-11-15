import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { scanUrl } from '../util/scan';

import ethereumIcon from '../assets/etherscan-logo.png';
import arbitrumIcon from '../assets/arbitrum-logo.png';
import optimismIcon from '../assets/optimism-logo.png';
import polygonIcon from '../assets/polygon-logo.png';

import Statistic from './Statistic';

function StatusBar({ res, selectedNetwork, min, max, avg }) {
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [clickedIndex, setClickedIndex] = useState(null);
    const [icon, setIcon] = useState(null);
    const [latencyType, setLatencyType] = useState('write'); // Toggle between write and read latencies
    const containerRef = useRef(null);

    useEffect(() => {
        // Set the icon for each network
        if (selectedNetwork === "Polygon") {
            setIcon(polygonIcon);
        } else if (selectedNetwork === "Arbitrum") {
            setIcon(arbitrumIcon);
        } else if (selectedNetwork === "Optimism") {
            setIcon(optimismIcon);
        } else {
            setIcon(ethereumIcon);
        }
    }, [selectedNetwork]);

    // Framer Motion scroll hook
    const { scrollXProgress } = useScroll({ container: containerRef });

    if (!selectedNetwork || !res || !res[selectedNetwork]) return null;

    const entries = res[selectedNetwork];

    // Calculate min, max, and average latencies based on the selected latency type
    const latencies = entries.map((entry) =>
        latencyType === 'write' ? parseInt(entry.write_latency) : parseInt(entry.read_latency)
    );
    const minLatency = Math.round(Math.min(...latencies));
    const maxLatency = Math.round(Math.max(...latencies));
    const avgLatency = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);

    // Dynamically calculate bar height based on min and max latencies
    const getHeight = (latency) => {
        const minHeight = 45;
        const maxHeight = 300;

        if (minLatency === maxLatency) return minHeight;

        const normalizedHeight =
            ((latency - minLatency) / (maxLatency - minLatency)) * (maxHeight - minHeight) + minHeight;
        return normalizedHeight;
    };

    const getColor = (latency) => {
        if (latency === minLatency) return 'has-background-primary';
        if (latency < avgLatency) return 'has-background-success';
        if (latency >= avgLatency && latency < maxLatency) return 'has-background-warning';
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
        <AnimatePresence>
            {/* Statistic component to display min, max, and average */}
            <Statistic
                selectedNetwork={selectedNetwork}
                icon={icon}
                min={minLatency}
                max={maxLatency}
                avg={avgLatency}
            />

            {/* Tabs for Write and Read latency selection */}
            <div className="tabs is-centered">
                <ul>
                    <li className={latencyType === 'write' ? 'is-active' : ''}>
                        <a onClick={() => setLatencyType('write')}>Write Latency</a>
                    </li>
                    <li className={latencyType === 'read' ? 'is-active' : ''}>
                        <a onClick={() => setLatencyType('read')}>Read Latency</a>
                    </li>
                </ul>
            </div>

            <motion.div
                layout
                className="status-container"
                ref={containerRef}
                style={{ position: 'relative' }}
            >
                {entries.map((entry, index) => {
                    const currentEntryDate = new Date(entry.timestamp).toISOString().slice(0, 10);
                    const previousEntryDate = index > 0 ? new Date(entries[index - 1].timestamp).toISOString().slice(0, 10) : null;
                    const entryLatency = latencyType === 'write' ? parseInt(entry.write_latency) : parseInt(entry.read_latency);
                    const barHeight = getHeight(entryLatency);
                    const barColor = getColor(entryLatency);
                    const parsedDate = `${new Date(entry.timestamp).toUTCString()}`;

                    return (
                        <motion.div className="is-flex is-justify-content-flex-start is-align-items-flex-end" key={`${selectedNetwork}-${index}`}>
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

                            {/* Info panel for focused entry */}
                            {focusedIndex === index && (
                                <motion.div
                                    layout
                                    className="status-info"
                                    initial={{ opacity: 0, x: 300, y: -250 }}
                                    animate={{ opacity: 1, x: 25, y: -75 }}
                                    exit={{ opacity: 0, y: -200 }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        position: 'absolute',
                                        transformOrigin: 'center',
                                        left: `calc(50% + ${scrollXProgress}%)`,
                                        transform: 'translateX(-50%)',
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
                                            <tr>
                                                <td>
                                                    <a href={`${scanUrl[selectedNetwork]}tx/${entry.tx_hash}`} className="is-pulled-right pl-3 pr-2" target="_blank" rel="noreferrer">
                                                        <span className="icon is-small is-align-self-center"><img src={icon} alt="network icon" /></span>
                                                    </a>
                                                    <strong>Tx Hash:</strong>
                                                </td>
                                                <td>
                                                    <span>{entry.tx_hash || 'N/A'}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Latency:</strong></td>
                                                <td>{`${entryLatency} milliseconds` || 'N/A'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>
        </AnimatePresence>
    );
}

export default StatusBar;
