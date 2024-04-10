import React, { useContext, useState } from 'react';
import { DataContext } from '../contexts/DataContext';
import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

export const Table = () => {
    const {tableData1D, isTableDataSet1D, tableData2D, keys} = useContext(DataContext);

    const [dropdown1, setDropdown1] = useState("");
    const [dropdown2, setDropdown2] = useState("");

    const columns = useMemo(
        () => [
          {
            accessorKey: 'name',
            header: 'Name',
            size: 150,
          },
          {
            accessorKey: 'type',
            header: 'Type',
            size: 150,
          },
          {
            accessorKey: 'min',
            header: 'Minimal value',
            size: 100,
          },
          {
            accessorKey: 'max',
            header: 'Maximal value',
            size: 100,
          },
          {
            accessorKey: 'mean',
            header: 'Mean',
            size: 100,
          },
          {
            accessorKey: 'median',
            header: 'Median',
            size: 100,
          },
          {
            accessorKey: 'mode',
            header: 'Mode',
            size: 100,
          },
          {
            accessorKey: 'range',
            header: 'Range',
            size: 100,
          },
          {
            accessorKey: 'quantiles',
            header: 'Quantiles',
            size: 100,
          },
          {
            accessorKey: 'variance',
            header: 'Variance',
            size: 100,
          },
          {
            accessorKey: 'standard_deviation',
            header: 'Standard deviation',
            size: 100,
          },
          {
            accessorKey: 'coefficient_of_variation',
            header: 'Coefficient of variation',
            size: 100,
          },
          {
            accessorKey: 'skewness',
            header: 'Skewness',
            size: 100,
          },
          {
            accessorKey: 'kurtosis',
            header: 'Kurtosis',
            size: 100,
          },
          {
            accessorKey: 'count',
            header: 'Data count',
            size: 100,
          },
          {
            accessorKey: 'missing',
            header: 'Missing data count',
            size: 100,
          },
          {
            accessorKey: 'missing_data_percentage',
            header: 'Missing data percentage',
            size: 100,
          },
          {
            accessorKey: 'outliers_count',
            header: "Number of outliers",
            size: 100
          }
        ],
        [],
    );

    const handleDropdown1 = (e) => {
      setDropdown1(e.target.value);
    }

    const handleDropdown2 = (e) => {
      setDropdown2(e.target.value);
    }

    const handleClick = () => {
      const keys2d = Object.keys(tableData2D);
      console.log(keys2d);
      if (dropdown1 === dropdown2) alert("Cannot check correlation of one variable");
      else {
        for (let key of keys2d) {
          let string1 = dropdown1 + " - " + dropdown2;
          let string2 = dropdown2 + " - " + dropdown1;
          if (key === string1 || key === string2) {
            let myResult = document.getElementById("result");
            myResult.innerHTML = "<h2>Correlation of variances " + dropdown1 + ' and ' + dropdown2 + ': ' + tableData2D[key].correlation.toFixed(2) + "</h2>";
          }
        }
      }
    }

    const table = useMaterialReactTable({
        columns,
        data: tableData1D
    });

    if (isTableDataSet1D) {
        return <div>
          <MaterialReactTable table={table} /><br></br>
          <h1>Display correlation of variances</h1>
          <select onChange={handleDropdown1}>
            {keys.map((o) => (
                <option value={o}>{o}</option>
            ))}
          </select>
          <select onChange={handleDropdown2}>
              {keys.map((o) => (
                  <option value={o}>{o}</option>
              ))}
          </select><br></br>
          <button onClick={handleClick}>Wyświetl</button>
          <div id='result'></div>
        </div>

    }
    else return <div></div>
}