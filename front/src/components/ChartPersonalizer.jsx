import React, { useState, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import { ChartContext } from '../contexts/ChartContext';

export const ChartPersonalizer = () => {

    const all_types = ['int64', 'float64', 'datetime64[ns]', 'object']

    const [newVariableName, setVariableName] = useState("");

    const [newVariableType, setVariableType] = useState("");

    const [dataToDelete, setDataToDelete] = useState("");

    const [ deleteAxis, setDeleteAxis ] = useState("");

    const [ fillData, setFillData ] = useState("");

    const [ outlierData, setOutlierData ] = useState("");

    const { keys, dropdownValue, variable, setVariable, setValue, setKeys, setData, setTypes, size, requestStats } = useContext(DataContext);

    const { minIndex, maxIndex, setMinIndex, setMaxIndex } = useContext(ChartContext)

    const handleDropdown = (e) => {
        setValue(e.target.value);
        setVariable(e.target.value);
    }

    const handleVariableNameChange = (e) => {
        setVariableName(e.target.value);
    }

    const handleTypeDropdown = (e) => {
        setVariableType(e.target.value);
    }

    const handleDataToDeleteChange = (e) => {
        setDataToDelete(e.target.value);
    }

    const handleDeleteDropdown = (e) => {
        setDeleteAxis(e.target.value);
    }

    const handleFillDropdown = (e) => {
        setFillData(e.target.value);
    }

    const handleOutlierDropdown = (e) => {
        setOutlierData(e.target.value);
    }

    const handleMinIndexChange = (e) => {
        setMinIndex(e.target.value);
    }

    const handleMaxIndexChange = (e) => {
        setMaxIndex(e.target.value);
    }

    const submitVariableNameChange = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('old_name', dropdownValue);
        formData.append('new_name', newVariableName);
        try {
            await fetch('http://127.0.0.1:8000/api/change_name/', {
                method: 'POST',
                body: formData,
                type: "no-cors"
            }).then(e => e.json()).then(e => {
                if (e.success === true) {
                    setData(e.data_records);
                    setTypes(e.data_types);
                    setKeys(Object.keys(e.data_types));
                    requestStats();
                }
                else alert(e.error);
            });
        } catch (e) {
            console.log(e);
        }
        console.log(keys)
    }

    const submitVariableTypeChange = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('column_name', dropdownValue);
        formData.append('new_type', newVariableType);
        console.log(dropdownValue, newVariableType);
        try {
            await fetch('http://127.0.0.1:8000/api/change_type/', {
                method: 'POST',
                body: formData,
                type: "no-cors"
            }).then(e => e.json()).then(e => {
                if (e.success === true) {
                    setData(e.data_records);
                    setTypes(e.data_types);
                    setKeys(Object.keys(e.data_types));
                    requestStats();
                }
                else alert(e.error);
            });
        } catch (e) {
            console.log(e);
        }
    }

    const submitDataDelete = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('axis', deleteAxis);
        formData.append('index', dataToDelete);
        try {
            await fetch('http://127.0.0.1:8000/api/delete/', {
                method: 'POST',
                body: formData,
                type: "no-cors"
            }).then(e => e.json()).then(e => {
                if (e.success === true) {
                    setData(e.data_records);
                    setTypes(e.data_types);
                    setKeys(Object.keys(e.data_types));
                    requestStats();
                }
                else alert(e.error);
            });
        } catch (e) {
            console.log(e);
        }
    }
    
    const submitDataFill = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('column', dropdownValue);
        formData.append('statistic', fillData);
        try {
            await fetch('http://127.0.0.1:8000/api/fill/missings/', {
                method: 'POST',
                body: formData,
                type: "no-cors"
            }).then(e => e.json()).then(e => {
                if (e.success === true) {
                    setData(e.data_records);
                    setTypes(e.data_types);
                    setKeys(Object.keys(e.data_types));
                    requestStats();
                }
                else alert(e.error);
            });
        } catch (e) {
            console.log(e);
        }
    }

    const submitOutlierFill = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('column', dropdownValue);
        formData.append('statistic', outlierData);
        try {
            await fetch('http://127.0.0.1:8000/api/fill/outliers/', {
                method: 'POST',
                body: formData,
                type: "no-cors"
            }).then(e => e.json()).then(e => {
                if (e.success === true) {
                    setData(e.data_records);
                    setTypes(e.data_types);
                    setKeys(Object.keys(e.data_types));
                    requestStats();
                }
                else alert(e.error);
            });
        } catch (e) {
            console.log(e);
        }
    }

    const handleDownload = async (e) => {
        e.preventDefault();
        try {
            await fetch('http://127.0.0.1:8000/api/result/', {
                method: 'GET',
                type: "no-cors"
            }).then(e => e.body)
            .then(body => {
                const reader = body.getReader();
                return new ReadableStream({
                    start(controller) {
                        return pump();
                        function pump() {
                            return reader.read().then(({ done, value }) => {
                                if (done) {
                                    controller.close();
                                    return;
                                }
                            controller.enqueue(value);
                            return pump();
                            });
                        }
                    },
                });
            }).then(stream => new Response(stream))
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    const filename = "new_file.csv";
                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                });
        } catch (e) {
            console.log(e);
        }
    }

    return <div>
        <h1>Choose variable you want to edit</h1>
        <select value={variable} onChange={handleDropdown}>
            {keys.map((o) => (
                <option value={o}>{o}</option>
            ))}
        </select><br />
        <form method='POST' className='personalizer' onSubmit={submitVariableNameChange}>
            <label htmlFor="var" style={{ display: "block" }}>Change Variable Name</label>
            <input onChange={handleVariableNameChange} id="varInput" name="var" type="text" placeholder='New variable name'/><br />
            <input type="submit" value="Submit" />
        </form>
        <form method='POST' className='personalizer' onSubmit={submitVariableTypeChange}>
            <select onChange={handleTypeDropdown}>
                <option value="" selected disabled hidden>Choose type</option>
                {all_types.map((o) => (
                    <option value={o}>{o}</option>
                ))}
            </select>
            <input type="submit" value="Submit" />
        </form>
        <form method='POST' className='personalizer' onSubmit={submitDataDelete}>
            <label htmlFor="del" style={{ display: "block" }}>Delete data</label>
            <input onChange={handleDataToDeleteChange} id="varInput" name="del" type="text" placeholder='New variable name'/><br />
            <select onChange={handleDeleteDropdown}>
                <option value="rows">rows</option>
                <option value="columns">columns</option>
            </select>
            <input type="submit" value="Submit" />
        </form>
        <form method='POST' className='personalizer' onSubmit={submitDataFill}>
            <label style={{ display: "block" }}>Fill data</label>
            <select onChange={handleFillDropdown}>
                <option value="min">min</option>
                <option value="max">max</option>
                <option value="mean">mean</option>
                <option value="median">median</option>
                <option value="mode">mode</option>
                <option value="range">range</option>
                <option value="variance">variance</option>
                <option value="standard_deviation">standard deviation</option>
                <option value="coefficient_of_variation">coefficient of variation</option>
                <option value="skewness">skewness</option>
                <option value="kurtosis">kurtosis</option>
            </select>
            <input type="submit" value="Submit" />
        </form>
        <form method='POST' className='personalizer' onSubmit={submitOutlierFill}>
            <label style={{ display: "block" }}>Fix outliers</label>
            <select onChange={handleOutlierDropdown}>
                <option value="min">min</option>
                <option value="max">max</option>
                <option value="mean">mean</option>
                <option value="median">median</option>
                <option value="mode">mode</option>
                <option value="range">range</option>
                <option value="variance">variance</option>
                <option value="standard_deviation">standard deviation</option>
                <option value="coefficient_of_variation">coefficient of variation</option>
                <option value="skewness">skewness</option>
                <option value="kurtosis">kurtosis</option>
            </select>
            <input type="submit" value="Submit" />
        </form>
        <label style={{ display: "block" }}>Set minimal index</label>
        <input type='number' onChange={handleMinIndexChange} min={1} max={maxIndex} defaultValue={1}></input>
        <label style={{ display: "block" }}>Set maximal index</label>
        <input type='number' onChange={handleMaxIndexChange} min={minIndex} max={size} defaultValue={size}></input> <br></br>
        <button onClick={handleDownload}>Pobierz plik CSV</button>
    </div> 
}