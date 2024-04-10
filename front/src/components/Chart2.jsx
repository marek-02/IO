'use client';
import React, {useContext} from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
import { DataContext } from '../contexts/DataContext';
import { ChartContext } from '../contexts/ChartContext';

export const ChartComponent2 = () => {
    const { data, variable, showCharts, types } = useContext(DataContext);

    const { minIndex, maxIndex } = useContext(ChartContext);


    if (showCharts) {
        const dataType = types[variable];

        let chartComponent2 = null;
            if ((dataType === 'Int64' || dataType === 'Float64')) {
            chartComponent2 = (
                <ResponsiveContainer width="100%" aspect={3}>
                <ScatterChart
                width={500}
                height={300}
                data={data.slice(minIndex, maxIndex)}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={data.timestamp} />
                <YAxis dataKey={variable} type="number" name={variable} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name={variable} dataKey={variable} fill="#8884d8" />
                </ScatterChart>
                </ResponsiveContainer>
            );
        }

        return (
            <div>
                {chartComponent2}
            </div>
        );
    } else {
        return <div></div>;
    }
}