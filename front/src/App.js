import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DataContextProvider } from './contexts/DataContext'; 
import './App.css';
import { ChartContextProvider } from './contexts/ChartContext';
import { MainPage } from './pages/MainPage';


function App() {
  return (
    <div className="App">
      <DataContextProvider>
        <ChartContextProvider>
          <Router>
            <Routes>
              <Route path='/' element={<MainPage />} />
            </Routes>
          </Router>
        </ChartContextProvider>
      </DataContextProvider>
    </div>  
  );
}

export default App;
