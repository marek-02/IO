import { AreaChartComponent } from './components/AreaChart';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CSVParser } from './components/CSVParser';
import { DataContextProvider } from './contexts/DataContext'; 
import './App.css';
import { ChartContextProvider } from './contexts/ChartContext';


function App() {
  return (
    <div className="App">
      <DataContextProvider>
        <ChartContextProvider>
          <Router>
            <Routes>
              <Route path='/' element={<CSVParser />} />
              <Route path='chart' element={<AreaChartComponent />} />
            </Routes>
          </Router>
        </ChartContextProvider>
      </DataContextProvider>
    </div>  
  );
}

export default App;
