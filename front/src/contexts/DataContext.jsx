import React, { createContext, useState } from "react";

export const DataContext = createContext(null);
const allowedExtensions = ["csv"];

export const DataContextProvider = (props) => {
    const defaultData = [
        {
            "name": "name",
            "type": "type",
            "min": "min",
            "max": "max",
            "mean": "mean",
            "median": "median",
            "mode": "mode",
            "range": "range",
            "quantiles": "quantiles",
            "variance": "variance",
            "standard_deviation": "standard_deviation",
            "coefficient_of_variation": "coefficient_of_variation",
            "skewness": "skewness",
            "kurtosis": "kurtosis",
            "count": "count",
            "missing": "missing",
            "missing_data_percentage": "missingPer"
        }
    ]

    const [data, setData] = useState([]);

    const [keys, setKeys] = useState([]);

    const [types, setTypes] = useState([]);

    const [variable, setVariable] = useState("");
 
    const [error, setError] = useState("");

    const [dropdownValue, setValue] = useState("")
  
    const [file, setFile] = useState(null);

    const [size, setSize] = useState(null);

    const [tableData, setTableData] = useState(defaultData);

    const [isTableDataSet, setIsTableDataSet] = useState(false);

    const [showCharts, setShowCharts] = useState(false);

    const handleFileChange = (e) => {
        setError("");

        if (e.target.files.length) {
            const inputFile = e.target.files[0];
            const fileExtension =
                inputFile?.type.split("/")[1];
            if (
                !allowedExtensions.includes(fileExtension)
            ) {
                setError("Please input a csv file");
                return;
            }
            setFile(inputFile);
        }
    };

    const contextValue = {file, data, error, keys, types, variable, dropdownValue, size, tableData, isTableDataSet, showCharts, handleFileChange, setVariable, setData, setKeys, setValue, setTypes, setSize, setTableData, setIsTableDataSet, setShowCharts}
    return (
        <DataContext.Provider value={contextValue}>
            {props.children}
        </DataContext.Provider>
    );
}