import React, { useState, useEffect, useRef } from 'react';
import Nav from './Nav';
import StatusBar from '../comp/StatusBar';
import loadingIcon from '../assets/loading.gif';
import { getDB } from '../util/api';
import { motion } from 'framer-motion';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';


function Disp() {
    const [loading, setLoading] = useState(true);
    const [db, setDB] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const wsUri = process.env.REACT_APP_WS_URL || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//localhost:3001`;
    const wsRef = useRef(null);


    const fetchData = async () => {
        try {
            const res = await getDB();
            console.log('Fetched data:', res);
            setDB(res);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const connectWebSocket = (retryDelay = 1000) => {
        wsRef.current = new WebSocket(wsUri);
        console.log(`wsUri: ${wsUri}`)

        wsRef.current.onopen = () => {
            console.log('Connected to WebSocket server');
            retryDelay = 1000; // Reset delay if fine
        };

        wsRef.current.onmessage = (message) => {
            const data = JSON.parse(message.data);
            console.log('WebSocket message received:', data);

            // update, refresh the data
            if (data.message === 'update') {
                console.log(`Data update received from WebSocket: ${data.log}`);
                fetchData();
            }

            if (data.error) {
                console.log(`Error: ${data.error}`);
            }
        };

        wsRef.current.onclose = () => {
            console.log('WebSocket connection closed');
            setTimeout(() => connectWebSocket(retryDelay * 2), retryDelay);
        };

        wsRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            wsRef.current.close();
        };
    };

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchData();

        connectWebSocket();

        return () => {
            if (wsRef.current) wsRef.current.close();
        };
    }, []);



    return (
        <motion.div className="hero-background" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {loading || !db ? (
                <motion.div className="modal is-active" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="modal-background">
                        <div className=" is-flex is-justify-content-center is-align-items-center">
                            <motion.div
                                className="modal-content is-flex is-justify-content-center"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                            >
                                <div className="image is-48x48 is-align-self-center">
                                    <img src={loadingIcon} alt="loading gif" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.section
                    className="hero is-fullheight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="hero-head has-text-centered">
                        <Nav />
                        <div className="container ">
                            <div className="clock-container is-align-items-center is-justify-content-center is-flex has-text-dark">
                                <Clock
                                    value={currentTime}
                                    renderNumbers={true}
                                    hourHandLength={70}
                                    minuteHandLength={90}
                                    secondHandLength={100}
                                    size={120}
                                    hourHandWidth={6}
                                    minuteHandWidth={4}
                                    secondHandWidth={2}
                                    style={{ margin: 'auto' }}
                                />
                                <p>{currentTime.toUTCString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="hero-body is-justify-content-center">
                        <div className="container has-text-centered">

                            {Object.keys(db).map((networkKey) => {
                                // Calculate min, max, and average latency
                                const entries = db[networkKey];
                                const latencies = entries.map((entry) => parseInt(entry?.latency) || 0);
                                const minLatency = Math.round(Math.min(...latencies));
                                const maxLatency = Math.round(Math.max(...latencies));
                                const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;

                                // console.log(`${avgLatency} ${minLatency} ${maxLatency} latencies for ${networkKey}`)

                                return (
                                    <div className="container is-justify-content-center card transparent" key={networkKey}>
                                        <StatusBar
                                            res={db}
                                            selectedNetwork={networkKey}
                                            key={networkKey}
                                            min={minLatency}
                                            max={maxLatency}
                                            avg={avgLatency}
                                        />
                                        <div className="card-footer"></div>
                                    </div>
                                )
                            })}

                        </div>
                    </div>

                    <div className="hero-foot">
                        <nav className="tabs is-boxed is-fullwidth">
                            <div className="container pt-0 has-text-warning">
                                <ul>
                                    <li>
                                        <a href="https://docs.alchemy.com" target="_blank" rel="noreferrer">Alchemy Docs</a>
                                    </li>
                                    <li>
                                        <a href="https://github.com/DraconMarius/smart-contract" target="_blank" rel="noreferrer">Github</a>
                                    </li>
                                    <li>
                                        <a href="https://www.linkedin.com/in/mari-ma-70771585" target="_blank" rel="noreferrer">Contact</a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </motion.section>
            )}
        </motion.div>
    );
}

export default Disp;
