import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DonorDashboard from './pages/DonorDashboard';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/donor-dashboard" element={<DonorDashboard/>}/>
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works"element={<HowItWorks/>} />
      </Routes>
    </Router>
  );  
}

export default App;