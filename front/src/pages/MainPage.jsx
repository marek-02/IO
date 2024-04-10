import React from 'react';
import { CSVParser } from '../components/CSVParser';
import { Table } from '../components/Table';
import { AreaChartComponent } from '../components/AreaChart';


export const MainPage = () => {
    return <div>
        <CSVParser></CSVParser>
        <Table></Table>
        <AreaChartComponent></AreaChartComponent>
    </div> 
}