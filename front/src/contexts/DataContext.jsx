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

    const [tableData1D, setTableData1D] = useState(defaultData);

    const [isTableDataSet1D, setIsTableDataSet1D] = useState(false);

    const [tableData2D, setTableData2D] = useState(defaultData);

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

    const prepareTableData1D = (myJson) => {
        let newTableData1D = [];
        for (let v of keys) {
            let name = v;
            let type = types[v];
            let stats = myJson[v];
            if (typeof stats === "undefined") continue;
            let min = (typeof stats["min"] === "undefined") ? "-" : stats["min"].toFixed(2);
            let max = (typeof stats["max"] === "undefined") ? "-" : stats["max"].toFixed(2);
            let mean = (typeof stats["mean"] === "undefined") ? "-" : stats["mean"].toFixed(2);
            let median = (typeof stats["median"] === "undefined") ? "-" : stats["median"].toFixed(2);
            let mode = (typeof stats["mode"] === "undefined") ? "-" : stats["mode"].toFixed(2);
            let range = (typeof stats["range"] === "undefined") ? "-" : stats["range"].toFixed(2);
            let quantiles;
            if (typeof stats["quantiles"] === "undefined") quantiles = "-";
            else {
                let quantileKeys = Object.keys(stats["quantiles"]);
                let myStr = "";
                for (let key of quantileKeys) {
                    myStr += key + ": " + stats["quantiles"][key].toFixed(2) + "   ";
                }
                quantiles = myStr;
            }
            let variance = (typeof stats["variance"] === "undefined") ? "-" : stats["variance"].toFixed(2);
            let standard_deviation = (typeof stats["standard_deviation"] === "undefined") ? "-" : stats["standard_deviation"].toFixed(2);
            let coefficient_of_variation = (typeof stats["coefficient_of_variation"] === "undefined") ? "-" : stats["coefficient_of_variation"].toFixed(2);
            let skewness = (typeof stats["skewness"] === "undefined") ? "-" : stats["skewness"].toFixed(2);
            let kurtosis = (typeof stats["kurtosis"] === "undefined") ? "-" : stats["kurtosis"].toFixed(2);
            let count = (typeof stats["count"] === "undefined") ? "-" : stats["count"];
            let missing = myJson[v]["missing_data_count"];
            let missingPer = myJson[v]["missing_data_percentage"].toFixed(2);
            let outliers_count = (typeof stats["outliers_count"] === "undefined") ? "-" : stats["outliers_count"];
            newTableData1D.push({
                "name": name,
                "type": type,
                "min": min,
                "max": max,
                "mean": mean,
                "median": median,
                "mode": mode,
                "range": range,
                "quantiles": quantiles,
                "variance": variance,
                "standard_deviation": standard_deviation,
                "coefficient_of_variation": coefficient_of_variation,
                "skewness": skewness,
                "kurtosis": kurtosis,
                "count": count,
                // "sum": sum,
                "missing": missing,
                "missing_data_percentage": missingPer,
                "outliers_count": outliers_count
            })
        }
        setTableData1D(newTableData1D);
        setShowCharts(false);
        setIsTableDataSet1D(true);
    }

    const requestStats = () => {
        requestStats1D();
        requestStats2D();
    }

    const requestStats1D = async () => {
        try {
            await fetch('http://127.0.0.1:8000/api/stats/1d', {
                method: 'GET',
            }).then(e => {
                if (e.status === 200) {
                    e.json().then(e => {
                        let myJson = convertToJson(e);
                        prepareTableData1D(myJson);
                    })
                }
                else alert("cos poszlo nie tak")
            })
        } catch (e) {
            console.log(e);
        }
    }

    const requestStats2D = async () => {
        try {
            await fetch('http://127.0.0.1:8000/api/stats/2d', {
                method: 'GET',
            }).then(e => {
                if (e.status === 200) {
                    e.json().then(e => {
                        setTableData2D(e);
                    })
                }
                else alert("cos poszlo nie tak")
            })
        } catch (e) {
            console.log(e);
        }
    }

    const convertToJson = (jsonString) => {
        let someJson = JSON.parse(jsonString);
        return someJson;
    }

    const contextValue = {file, data, error, keys, types, variable, dropdownValue, size, tableData1D, isTableDataSet1D, tableData2D, showCharts, requestStats, handleFileChange, setVariable, setData, setKeys, setValue, setTypes, setSize, setTableData1D, setIsTableDataSet1D, setTableData2D, setShowCharts}
    return (
        <DataContext.Provider value={contextValue}>
            {props.children}
        </DataContext.Provider>
    );
}