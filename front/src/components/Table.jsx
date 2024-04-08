import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

export const Table = () => {
    const {tableData, isTableDataSet} = useContext(DataContext);

    const columns = useMemo(
        () => [
          {
            accessorKey: 'name',
            header: 'Nazwa zmiennej',
            size: 150,
          },
          {
            accessorKey: 'type',
            header: 'Typ zmiennej',
            size: 150,
          },
          {
            accessorKey: 'min',
            header: 'Wartość minimalna',
            size: 100,
          },
          {
            accessorKey: 'max',
            header: 'Wartość maksymalna',
            size: 100,
          },
          {
            accessorKey: 'mean',
            header: 'Średnia',
            size: 100,
          },
          {
            accessorKey: 'median',
            header: 'Mediana',
            size: 100,
          },
          {
            accessorKey: 'mode',
            header: 'Mode',
            size: 100,
          },
          {
            accessorKey: 'range',
            header: 'Rozstęp',
            size: 100,
          },
          {
            accessorKey: 'quantiles',
            header: 'Kwantyle',
            size: 100,
          },
          {
            accessorKey: 'variance',
            header: 'Wariancja',
            size: 100,
          },
          {
            accessorKey: 'standard_deviation',
            header: 'Odchylenie standardowe',
            size: 100,
          },
          {
            accessorKey: 'coefficient_of_variation',
            header: 'Współczynnik zmienności',
            size: 100,
          },
          {
            accessorKey: 'skewness',
            header: 'Skośność',
            size: 100,
          },
          {
            accessorKey: 'kurtosis',
            header: 'Kurtoza',
            size: 100,
          },
          {
            accessorKey: 'count',
            header: 'Liczba danych',
            size: 100,
          },
          {
            accessorKey: 'missing',
            header: 'Liczba braków',
            size: 100,
          },
          {
            accessorKey: 'missing_data_percentage',
            header: 'Procent braków',
            size: 100,
          }
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: tableData
    });

    if (isTableDataSet) {
        return <MaterialReactTable table={table} />
    }
    else return <div></div>
}