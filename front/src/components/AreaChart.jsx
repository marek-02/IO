'use client';
import React, {useContext} from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DataContext } from '../contexts/DataContext';
import { ChartPersonalizer } from './ChartPersonalizer';
import { Stats } from './Stats';
import { ChartContext } from '../contexts/ChartContext';

export const AreaChartComponent = () => {
    const { data, variable } = useContext(DataContext);

    const { minIndex, maxIndex } = useContext(ChartContext);

    return <div>
        <ResponsiveContainer width="100%" aspect={3}>
            <AreaChart width={730} height={250} data={data.slice(minIndex - 1, maxIndex)}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <XAxis dataKey="ID" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey={variable} stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
        </AreaChart>
        </ResponsiveContainer>
        <ChartPersonalizer></ChartPersonalizer>
        <Stats></Stats>
    </div> 
}