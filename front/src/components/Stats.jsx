import React, { useState, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';

export const Stats = () => {
    const { dropdownValue } = useContext(DataContext);

    const [ jsonStats, setJsonStats ] = useState([]);

    const [ renderMode, setRenderMode ] = useState('a');


    const handleStatsRequest = async (e) => {
        e.preventDefault();
        try {
            await fetch('http://127.0.0.1:8000/api/stats/1d', {
                method: 'GET',
            }).then(e => {
                if (e.status === 200) {
                    e.json().then(e => {
                        let myJson = convertToJson(e);
                        setJsonStats(myJson);
                        setRenderMode('b');
                    })
                }
                else alert("cos poszlo nie tak")
            })
        } catch (e) {
            console.log(e);
        }
    }

    const logging = () => {
        console.log(jsonStats);
    }

    const convertToJson = (jsonString) => {
        let myJson = JSON.parse(jsonString)[dropdownValue];
        setJsonStats(myJson);
        setRenderMode('b');
    }

    if (renderMode === 'a') {
        return <div>
        <form className='refresh' onSubmit={handleStatsRequest}>
            <input type="submit" value="Get stats" />
        </form>
        <button onClick={logging}>log</button>
        </div>
    }
    else if (renderMode === 'b') {
        return <div>
            <p>Statystyki dla: {dropdownValue}</p>
            {Object.keys(jsonStats).map((o) => (
                <p>{o}: {JSON.stringify(jsonStats[o])}</p>
            ))}
            <div>
                <form className='refresh' onSubmit={handleStatsRequest}>
                    <input type="submit" value="Refresh stats" />
                </form>
            </div>
        </div>
    }
    else if (renderMode === 'c') {
        return <div>
            <button onClick={convertToJson}>Convert data</button>
            <button onClick={logging}>log</button>
        </div>
    }
}