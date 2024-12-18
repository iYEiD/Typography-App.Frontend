import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './components/Signup';
import LoginPage from './components/Login';
import HomePage from './components/Home';
import Callback from './components/Callback';
import Search from './components/Search';
import AppLayout from './components/AppLayout';
import Metadata from './components/Metadata';

const App = () => {
  return (
    <Router>


      <div className="site-layout-content">
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Navigate to="/search" />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/search" element={<AppLayout><Search /></AppLayout>} />
          <Route path="/upload" element={<AppLayout><HomePage /></AppLayout>} />
          <Route path="/metadata" element={<AppLayout><Metadata /></AppLayout>} />
        </Routes>
      </div>

    </Router>
  );
}

export default App;
