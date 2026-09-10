// Import the tools used to manage the application routes
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

// Import all application pages
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import CreateDonation from './pages/CreateDonation';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';

function App() {
  return (
    // Router allows the application to display different pages
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

        {/* Donor pages */}
        <Route
          path="/donor-dashboard"
          element={<DonorDashboard />}
        />

        <Route
          path="/create-donation"
          element={<CreateDonation />}
        />
      </Routes>
    </Router>
  );
}

export default App;