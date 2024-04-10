import React from 'react';
import { CSVParser } from '../components/CSVParser';
import { Table } from '../components/Table';
import { ChartComponent } from '../components/Chart';
import { ChartPersonalizer } from '../components/ChartPersonalizer';


export const MainPage = () => {
    return <div>
        <CSVParser></CSVParser>
        <Table></Table>
        <ChartPersonalizer></ChartPersonalizer>
        <ChartComponent></ChartComponent>
    </div> 
}