import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import { ChartContext } from '../contexts/ChartContext';

export const CSVParser = () => {

    const { file, error, keys, types, dropdownValue, handleFileChange, setVariable, setData, setKeys, setValue, setTypes, setSize, setTableData, setIsTableDataSet, setShowCharts } = useContext(DataContext);

    const { setMaxIndex } = useContext(ChartContext);

    const handleDropdown = (e) => {
        setValue(e.target.value);
        setVariable(e.target.value);
    }

    const uploadFile = async (formData) => {
        try {
            await fetch('http://127.0.0.1:8000/api/detect/', {
                method: 'POST',
                body: formData,
                type: "no-cors"
            }).then(e => e.json()).then(e => {
                setData(e.data_records);
                setTypes(e.data_types);
                setMaxIndex(e.data_records.length);
                setSize(e.data_records.length);
                setKeys(Object.keys(e.data_types));
            });
        } catch (e) {
            console.log(e);
        }
    };

    const prepareTableData = (myJson) => {
        let newTableData = [];
        for (let v of keys) {
            let name = v;
            let type = types[v];
            let stats = myJson[v];
            if (typeof stats === "undefined") continue;
            let min = (typeof stats["min"] === "undefined") ? "-" : stats["min"];
            let max = (typeof stats["max"] === "undefined") ? "-" : stats["max"];
            let mean = (typeof stats["mean"] === "undefined") ? "-" : stats["mean"];
            let median = (typeof stats["median"] === "undefined") ? "-" : stats["median"];
            let mode = (typeof stats["mode"] === "undefined") ? "-" : stats["mode"];
            let range = (typeof stats["range"] === "undefined") ? "-" : stats["range"];
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
            let variance = (typeof stats["variance"] === "undefined") ? "-" : stats["variance"];
            let standard_deviation = (typeof stats["standard_deviation"] === "undefined") ? "-" : stats["standard_deviation"];
            let coefficient_of_variation = (typeof stats["coefficient_of_variation"] === "undefined") ? "-" : stats["coefficient_of_variation"];
            let skewness = (typeof stats["skewness"] === "undefined") ? "-" : stats["skewness"];
            let kurtosis = (typeof stats["kurtosis"] === "undefined") ? "-" : stats["kurtosis"];
            let count = (typeof stats["count"] === "undefined") ? "-" : stats["count"];
            let missing = myJson[v]["missing_data_count"];
            let missingPer = myJson[v]["missing_data_percentage"];
            newTableData.push({
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
                "missing_data_percentage": missingPer
            })
        }
        setTableData(newTableData);
        setShowCharts(false);
        setIsTableDataSet(true);
    }

    const requestStats = async () => {
        try {
            await fetch('http://127.0.0.1:8000/api/stats/1d', {
                method: 'GET',
            }).then(e => {
                if (e.status === 200) {
                    e.json().then(e => {
                        let myJson = convertToJson(e);
                        prepareTableData(myJson);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (file) {
            const formData = new FormData();
            formData.append('csv_file', file);
        
            await uploadFile(formData);
        }
        else alert("Proszę wprowadzić plik");
    };

    const toggleCharts = () => {
        setIsTableDataSet(false);
        setShowCharts(true);
    };

    return <div> 
        <div className="container">
            <form method='POST' onSubmit={handleSubmit}>
                <label htmlFor="csvInput" style={{ display: "block" }}>Enter CSV File</label>
                <input onChange={handleFileChange} id="csvInput" name="file" type="File"/><br />
                <input type="submit" value="Submit" />
            </form>
        </div> 
        <div style={{ marginTop: "3rem" }}>
            {error ? error : <div />}
        </div>
        <select value={dropdownValue} onChange={handleDropdown}>
            <option value="" selected disabled hidden>Choose variable</option>
            {keys.map((o) => (
                <option value={o}>{o}</option>
                )
            )
            }
        </select><br />
        <button onClick={requestStats}>Show table</button>
        <button onClick={toggleCharts}>show charts</button> 
    </div>
}