import React, { createContext, useState } from "react";

export const DataContext = createContext(null);
const allowedExtensions = ["csv"];

export const DataContextProvider = (props) => {
    const [data, setData] = useState([]);

    const [keys, setKeys] = useState([]);

    const [types, setTypes] = useState([]);

    const [variable, setVariable] = useState("");
 
    const [error, setError] = useState("");

    const [dropdownValue, setValue] = useState("")
  
    const [file, setFile] = useState(null);

    const [size, setSize] = useState(null);

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

    const contextValue = {file, data, error, keys, types, variable, dropdownValue, size, handleFileChange, setVariable, setData, setKeys, setValue, setTypes, setSize}
    return (
        <DataContext.Provider value={contextValue}>
            {props.children}
        </DataContext.Provider>
    );
}