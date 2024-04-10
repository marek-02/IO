'use client';
import React, {useContext} from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
import { DataContext } from '../contexts/DataContext';
import { ChartContext } from '../contexts/ChartContext';

export const ChartComponent = () => {
    const { data, variable, showCharts, types, dropdownValue } = useContext(DataContext);

    const { minIndex, maxIndex } = useContext(ChartContext);

    const groupValuesIntoBins = (data, variable, numBins) => {
      const values = data.map(entry => entry[variable]);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      const binSize = (maxValue - minValue) / numBins;
    
      const bins = Array.from({ length: numBins }, (_, i) => ({
        bin: `${minValue + i * binSize} - ${minValue + (i + 1) * binSize}`,
        count: 0
      }));

      console.log(bins);
    
      values.forEach(value => {
        let binIndex = Math.floor((value - minValue) / binSize);
        if (binIndex === numBins) binIndex -= 1;
        bins[binIndex].count++;
      });
    
      return bins;
    };


    if (showCharts) {
        const dataType = types[variable];

        let chartComponent = null;

        if (!(dataType === 'Int64' || dataType === 'Float64')) {
            // Kategoryczna - wykres kolumnowy
            chartComponent = (
                <ResponsiveContainer width="100%" aspect={3}>
                <BarChart
                width={500}
                height={300}
                data={data.slice(minIndex, maxIndex)}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
                barSize={20}
                >
                <XAxis dataKey="ID" />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey={dropdownValue} fill="#8884d8" background={{ fill: "#eee" }} />
                </BarChart>
                </ResponsiveContainer>
            );
        } else {
            // Numeryczna - histogram
            const numBins = 10
            const bins = groupValuesIntoBins(data.slice(minIndex, maxIndex), dropdownValue, numBins);
            chartComponent = (
                <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={bins}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bin" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Liczba wystąpień" />
                </BarChart>
                </ResponsiveContainer>
            );
            // boxplot
        }

        return (
            <div>
                {chartComponent}
            </div>
        );
    } else {
        return <div></div>;
    }
}