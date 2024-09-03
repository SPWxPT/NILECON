import logo from './logo.svg';
import './App.css';
import Navbar from './components/navbar';
import InformationList from './components/informationList';
import InformationView from './components/informationView';
import InformationEdit from './components/informationEdit'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Navbar />
      {/* <div>
        <InformationList />
      </div> */}
      <Router>
        <Routes>
          <Route path="/" element={<InformationList />} />
          <Route path="/information/:id" element={<InformationView />} />
          <Route path="/information/edit/:id" element={<InformationEdit />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
