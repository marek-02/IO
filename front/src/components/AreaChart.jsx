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
    AreaChart,
    Area
  } from "recharts";
import { DataContext } from '../contexts/DataContext';
import { ChartPersonalizer } from './ChartPersonalizer';
import { Stats } from './Stats';
import { ChartContext } from '../contexts/ChartContext';

export const AreaChartComponent = () => {
    const { data, variable, showCharts, types } = useContext(DataContext);

    const { minIndex, maxIndex } = useContext(ChartContext);

    const data2 = [
        {
          ID: 0,
          Zmienna_A: 4000,
          Zmienna_B: 2400,
          Zmienna_C: 2400
        },
        {
          ID: 1,
          Zmienna_A: 3000,
          Zmienna_B: 1398,
          Zmienna_C: 2210
        }
      ];

      const groupValuesIntoBins = (data, variable, numBins) => {
        const values = data.map(entry => entry[variable]);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const binSize = (maxValue - minValue) / numBins;
      
        const bins = Array.from({ length: numBins }, (_, i) => ({
          bin: `${minValue + i * binSize} - ${minValue + (i + 1) * binSize}`,
          count: 0
        }));
      
        values.forEach(value => {
          const binIndex = Math.floor((value - minValue) / binSize);
          bins[binIndex].count++;
        });
      
        return bins;
      };


    if (showCharts) {
        const dataType = types[variable];

        let chartComponent = null;

        if (dataType === 'Int64') {
            // Kategoryczna - wykres kolumnowy
            chartComponent = (
                <ResponsiveContainer width="100%" aspect={3}>
                <BarChart
                width={500}
                height={300}
                data={data2}
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
                <Bar dataKey="Zmienna_A" fill="#8884d8" background={{ fill: "#eee" }} />
                </BarChart>
                </ResponsiveContainer>
            );
        } else {
            // Inne - histogram
            const numBins = 10
            const bins = groupValuesIntoBins(data2, 'Zmienna_A', numBins);
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
                <ChartPersonalizer />
                <Stats />
            </div>
        );
    } else {
        return <div></div>;
    }
}