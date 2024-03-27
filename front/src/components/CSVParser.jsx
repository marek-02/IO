import React, { useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import { Link } from "react-router-dom";
import { ChartContext } from '../contexts/ChartContext';

export const CSVParser = () => {

    const { file, error, keys, dropdownValue, handleFileChange, setVariable, setData, setKeys, setValue, setTypes, setSize } = useContext(DataContext);

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
                console.log(e.data_records.length);
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
        <Link to='/chart'>Chart</Link><br />
    </div>
}