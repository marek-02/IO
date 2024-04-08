import React from 'react';
import { CSVParser } from '../components/CSVParser';
import { Table } from '../components/Table';


export const MainPage = () => {
    return <div>
        <CSVParser></CSVParser>
        <Table></Table>
    </div> 
}