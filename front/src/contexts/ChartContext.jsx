import React, { createContext, useState } from "react";

export const ChartContext = createContext(null);

export const ChartContextProvider = (props) => {
    const [minIndex, setMinIndex] = useState(0);
    const [maxIndex, setMaxIndex] = useState(null);

    const contextValue = {minIndex, maxIndex, setMinIndex, setMaxIndex}
    return (
        <ChartContext.Provider value={contextValue}>
            {props.children}
        </ChartContext.Provider>
    );
}