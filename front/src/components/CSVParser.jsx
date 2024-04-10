import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import { ChartContext } from '../contexts/ChartContext';

export const CSVParser = () => {

    const { file, error, handleFileChange, setData, setKeys, setTypes, setSize, setIsTableDataSet1D, setShowCharts, requestStats } = useContext(DataContext);

    const { setMaxIndex } = useContext(ChartContext);

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
        setIsTableDataSet1D(false);
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
        <button onClick={requestStats}>Show table</button>
        <button onClick={toggleCharts}>show charts</button> 
    </div>
}